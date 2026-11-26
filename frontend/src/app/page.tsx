"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accessibility, Activity, AlertTriangle, ArrowLeft, AudioLines, Check, ClipboardCheck,
  ClipboardList, Eye, HeartPulse, LoaderCircle, Moon, Send, ShieldCheck, Stethoscope,
  Sun, Upload, UserRound, UsersRound, Volume2, Mic, X,
} from "lucide-react";

const api = process.env.NODE_ENV === "production" ? "" : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000");
const patientSchema = z.object({
  name: z.string().trim().min(1, "Informe um nome fictício para esta validação.").max(120),
  informant_type: z.enum(["patient", "companion", "staff"]),
});
type PatientForm = z.infer<typeof patientSchema>;
type InformantType = PatientForm["informant_type"];
type ChatMessage = { id: string; role: string; content: string };
type Session = { id: string; status: string; messages: ChatMessage[]; provider_mode: string; informant_type: InformantType; collected: Record<string, string>; session_token?: string };
type SoapContent = { queixa_principal: string; tempo_evolucao: string; fonte_relato: string; soap: { subjetivo: string; objetivo: string; avaliacao: string; plano: string }; historico: { medicamentos_em_uso: string[]; alergias: string[]; comorbidades: string[] }; alertas_red_flags: string[]; sugestoes_cid: string[] };
type Report = { id: string; session_id: string; informant_type: InformantType; status: string; messages: ChatMessage[]; content: SoapContent };
type ReportRow = { id: string; patient_name: string; is_demo: boolean; status: string; created_at: string };
type View = "home" | "patient" | "chat" | "confirm" | "report" | "doctor" | "review" | "accessibility";

const informantLabel: Record<InformantType, string> = {
  patient: "Paciente",
  companion: "Acompanhante ou responsável",
  staff: "Equipe de atendimento assistido",
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${api}${path}`, init);
  const body = await response.text();
  let data: { detail?: string } = {};
  try { data = body ? JSON.parse(body) as { detail?: string } : {}; } catch { /* proxy errors may not be JSON */ }
  if (!response.ok) {
    const detail = data.detail || `Erro HTTP ${response.status}${response.statusText ? ` · ${response.statusText}` : ""}`;
    throw new Error(detail);
  }
  return data as T;
}
const patientHeaders = () => ({ "X-Session-Token": sessionStorage.getItem("sessionToken") ?? "" });
const doctorHeaders = () => ({ "X-Clinician-Token": sessionStorage.getItem("clinicianToken") ?? "" });




export default function Home() {
  const [view, setView] = useState<View>("home");
  const [session, setSession] = useState<Session | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [provider, setProvider] = useState("Conectando à Lumi…");
  const [databaseStatus, setDatabaseStatus] = useState("checking");
  const [databaseError, setDatabaseError] = useState("");
  const [message, setMessage] = useState("");
  const [clinicianToken, setClinicianToken] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [soap, setSoap] = useState<SoapContent | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [listening, setListening] = useState(false);
  const [cloudTranscription, setCloudTranscription] = useState(true);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const sendLockRef = useRef(false);
  const { register, handleSubmit, formState: { errors } } = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
    defaultValues: { name: "Paciente demonstrativo", informant_type: "patient" },
  });

  useEffect(() => {
    const seenIntro = sessionStorage.getItem("lumiIntroSeen") === "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seenIntro || reducedMotion) setIntroVisible(false);
    const timer = window.setTimeout(() => setIntroVisible(false), 5200);
    request<{ provider: string; transcription: boolean; database: string; database_error?: string | null }>("/api/health")
      .then(data => {
        setCloudTranscription(data.transcription);
        setDatabaseStatus(data.database);
        setDatabaseError(data.database_error ?? "");
        setProvider(data.database === "migration_required" ? "Migration do banco pendente" : data.database !== "ready" ? "Banco indisponível" : data.provider === "groq" ? "IA configurada" : "Modo demonstrativo");
      })
      .catch(() => { setDatabaseStatus("unavailable"); setProvider("API indisponível"); });
    const savedId = sessionStorage.getItem("anamnesisSession");
    const token = sessionStorage.getItem("sessionToken");
    if (savedId && token) {
      request<Session>(`/api/sessions/${savedId}`, { headers: { "X-Session-Token": token } })
        .then(setSession)
        .catch(() => sessionStorage.removeItem("anamnesisSession"));
    }
    return () => window.clearTimeout(timer);
  }, []);

  function finishIntro() {
    sessionStorage.setItem("lumiIntroSeen", "true");
    setIntroVisible(false);
  }

  async function startInterview(values: PatientForm) {
    setError("");
    if (databaseStatus === "migration_required") { setError("O banco do Supabase está sem as migrations do Lumi. Aplique os arquivos SQL da pasta supabase/migrations e tente novamente."); return; }
    if (databaseStatus === "unavailable") { setError(databaseError === "database_url_missing" ? "DATABASE_URL não está configurada no ambiente Production da Vercel. Cadastre a conexão do Supabase e faça um novo deploy." : databaseError === "authentication_failed" ? "O Supabase recusou a conexão. Confira usuário do pooler, senha e se caracteres especiais da senha estão codificados na DATABASE_URL." : databaseError === "driver_missing" ? "O driver PostgreSQL não está instalado no serviço da API. Confira o deploy do backend e requirements.txt." : databaseError === "connection_timeout" ? "A conexão com o Supabase expirou. Confira host, porta 6543 e rede do pooler." : `A conexão com o banco falhou (${databaseError || "sem diagnóstico"}). Confira DATABASE_URL no ambiente Production da Vercel.`); return; }
    setBusy(true);
    try {
      const created = await request<Session>("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_name: values.name, informant_type: values.informant_type, demo: true }),
      });
      sessionStorage.setItem("anamnesisSession", created.id);
      sessionStorage.setItem("sessionToken", created.session_token ?? "");
      setSession(created); setView("chat");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function resumeInterview() {
    if (!session) return;
    try {
      const recovered = await request<Session>(`/api/sessions/${session.id}`, { headers: patientHeaders() });
      setSession(recovered); setView("chat");
    } catch (e) { setError((e as Error).message); }
  }

  async function sendMessage() {
    if (!session || !message.trim() || busy || listening || sendLockRef.current || session.status !== "in_progress") return;
    const content = message.trim();
    sendLockRef.current = true;
    setBusy(true); setError("");
    try {
      const updated = await request<Session>(`/api/sessions/${session.id}/messages`, {
        method: "POST",
        headers: { ...patientHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      setSession(updated); setMessage(""); setTranscriptionReady(false);
      if (updated.status === "urgent") setError("Procure a equipe de saúde agora. Não aguarde o fim da entrevista.");
    } catch (e) { setError((e as Error).message); }
    finally { sendLockRef.current = false; setBusy(false); }
  }

  async function startVoiceInput() {
    if (listening) {
      mediaRecorderRef.current?.stop();
      return;
    }
    setError("");
    if (!cloudTranscription) {
      setError("A transcrição pelo servidor precisa da GROQ_API_KEY configurada na API. Configure a chave no ambiente do backend e reinicie o serviço.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Este navegador não permite gravação de áudio. Tente atualizar o navegador ou envie um arquivo de áudio.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      audioChunksRef.current = [];
      const preferredType = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]
        .find(type => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, preferredType ? { mimeType: preferredType } : undefined);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = event => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      recorder.onerror = () => {
        stream.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
        mediaRecorderRef.current = null;
        setListening(false);
        setError("A gravação foi interrompida pelo navegador. Verifique a permissão do microfone e tente novamente.");
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        audioStreamRef.current = null;
        mediaRecorderRef.current = null;
        setListening(false);
        const mimeType = recorder.mimeType || "audio/webm";
        const extension = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];
        if (!blob.size) { setError("Não recebemos áudio. Grave novamente e fale perto do microfone."); return; }
        await uploadAudio(new File([blob], `resposta.${extension}`, { type: mimeType }));
      };
      recorder.start(250);
      setListening(true);
    } catch (e) {
      audioStreamRef.current?.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
      const name = (e as DOMException).name;
      setError(name === "NotAllowedError" ? "O acesso ao microfone foi negado. Autorize o microfone nas permissões do navegador e tente novamente." : "Não foi possível acessar o microfone. Confira se ele está conectado e não está sendo usado por outro aplicativo.");
    }
  }
  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setError("Leitura em voz alta não está disponível neste navegador.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  async function uploadAudio(file?: File) {
    if (!session || !file || sendLockRef.current) return;
    sendLockRef.current = true;
    const form = new FormData(); form.append("file", file); setBusy(true); setError("");
    try {
      const result = await request<{ transcript: string }>(`/api/sessions/${session.id}/audio`, { method: "POST", headers: patientHeaders(), body: form });
      setMessage(result.transcript);
      setTranscriptionReady(true);
    } catch (e) { setError((e as Error).message); }
    finally { sendLockRef.current = false; setBusy(false); }
  }

  function beginConfirmation() {
    if (!session) return;
    setError(""); setView("confirm");
  }

  async function generateReport() {
    if (!session) return;
    setBusy(true); setError("");
    try {
      const result = await request<Report>(`/api/sessions/${session.id}/finalize`, { method: "POST", headers: patientHeaders() });
      setReport(result); setView("report");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function loadReports(token = clinicianToken) {
    sessionStorage.setItem("clinicianToken", token); setBusy(true); setError("");
    try { setReports(await request<ReportRow[]>("/api/reports", { headers: { "X-Clinician-Token": token } })); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function openReview(id: string) {
    setBusy(true); setError("");
    try {
      const detail = await request<Report>(`/api/reports/${id}`, { headers: { ...doctorHeaders(), "X-Clinician-Token": clinicianToken } });
      setReport(detail); setSoap(structuredClone(detail.content)); setReviewNotes(""); setView("review");
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  async function approve() {
    if (!report || !soap) return;
    setBusy(true); setError("");
    try {
      await request<Report>(`/api/reports/${report.id}/review`, {
        method: "PATCH",
        headers: { ...doctorHeaders(), "X-Clinician-Token": clinicianToken, "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer: "Profissional de saúde", notes: reviewNotes, approved: true, edited_content: soap }),
      });
      setView("doctor"); await loadReports();
    } catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  function changeSoap(field: keyof SoapContent["soap"], value: string) {
    setSoap(current => current ? { ...current, soap: { ...current.soap, [field]: value } } : null);
  }

  function newInterview() {
    sessionStorage.removeItem("anamnesisSession");
    sessionStorage.removeItem("sessionToken");
    setSession(null); setReport(null); setMessage(""); setError(""); setView("patient");
  }

  const isPatientView = ["home", "patient", "chat", "confirm", "report"].includes(view);

  return <>
    {introVisible && <div className="intro-overlay" role="dialog" aria-label="Abertura da Lumi">
      <video className="intro-video" autoPlay muted playsInline onEnded={finishIntro} onError={finishIntro}>
        <source src="/lumi-intro.mp4" type="video/mp4"/>
      </video>
      <button className="intro-skip" onClick={finishIntro}>Pular abertura <X size={16}/></button>
      <div className="intro-progress"/>
    </div>}

    <main className="shell" data-theme={darkMode ? "dark" : "light"}>
      <header className="topbar">
        <button className="brand" onClick={()=>setView("home")} aria-label="Lumi, início">
          <img className="logo-image" src="/lumi-logo.png" alt="Lumi — O cuidado começa antes"/>
        </button>
        <div className="top-actions">
          <span className="status-pill"><Activity size={15}/>{provider}</span>
          <button className="tool-btn" aria-label={darkMode ? "Ativar tema claro" : "Ativar tema escuro"} onClick={()=>setDarkMode(v=>!v)}>{darkMode?<Sun size={17}/>:<Moon size={17}/>}</button>
          <button className="tool-btn" aria-label="Aumentar ou restaurar tamanho do texto" onClick={()=>{setLargeText(v=>!v);document.body.classList.toggle("large-type");}}>Aa</button>
          <button className="tool-btn" aria-label="Ouvir apresentação" onClick={()=>speak("Olá. Eu sou a Lumi. O cuidado começa antes. Escolha começar uma pré-anamnese ou acessar a área profissional.")}><Volume2 size={17}/></button>
        </div>
      </header>

      <nav className="nav" aria-label="Navegação principal">
        <button className={`tab ${isPatientView?"active":""}`} onClick={()=>setView(session?"chat":"home")}><HeartPulse size={16}/>Paciente</button>
        <button className={`tab ${["doctor","review"].includes(view)?"active":""}`} onClick={()=>setView("doctor")}><Stethoscope size={16}/>Equipe de saúde</button>
        <button className={`tab ${view==="accessibility"?"active":""}`} onClick={()=>setView("accessibility")}><Accessibility size={16}/>Acessibilidade</button>
      </nav>

      {error && <div className={`notice ${error.includes("equipe de saúde agora")?"warning":""}`} role="alert"><AlertTriangle size={18}/><span>{error}</span></div>}

      {view === "home" && <>
        <section className="hero subtle-wave">
          <div>
            <span className="eyebrow">PRÉ-ATENDIMENTO HUMANIZADO</span>
            <h1>O cuidado começa antes.</h1>
            <p>Organize o relato de saúde com calma. A equipe recebe as informações para revisar antes do atendimento.</p>
          </div>
          <div className="hero-mark"><img src="/lumi-logo.png" alt="Símbolo e nome Lumi"/></div>
        </section>
        <div className="path-grid">
          <section className="path-card">
            <h2><Stethoscope size={20}/>Para a equipe de saúde</h2>
            <p>Acesse os relatos enviados, confira a conversa e revise o relatório antes de aprová-lo.</p>
            <button className="button primary" onClick={()=>setView("doctor")}>Abrir painel profissional <ArrowLeft className="rotate-180" size={16}/></button>
          </section>
          <section className="path-card">
            <h2><HeartPulse size={20}/>Para paciente ou acompanhante</h2>
            <p>Responda uma pergunta por vez. Você pode escrever, falar ou pedir ajuda para alguém.</p>
            <button className="button primary" onClick={()=>setView("patient")}>Começar pré-anamnese <ArrowLeft className="rotate-180" size={16}/></button>
            {session && <button className="button ghost mt-2" onClick={resumeInterview}>Retomar entrevista em andamento</button>}
          </section>
        </div>
        <div className="notice info"><ShieldCheck size={18}/><span>As informações ficam em um relatório preliminar para revisão profissional. A Lumi não faz diagnóstico nem prescreve tratamentos.</span></div>
      </>}

      {view === "patient" && <section className="panel">
        <button className="tab" onClick={()=>setView("home")}><ArrowLeft size={16}/>Voltar</button>
        <span className="badge"><HeartPulse size={15}/>NOVA ENTREVISTA</span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--navy)]">Vamos começar com você.</h1>
        <p className="muted mt-2">Use apenas informações fictícias nesta versão de validação. Se precisar, uma pessoa de confiança ou alguém da equipe pode responder com você.</p>
        <div className="notice warning"><AlertTriangle size={18}/><span>Se você precisa de ajuda imediata, procure a equipe de saúde agora. Não espere a entrevista terminar.</span></div>
        <form onSubmit={handleSubmit(startInterview)}>
          <label className="field">Nome fictício para esta validação<input className="input" autoComplete="off" {...register("name")}/>{errors.name && <span className="field-error">{errors.name.message}</span>}</label>
          <fieldset className="field border-0 p-0"><legend>Quem vai responder?</legend>
            <div className="choices">
              <label className="choice"><input type="radio" value="patient" {...register("informant_type")}/><UserRound size={17}/>A própria pessoa</label>
              <label className="choice"><input type="radio" value="companion" {...register("informant_type")}/><UsersRound size={17}/>Acompanhante</label>
              <label className="choice"><input type="radio" value="staff" {...register("informant_type")}/><Stethoscope size={17}/>Equipe auxiliando</label>
            </div>
          </fieldset>
          <button className="button primary mt-2" disabled={busy}>{busy?<LoaderCircle className="spinner"/>:<HeartPulse size={17}/>}Iniciar conversa</button>
        </form>
        {session && <button className="button ghost mt-3" onClick={resumeInterview}>Retomar entrevista em andamento</button>}
      </section>}

      {view === "chat" && session && <section className="panel">
        <div className="row"><div><span className="badge">ENTREVISTA · {informantLabel[session.informant_type]}</span><h1 className="mt-3 text-2xl font-semibold text-[var(--navy)]">Vamos conversar sobre sua saúde.</h1></div><button className="button" disabled={busy} onClick={beginConfirmation}><ClipboardList size={17}/>Conferir relato</button></div>
        <div className="notice info mt-4">{session.provider_mode === "groq" ? "IA configurada. As respostas dependem da disponibilidade da Groq; a revisão clínica continua com a equipe." : "Modo demonstrativo por regras. As respostas não são geradas por IA."}</div>
        {session.status === "urgent" && <div className="notice warning"><AlertTriangle size={18}/><span>Procure a equipe de saúde agora. Não é necessário concluir esta entrevista.</span></div>}
        <div className="chat" aria-live="polite">{session.messages.map(item=><article key={item.id} className={`message ${item.role === "user" ? "user" : ""}`}><span className="message-name">{item.role === "user"?informantLabel[session.informant_type]:"Lumi"}</span>{item.content}{item.role!=="user"&&<div className="message-tools"><button className="mini-btn" onClick={()=>speak(item.content)}><Volume2 size={14}/>Ouvir pergunta</button></div>}</article>)}</div>
        {session.status === "in_progress" && <>
          {transcriptionReady && <div className="notice success">Transcrição pronta. Confira o texto e toque em Enviar.</div>}
          <div className="compose"><input className="input" value={message} maxLength={5000} placeholder="Escreva sua resposta…" aria-label="Sua resposta" onChange={e=>{setMessage(e.target.value);setTranscriptionReady(false);}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();void sendMessage();}}}/><button className="button primary" disabled={busy||!message.trim()} onClick={sendMessage}>{busy?<LoaderCircle className="spinner"/>:<Send size={17}/>}Enviar</button></div>
          <div className="row mt-3 flex-wrap"><button className="button ghost" disabled={busy} onClick={startVoiceInput}>{listening?<AudioLines size={17}/>:<Mic size={17}/>}{listening?"Parar e transcrever":"Gravar resposta"}</button><label className="button ghost"><Upload size={17}/>Enviar áudio<input className="sr-only" type="file" accept="audio/webm,audio/wav,audio/mpeg,audio/mp4,audio/ogg" onChange={e=>void uploadAudio(e.target.files?.[0])}/></label></div>
        </>}
        <p className="muted mt-3 text-sm">Uma pergunta por vez. Se não souber, pode dizer “não sei”.</p>
      </section>}

      {view === "confirm" && session && <section className="panel">
        <button className="tab" onClick={()=>setView("chat")}><ArrowLeft size={16}/>Voltar à conversa</button>
        <span className="badge"><ClipboardCheck size={15}/>CONFIRMAÇÃO DO RELATO</span>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--navy)]">Este relato representa o que você contou?</h1>
        <p className="muted mt-2">Confira as respostas antes de organizar o relatório para a equipe. Se algo estiver errado ou faltando, volte à conversa para corrigir.</p>
        <div className="notice info"><UserRound size={18}/><span>Quem respondeu: <strong>{informantLabel[session.informant_type]}</strong></span></div>
        <div className="chat max-h-96">{session.messages.filter(item=>item.role==="user").map(item=><article key={item.id} className="message user"><span className="message-name">{informantLabel[session.informant_type]}</span>{item.content}</article>)}</div>
        <div className="row mt-4 flex-wrap"><button className="button ghost" onClick={()=>setView("chat")}><ArrowLeft size={16}/>Corrigir ou acrescentar</button><button className="button primary" disabled={busy} onClick={generateReport}>{busy?<LoaderCircle className="spinner"/>:<Check size={17}/>}Confirmar e gerar relatório</button></div>
      </section>}

      {view === "report" && report && <section className="panel"><span className="badge"><Check size={15}/>RELATÓRIO PRELIMINAR · AGUARDANDO REVISÃO</span><h1 className="mt-3 text-3xl font-semibold text-[var(--navy)]">Obrigado por compartilhar.</h1><p className="muted mt-2">A equipe de saúde poderá conferir e corrigir estas informações antes de validá-las.</p><SoapView content={report.content}/><button className="button primary mt-4" onClick={newInterview}>Encerrar e voltar ao início</button></section>}

      {view === "doctor" && <section className="panel"><span className="badge"><Stethoscope size={15}/>ÁREA DA EQUIPE DE SAÚDE</span><h1 className="mt-3 text-3xl font-semibold text-[var(--navy)]">Relatos para revisão</h1><p className="muted mt-2">Os relatos são preliminares. A validação depende do profissional de saúde.</p><div className="compose mt-4"><input className="input" type="password" autoComplete="current-password" placeholder="Token profissional de validação" value={clinicianToken} onChange={e=>setClinicianToken(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void loadReports();}}/><button className="button primary" disabled={busy} onClick={()=>void loadReports()}>{busy?<LoaderCircle className="spinner"/>:<ShieldCheck size={16}/>}Acessar relatos</button></div><div className="list">{reports.length?reports.map(item=><article key={item.id} className="list-item"><div><strong>{item.patient_name} {item.is_demo&&<span className="badge ml-2">FICTÍCIO</span>}</strong><p className="muted mt-1 text-sm">{item.status} · {new Date(item.created_at).toLocaleString("pt-BR")}</p></div><button className="button" onClick={()=>void openReview(item.id)}>Abrir revisão</button></article>):<div className="empty">{busy?"Carregando relatos…":"Informe o token para carregar os relatos pendentes."}</div>}</div></section>}

      {view === "review" && report && soap && <section className="panel"><button className="tab" onClick={()=>setView("doctor")}><ArrowLeft size={16}/>Voltar aos relatos</button><span className="badge">REVISÃO PROFISSIONAL · {report.status}</span><h1 className="mt-3 text-3xl font-semibold text-[var(--navy)]">Conferir entrevista</h1><div className="notice info mt-3"><UserRound size={18}/><span>Fonte do relato: <strong>{informantLabel[report.informant_type]}</strong>. As falas abaixo são da entrevista; os campos seguintes são o relatório organizado.</span></div><p className="muted mt-4">Conversa original</p><div className="chat max-h-72">{report.messages.map(item=><article key={item.id} className={`message ${item.role === "user" ? "user" : ""}`}><span className="message-name">{item.role === "user"?informantLabel[report.informant_type]:"Lumi"}</span>{item.content}</article>)}</div><p className="muted">Edite ou complemente o relatório. O campo objetivo deixa claro quando não há dados objetivos.</p><div className="review-form"><Field label="Queixa principal" value={soap.queixa_principal} onChange={v=>setSoap({...soap,queixa_principal:v})}/><Field label="Tempo de evolução" value={soap.tempo_evolucao} onChange={v=>setSoap({...soap,tempo_evolucao:v})}/><Field label="Subjetivo" value={soap.soap.subjetivo} onChange={v=>changeSoap("subjetivo",v)}/><Field label="Objetivo" value={soap.soap.objetivo} onChange={v=>changeSoap("objetivo",v)}/><Field label="Síntese preliminar" value={soap.soap.avaliacao} onChange={v=>changeSoap("avaliacao",v)}/><Field label="Encaminhamento para revisão" value={soap.soap.plano} onChange={v=>changeSoap("plano",v)}/></div>{soap.alertas_red_flags.length>0&&<div className="notice warning"><AlertTriangle size={18}/><span>Orientações de segurança: {soap.alertas_red_flags.join("; ")}</span></div>}<label className="field">Notas profissionais<textarea className="textarea" value={reviewNotes} onChange={e=>setReviewNotes(e.target.value)}/></label><button className="button primary" disabled={busy} onClick={approve}>{busy?<LoaderCircle className="spinner"/>:<Check size={17}/>}Salvar revisão e aprovar</button></section>}

      {view === "accessibility" && <section className="panel"><button className="tab" onClick={()=>setView("home")}><ArrowLeft size={16}/>Voltar ao início</button><span className="badge"><Accessibility size={15}/>ACESSIBILIDADE</span><h1 className="mt-3 text-3xl font-semibold text-[var(--navy)]">Ajuste a Lumi ao seu jeito.</h1><p className="muted mt-2">Você pode pedir ajuda de um acompanhante ou da equipe durante a entrevista.</p><div className="path-grid"><article className="path-card"><h2><Eye size={19}/>Leitura</h2><p>Amplie o texto e use leitura em voz alta para escutar as perguntas.</p><button className="button" onClick={()=>{setLargeText(v=>!v);document.body.classList.toggle("large-type");}}>Aa · {largeText?"Restaurar tamanho":"Aumentar texto"}</button></article><article className="path-card"><h2><Volume2 size={19}/>Voz</h2><p>Teste a leitura em português brasileiro e ajuste o volume no dispositivo.</p><button className="button" onClick={()=>speak("Olá! Eu sou a Lumi. Vou fazer uma pergunta por vez para organizar o seu relato de saúde.")}>Ouvir apresentação</button></article><article className="path-card"><h2><Moon size={19}/>Contraste</h2><p>Alterne entre o tema claro da Lumi e uma versão escura.</p><button className="button" onClick={()=>setDarkMode(v=>!v)}>{darkMode?<Sun size={16}/>:<Moon size={16}/>}Alternar tema</button></article><article className="path-card"><h2><UsersRound size={19}/>Atendimento assistido</h2><p>Um acompanhante ou alguém da equipe pode responder junto com a pessoa.</p><button className="button primary" onClick={()=>setView("patient")}>Começar com apoio</button></article></div></section>}

      <footer className="footer">Lumi · Relato inicial para revisão de um profissional de saúde.</footer>
    </main>
  </>;
}

function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}) {
  return <label className="field">{label}<textarea className="textarea" value={value} onChange={e=>onChange(e.target.value)}/></label>;
}

function SoapView({content}:{content:SoapContent}) {
  const rows:[string,string][]=[
    ["Fonte do relato",content.fonte_relato],
    ["Queixa principal",content.queixa_principal],
    ["Tempo de evolução",content.tempo_evolucao],
    ["Subjetivo",content.soap.subjetivo],
    ["Objetivo",content.soap.objetivo],
    ["Síntese preliminar",content.soap.avaliacao],
    ["Encaminhamento para revisão",content.soap.plano],
    ["Histórico informado",JSON.stringify(content.historico,null,2)],
    ["Informações para atenção da equipe",content.alertas_red_flags.join("; ")||"Nenhuma orientação adicional acionada"],
    ["Sugestões CID",content.sugestoes_cid.join("; ")||"Não sugeridas"],
  ];
  return <div className="grid mt-5">{rows.map(([label,value])=><article key={label} className="item"><strong>{label}</strong><p className="muted">{value||"Não informado"}</p></article>)}</div>;
}
