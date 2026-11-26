
const root=document.getElementById('root'),L=['pt-BR','en-US','es','fr','it','de'],N=['Português (Brasil)','English','Español','Français','Italiano','Deutsch'],D={};
const raw=`
welcome|Olá, seja bem-vindo!|Welcome!|¡Bienvenido!|Bienvenue !|Benvenuto!|Willkommen!
slogan|O cuidado começa antes.|Care starts earlier.|El cuidado comienza antes.|Les soins commencent plus tôt.|La cura inizia prima.|Fürsorge beginnt früher.
intro|Prepare sua consulta com tranquilidade.|Prepare for your visit at your pace.|Prepárate para tu consulta con calma.|Préparez votre consultation à votre rythme.|Preparati alla visita con calma.|Bereiten Sie Ihren Termin in Ruhe vor.
smart|Anamnese inteligente|Smart health interview|Anamnesis inteligente|Anamnèse intelligente|Anamnesi intelligente|Intelligente Anamnese
hero|Conte à Lumi o que está sentindo.|Tell Lumi how you feel.|Cuéntale a Lumi cómo te sientes.|Décrivez vos symptômes à Lumi.|Descrivi a Lumi i tuoi sintomi.|Schildern Sie Lumi Ihre Beschwerden.
start|Iniciar agora|Start now|Empezar ahora|Commencer|Inizia ora|Jetzt starten
quick|Acesso rápido|Quick access|Acceso rápido|Accès rapide|Accesso rapido|Schnellzugriff
home|Início|Home|Inicio|Accueil|Home|Start
anam|Anamnese|Interview|Anamnesis|Anamnèse|Anamnesi|Anamnese
wallet|Carteira|Wallet|Tarjetas|Cartes|Tessere|Karten
history|Histórico|History|Historial|Historique|Cronologia|Verlauf
symptoms|Sintomas|Symptoms|Síntomas|Symptômes|Sintomi|Symptome
dependents|Dependentes|Dependents|Dependientes|Personnes à charge|Familiari|Angehörige
profile|Perfil|Profile|Perfil|Profil|Profilo|Profil
visit|Meu atendimento|My visit|Mi atención|Ma consultation|La mia visita|Mein Termin
empty|Nenhuma anamnese ativa|No active interview|Sin anamnesis activa|Aucune anamnèse en cours|Nessuna anamnesi attiva|Keine aktive Anamnese
resume|Continuar anamnese|Resume interview|Continuar anamnesis|Reprendre|Riprendi anamnesi|Fortsetzen
pending|Aguardando revisão|Awaiting review|Pendiente de revisión|En attente de vérification|In attesa di revisione|Prüfung ausstehend
sent|Anamnese encaminhada|Interview submitted|Anamnesis enviada|Anamnèse transmise|Anamnesi inviata|Anamnese gesendet
reviewed|Revisada|Reviewed|Revisada|Vérifiée|Revisionata|Geprüft
back|Voltar|Back|Volver|Retour|Indietro|Zurück
next|Continuar|Continue|Continuar|Continuer|Continua|Weiter
save|Salvar|Save|Guardar|Enregistrer|Salva|Speichern
language|Idioma|Language|Idioma|Langue|Lingua|Sprache
access|Acessibilidade|Accessibility|Accesibilidad|Accessibilité|Accessibilità|Barrierefreiheit
mode|Como prefere se comunicar?|How would you like to communicate?|¿Cómo prefieres comunicarte?|Comment souhaitez-vous communiquer ?|Come preferisci comunicare?|Wie möchten Sie kommunizieren?
text|Texto e alternativas|Text and choices|Texto y opciones|Texte et choix|Testo e opzioni|Text und Auswahl
textdesc|Leia e selecione as respostas.|Read and select answers.|Lee y selecciona respuestas.|Lisez et choisissez vos réponses.|Leggi e scegli le risposte.|Lesen und Antworten auswählen.
voice|Modo voz|Voice mode|Modo de voz|Mode vocal|Modalità vocale|Sprachmodus
voicedesc|Ouça as perguntas e responda por voz.|Listen to questions and answer by voice.|Escucha y responde por voz.|Écoutez et répondez à la voix.|Ascolta e rispondi a voce.|Fragen anhören und per Sprache antworten.
librasdesc|Língua Brasileira de Sinais · prévia|Brazilian Sign Language · preview|Lengua de señas brasileña · vista previa|Langue des signes brésilienne · aperçu|Lingua dei segni brasiliana · anteprima|Brasilianische Gebärdensprache · Vorschau
avatar|Avatar ilustrativo. Ainda não interpreta Libras.|Illustrative avatar. No Libras interpretation yet.|Avatar ilustrativo. Aún no interpreta Libras.|Avatar illustratif. Pas encore d’interprétation Libras.|Avatar illustrativo. Non interpreta ancora Libras.|Illustrativer Avatar. Noch keine Libras-Übersetzung.
human|Solicitar apoio humano|Seek human assistance|Pedir ayuda humana|Demander une aide humaine|Chiedi aiuto|Menschliche Hilfe anfordern
humanNote|Procure a equipe da unidade. Esta prévia não envia solicitações.|Contact facility staff. This demo does not send requests.|Acude al personal. Esta demo no envía solicitudes.|Adressez-vous au personnel. Cette démo n’envoie aucune demande.|Rivolgiti al personale. La demo non invia richieste.|Wenden Sie sich an das Personal. Diese Demo sendet keine Anfrage.
listen|Ouvir pergunta|Listen to question|Escuchar pregunta|Écouter la question|Ascolta domanda|Frage anhören
speak|Responder por voz|Answer by voice|Responder por voz|Répondre à la voix|Rispondi a voce|Per Sprache antworten
voicehint|Fale livremente para responder à Lumi.|Speak naturally to answer Lumi.|Habla con naturalidad para responder a Lumi.|Parlez naturellement pour répondre à Lumi.|Parla liberamente per rispondere a Lumi.|Sprechen Sie frei, um Lumi zu antworten.
voiceprivacy|Use dados fictícios. O navegador pode processar o áudio externamente.|Use fictional data. The browser may process audio externally.|Usa datos ficticios. El navegador puede procesar audio externamente.|Utilisez des données fictives. Le navigateur peut traiter l’audio à distance.|Usa dati fittizi. Il browser può elaborare l’audio esternamente.|Nur fiktive Daten. Der Browser kann Audio extern verarbeiten.
listening|Ouvindo…|Listening…|Escuchando…|Écoute…|In ascolto…|Hört zu…
unavailable|Voz indisponível neste navegador ou dispositivo.|Voice unavailable on this device.|Voz no disponible.|Voix indisponible.|Voce non disponibile.|Sprache nicht verfügbar.
nomatch|Resposta não identificada. Tente novamente.|Answer not matched. Try again.|Respuesta no identificada. Intenta de nuevo.|Réponse non reconnue. Réessayez.|Risposta non riconosciuta. Riprova.|Antwort nicht erkannt. Erneut versuchen.
confirm|Confirmar resposta|Confirm answer|Confirmar respuesta|Confirmer la réponse|Conferma risposta|Antwort bestätigen
large|Texto ampliado|Larger text|Texto ampliado|Texte agrandi|Testo ingrandito|Große Schrift
contrast|Alto contraste|High contrast|Alto contraste|Contraste élevé|Contrasto elevato|Hoher Kontrast
reduce|Reduzir animações|Reduce animations|Reducir animaciones|Réduire les animations|Riduci animazioni|Animationen reduzieren
who|Para quem é o atendimento?|Who is the visit for?|¿Para quién es la atención?|Pour qui est la consultation ?|Per chi è la visita?|Für wen ist der Termin?
self|Para mim|For me|Para mí|Pour moi|Per me|Für mich
other|Para outra pessoa|For someone else|Para otra persona|Pour une autre personne|Per un’altra persona|Für eine andere Person
help|Preciso de ajuda imediata|I need immediate help|Necesito ayuda inmediata|J’ai besoin d’aide immédiate|Ho bisogno di aiuto immediato|Ich brauche sofort Hilfe
urgent|Procure atendimento imediato|Seek immediate medical help|Busca atención inmediata|Demandez une aide immédiate|Cerca assistenza immediata|Suchen Sie sofort Hilfe
urgentdesc|No Brasil, procure a equipe de saúde ou ligue 192 (SAMU) em uma emergência. A prévia não aciona serviços.|In Brazil, contact staff or call 192 (SAMU) in an emergency. This demo does not alert services.|En Brasil, acude al personal o llama al 192 (SAMU). Esta demo no alerta servicios.|Au Brésil, contactez le personnel ou le 192 (SAMU). Cette démo n’alerte aucun service.|In Brasile, contatta il personale o il 192 (SAMU). La demo non allerta servizi.|In Brasilien kontaktieren Sie Personal oder 192 (SAMU). Diese Demo alarmiert keine Dienste.
safe|Você precisa de ajuda imediata agora?|Do you need immediate help now?|¿Necesitas ayuda inmediata ahora?|Avez-vous besoin d’aide immédiate ?|Hai bisogno di aiuto immediato?|Benötigen Sie sofort Hilfe?
safecontinue|Consigo responder às perguntas|I can answer the questions|Puedo responder las preguntas|Je peux répondre aux questions|Posso rispondere alle domande|Ich kann die Fragen beantworten
feel|O que você está sentindo?|What are you feeling?|¿Qué estás sintiendo?|Que ressentez-vous ?|Cosa senti?|Welche Beschwerden haben Sie?
multi|Selecione uma ou mais opções.|Select one or more options.|Selecciona una o más opciones.|Choisissez une ou plusieurs options.|Seleziona una o più opzioni.|Wählen Sie eine oder mehrere Optionen.
single|Selecione uma alternativa.|Choose one option.|Selecciona una opción.|Choisissez une option.|Scegli un’opzione.|Wählen Sie eine Option.
details|Adicionar detalhes (opcional)|Add details (optional)|Añadir detalles (opcional)|Ajouter des détails (facultatif)|Aggiungi dettagli (facoltativo)|Details hinzufügen (optional)
pause|Pausar e continuar depois|Pause and resume later|Pausar y continuar después|Mettre en pause|Pausa e riprendi|Pausieren und fortsetzen
review|Confira seu relato|Review your report|Revisa tu informe|Vérifiez votre rapport|Controlla il resoconto|Bericht prüfen
edit|Editar respostas|Edit answers|Editar respuestas|Modifier les réponses|Modifica risposte|Antworten bearbeiten
send|Confirmar e enviar (simulação)|Confirm and submit (demo)|Confirmar y enviar (demo)|Confirmer et envoyer (démo)|Conferma e invia (demo)|Bestätigen und senden (Demo)
sendchat|Enviar mensagem|Send message|Enviar mensaje|Envoyer le message|Invia messaggio|Nachricht senden
update|Atualizar sintomas|Update symptoms|Actualizar síntomas|Actualiser les symptômes|Aggiorna sintomi|Symptome aktualisieren
change|Algo mudou?|Has anything changed?|¿Ha cambiado algo?|Quelque chose a changé ?|È cambiato qualcosa?|Hat sich etwas geändert?
new|Novo sintoma|New symptom|Nuevo síntoma|Nouveau symptôme|Nuovo sintomo|Neues Symptom
worse|Piorou|Worsened|Empeoró|Aggravation|Peggiorato|Verschlechtert
better|Melhorou|Improved|Mejoró|Amélioration|Migliorato|Verbessert
which|Qual sintoma?|Which symptom?|¿Qué síntoma?|Quel symptôme ?|Quale sintomo?|Welches Symptom?
queue|A atualização não altera automaticamente a fila.|Updates do not automatically change queue position.|La actualización no cambia automáticamente la fila.|La mise à jour ne change pas la file d’attente.|L’aggiornamento non cambia la coda.|Änderungen beeinflussen die Warteschlange nicht automatisch.
plan|Plano de saúde|Health insurance|Seguro de salud|Assurance santé|Assicurazione sanitaria|Krankenversicherung
addcard|Adicionar cartão|Add card|Añadir tarjeta|Ajouter une carte|Aggiungi tessera|Karte hinzufügen
remove|Remover|Remove|Eliminar|Supprimer|Rimuovi|Entfernen
unit|Instituição de saúde|Healthcare facility|Centro de salud|Établissement de santé|Struttura sanitaria|Gesundheitseinrichtung
payment|Tipo de atendimento|Coverage type|Tipo de cobertura|Type de couverture|Tipo di copertura|Versicherungsart
private|Particular|Self-pay|Particular|Paiement direct|Privato|Selbstzahler
fake|Demonstração · use somente dados fictícios|Demo · fictional data only|Demo · solo datos ficticios|Démo · données fictives uniquement|Demo · solo dati fittizi|Demo · nur fiktive Daten
notifications|Notificações|Notifications|Notificaciones|Notifications|Notifiche|Benachrichtigungen
nothing|Nenhuma notificação.|No notifications.|Sin notificaciones.|Aucune notification.|Nessuna notifica.|Keine Benachrichtigung.
privacy|Privacidade|Privacy|Privacidad|Confidentialité|Privacy|Datenschutz
clinical|Painel profissional|Clinical dashboard|Panel profesional|Espace soignant|Pannello clinico|Fachbereich
app|Ver aplicativo|Patient app|Aplicación|Application patient|App paziente|Patienten-App
reset|Reiniciar demonstração|Reset demo|Reiniciar demo|Réinitialiser démo|Riavvia demo|Demo zurücksetzen
head|Cabeça e pescoço|Head and neck|Cabeza y cuello|Tête et cou|Testa e collo|Kopf und Hals
chest|Peito e respiração|Chest and breathing|Pecho y respiración|Poitrine et respiration|Torace e respirazione|Brust und Atmung
belly|Abdômen e digestão|Abdomen and digestion|Abdomen y digestión|Abdomen et digestion|Addome e digestione|Bauch und Verdauung
muscle|Músculos e articulações|Muscles and joints|Músculos y articulaciones|Muscles et articulations|Muscoli e articolazioni|Muskeln und Gelenke
general|Febre e mal-estar|Fever and malaise|Fiebre y malestar|Fièvre et malaise|Febbre e malessere|Fieber und Unwohlsein
others|Outros sintomas|Other symptoms|Otros síntomas|Autres symptômes|Altri sintomi|Andere Symptome
headache|Dor de cabeça|Headache|Dolor de cabeza|Mal de tête|Mal di testa|Kopfschmerzen
dizzy|Tontura|Dizziness|Mareo|Vertiges|Vertigini|Schwindel
throat|Dor de garganta|Sore throat|Dolor de garganta|Mal de gorge|Mal di gola|Halsschmerzen
ear|Dor no ouvido|Earache|Dolor de oído|Mal d’oreille|Mal d’orecchio|Ohrenschmerzen
cough|Tosse|Cough|Tos|Toux|Tosse|Husten
chestpain|Desconforto no peito|Chest discomfort|Molestia en el pecho|Gêne thoracique|Fastidio al torace|Brustbeschwerden
breath|Falta de ar|Shortness of breath|Falta de aire|Essoufflement|Fiato corto|Atemnot
palp|Palpitações|Palpitations|Palpitaciones|Palpitations|Palpitazioni|Herzklopfen
abpain|Dor abdominal|Abdominal pain|Dolor abdominal|Douleur abdominale|Dolore addominale|Bauchschmerzen
nausea|Náusea|Nausea|Náuseas|Nausées|Nausea|Übelkeit
vomit|Vômito|Vomiting|Vómitos|Vomissements|Vomito|Erbrechen
diarrhea|Diarreia|Diarrhea|Diarrea|Diarrhée|Diarrea|Durchfall
musclepain|Dor muscular|Muscle pain|Dolor muscular|Douleur musculaire|Dolore muscolare|Muskelschmerzen
joint|Dor nas articulações|Joint pain|Dolor articular|Douleur articulaire|Dolore articolare|Gelenkschmerzen
swelling|Inchaço|Swelling|Hinchazón|Gonflement|Gonfiore|Schwellung
movement|Dificuldade de movimento|Difficulty moving|Dificultad de movimiento|Difficulté à bouger|Difficoltà di movimento|Bewegungsschwierigkeiten
fever|Febre|Fever|Fiebre|Fièvre|Febbre|Fieber
fatigue|Cansaço|Fatigue|Cansancio|Fatigue|Stanchezza|Müdigkeit
chills|Calafrios|Chills|Escalofríos|Frissons|Brividi|Schüttelfrost
weak|Fraqueza|Weakness|Debilidad|Faiblesse|Debolezza|Schwäche
skin|Alterações na pele|Skin changes|Cambios en la piel|Modifications cutanées|Alterazioni cutanee|Hautveränderungen
urine|Desconforto ao urinar|Discomfort urinating|Molestia al orinar|Gêne à la miction|Fastidio urinando|Beschwerden beim Wasserlassen
sleep|Alterações no sono|Sleep changes|Cambios en el sueño|Troubles du sommeil|Alterazioni del sonno|Schlafveränderungen
unknown|Não sei informar|I am not sure|No sé|Je ne sais pas|Non lo so|Ich weiß es nicht
another|Outro sintoma|Another symptom|Otro síntoma|Autre symptôme|Altro sintomo|Anderes Symptom
onset|Início|Onset|Inicio|Début|Inizio|Beginn
onsetq|Quando os sintomas começaram?|When did the symptoms start?|¿Cuándo empezaron los síntomas?|Quand les symptômes ont-ils commencé ?|Quando sono iniziati i sintomi?|Wann begannen die Symptome?
today|Hoje|Today|Hoy|Aujourd’hui|Oggi|Heute
yesterday|Ontem|Yesterday|Ayer|Hier|Ieri|Gestern
days|Há alguns dias|A few days ago|Hace unos días|Il y a quelques jours|Qualche giorno fa|Vor einigen Tagen
weeks|Há semanas ou mais|Weeks ago or longer|Hace semanas o más|Il y a plusieurs semaines|Settimane fa o più|Vor Wochen oder länger
intensity|Intensidade relatada|Reported intensity|Intensidad declarada|Intensité déclarée|Intensità riferita|Angegebene Intensität
intensityq|Qual é a intensidade do desconforto agora?|How intense is the discomfort now?|¿Qué intensidad tiene el malestar?|Quelle est l’intensité de la gêne ?|Quanto è intenso il fastidio?|Wie stark sind die Beschwerden?
none|Sem desconforto agora|No discomfort now|Sin malestar ahora|Aucune gêne|Nessun fastidio|Keine Beschwerden
mild|Leve|Mild|Leve|Légère|Lieve|Leicht
moderate|Moderado|Moderate|Moderado|Modérée|Moderato|Mittel
severe|Intenso|Severe|Intenso|Forte|Intenso|Stark
evolution|Evolução|Progression|Evolución|Évolution|Evoluzione|Verlauf
evolutionq|Como os sintomas evoluíram?|How have symptoms changed?|¿Cómo han evolucionado los síntomas?|Comment les symptômes ont-ils évolué ?|Come sono cambiati i sintomi?|Wie haben sich die Symptome entwickelt?
same|Continuam iguais|Unchanged|Siguen iguales|Inchangés|Invariati|Unverändert
intermittent|Vão e voltam|Come and go|Van y vienen|Vont et viennent|Vanno e vengono|Kommen und gehen
conditions|Histórico clínico|Medical history|Historial clínico|Antécédents médicaux|Anamnesi clinica|Vorerkrankungen
conditionsq|Você possui alguma condição de saúde já diagnosticada?|Do you have any diagnosed conditions?|¿Tienes alguna enfermedad diagnosticada?|Avez-vous une maladie diagnostiquée ?|Hai patologie diagnosticate?|Haben Sie diagnostizierte Erkrankungen?
meds|Medicamentos|Medications|Medicamentos|Médicaments|Farmaci|Medikamente
medsq|Você utiliza algum medicamento atualmente?|Are you currently taking medication?|¿Tomas algún medicamento actualmente?|Prenez-vous des médicaments ?|Assumi farmaci attualmente?|Nehmen Sie Medikamente ein?
allergies|Alergias|Allergies|Alergias|Allergies|Allergie|Allergien
allergiesq|Você possui alguma alergia conhecida?|Do you have any known allergies?|¿Tienes alguna alergia conocida?|Avez-vous des allergies connues ?|Hai allergie note?|Haben Sie bekannte Allergien?
yes|Sim|Yes|Sí|Oui|Sì|Ja
no|Não|No|No|Non|No|Nein
notinformed|Não informado|Not provided|No informado|Non renseigné|Non indicato|Nicht angegeben
where|Onde sente dor ou desconforto?|Where do you feel pain or discomfort?|¿Dónde sientes dolor o malestar?|Où ressentez-vous une douleur ou une gêne ?|Dove senti dolore o fastidio?|Wo haben Sie Schmerzen oder Beschwerden?
bodymap|Mapa corporal (opcional)|Body map (optional)|Mapa corporal (opcional)|Carte corporelle (facultative)|Mappa corporea (facoltativa)|Körperkarte (optional)
male|Masculino|Male|Masculino|Masculin|Maschile|Männlich
female|Feminino|Female|Femenino|Féminin|Femminile|Weiblich
neutral|Neutro|Neutral|Neutro|Neutre|Neutro|Neutral
front|Frente|Front|Frente|Face|Fronte|Vorne
backview|Costas|Back|Espalda|Dos|Dorso|Hinten
skip|Pular|Skip|Omitir|Passer|Salta|Überspringen
neck|Pescoço|Neck|Cuello|Cou|Collo|Hals
upperback|Parte superior das costas|Upper back|Espalda alta|Haut du dos|Parte alta della schiena|Oberer Rücken
lowerback|Lombar|Lower back|Zona lumbar|Bas du dos|Zona lombare|Unterer Rücken
rarm|Braço direito|Right arm|Brazo derecho|Bras droit|Braccio destro|Rechter Arm
larm|Braço esquerdo|Left arm|Brazo izquierdo|Bras gauche|Braccio sinistro|Linker Arm
rleg|Perna direita|Right leg|Pierna derecha|Jambe droite|Gamba destra|Rechtes Bein
lleg|Perna esquerda|Left leg|Pierna izquierda|Jambe gauche|Gamba sinistra|Linkes Bein
pelvis|Região pélvica|Pelvic area|Zona pélvica|Région pelvienne|Zona pelvica|Becken
nopain|Não sinto dor|No pain|Sin dolor|Sans douleur|Senza dolore|Keine Schmerzen
`;raw.trim().split('\n').forEach(row=>{let [k,...v]=row.split('|');D[k]=v});
const S={page:'home',lang:0,dark:true,mode:'text',clinical:false,regions:[],areas:[],model:'neutral',side:'front',step:0,answers:{},notes:{},extra:false,draft:false,sent:false,validated:false,updates:[],cards:['SUS','plan'],person:false,unit:'Hospital Exemplo',payment:'SUS',large:false,contrast:false,reduce:false,resume:'modes',notice:'',listening:false,heard:'',draftMessage:'',sending:false,sessionId:'',sessionToken:'',apiMessages:[],apiReport:null,clinicianReports:[],activeReport:null};
try{Object.assign(S,JSON.parse(sessionStorage.getItem('lumiDemoState')||'{}'))}catch(_){sessionStorage.removeItem('lumiDemoState')}
function persist(){try{sessionStorage.setItem('lumiDemoState',JSON.stringify(S))}catch(_){}}
async function apiRequest(path,init={}){let headers={...(init.headers||{})};if(S.sessionToken)headers['X-Session-Token']=S.sessionToken;let response=await fetch(path,{...init,headers});let body=await response.text(),data={};try{data=body?JSON.parse(body):{}}catch(_){}if(!response.ok)throw Error(data.detail||('Erro HTTP '+response.status));return data}
async function createApiSession(){if(S.sessionId&&S.sessionToken)return;let data=await apiRequest('/api/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({patient_name:S.person?'Acompanhante demonstrativo':'Paciente demonstrativo',informant_type:S.person?'companion':'patient',demo:true,initial_context:{symptom_regions:S.areas.map(a=>t(a,0))}})});S.sessionId=data.id;S.sessionToken=data.session_token||'';S.apiMessages=data.messages||[];persist()}
async function sendApiMessage(){let content=(S.draftMessage||'').trim();if(!content||!S.sessionId||S.sending)return;S.sending=true;render();try{let data=await apiRequest('/api/sessions/'+S.sessionId+'/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({content})});S.apiMessages=data.messages||[];S.draftMessage='';if(data.status==='urgent')S.notice='Procure atendimento de saúde imediatamente. Se estiver no Brasil, ligue 192.';persist()}finally{S.sending=false;render();if(S.mode==='voice')read()}}
async function finalizeApiInterview(){if(!S.sessionId||!S.sessionToken)throw Error('Sessão da entrevista não encontrada. Comece uma nova entrevista.');if(!(S.apiMessages||[]).some(m=>m.role==='user'))throw Error('Conte um pouco sobre o que está sentindo antes de concluir.');S.apiReport=await apiRequest('/api/sessions/'+S.sessionId+'/finalize',{method:'POST'});persist()}
async function saveApiUpdate(update){if(!S.sessionId||!S.sessionToken)throw Error('Sessão da entrevista não encontrada.');await apiRequest('/api/sessions/'+S.sessionId+'/updates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:update.kind,symptom:t(update.sym,0),notes:update.note})})}
const t=(k,l=S.lang)=>D[k]?.[l]||k, e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P={home:'<path d="m3 10 9-7 9 7v10h-6v-7H9v7H3z"/>',chat:'<rect x="3" y="4" width="18" height="14" rx="5"/><path d="M7 18v4l5-4M7 11h10"/>',wallet:'<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M21 10h-6v6h6"/>',history:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',activity:'<path d="M2 12h5l3-7 4 14 3-7h5"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M2 21v-3a7 7 0 0 1 14 0v3M17 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',moon:'<path d="M20 15a9 9 0 0 1-11-11 9 9 0 1 0 11 11Z"/>',access:'<circle cx="12" cy="4" r="2"/><path d="m3 8 9 2 9-2m-9 2v5m0 0-5 6m5-6 5 6"/>',arrow:'<path d="m9 5 7 7-7 7"/>',back:'<path d="m15 5-7 7 7 7"/>',check:'<path d="m5 12 4 4L19 6"/>',alert:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',mic:'<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/>',speaker:'<path d="M3 9v6h4l5 4V5L7 9zM16 8a6 6 0 0 1 0 8"/>',file:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'};
const ic=(k,s=21)=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(P[k]||'')+'</svg>';
const logo=s=>'<svg width="'+s+'" height="'+s+'" viewBox="0 0 100 100" aria-hidden="true"><path d="M8 19a14 14 0 0 1 28 0v35a14 14 0 0 0 28 0V19a14 14 0 0 1 28 0v35a42 42 0 0 1-84 0Z" fill="'+(S.dark?'#8dbfff':'#0b1f6b')+'"/><path d="M64 54C67 34 92 39 92 19V54Q85 100 44 80Z" fill="#b3d5fa"/><path d="M8 29C28 40 34 54 43 65C60 85 85 77 92 54A42 42 0 0 1 8 54Z" fill="#3b82d6"/></svg>';
const art='<svg viewBox="0 0 120 120"><g transform="rotate(-9 55 60)"><rect x="18" y="15" width="72" height="92" rx="12" fill="#d1e6fc"/><rect x="37" y="8" width="34" height="16" rx="6" fill="#8dbfff"/><path d="M31 42h42M31 56h34M31 70h40M31 84h25" stroke="#6e9ac9" stroke-width="6" stroke-linecap="round"/></g><circle cx="91" cy="91" r="22" fill="#3b82d6"/><path d="m81 91 7 7 13-15" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>';
const avatar='<svg viewBox="0 0 240 190" aria-hidden="true"><path d="M57 181v-43q0-35 46-40h34q46 5 46 40v43" fill="#3974ac"/><path d="M105 92h30v24q-15 17-30 0" fill="#c88e70"/><rect x="85" y="25" width="70" height="78" rx="33" fill="#dfab87"/><path d="M81 58Q69 14 112 13q48-7 49 44l-10-1-7-24q-22 20-53 14v12z" fill="#29344b"/><circle cx="105" cy="63" r="3" fill="#263142"/><circle cx="135" cy="63" r="3" fill="#263142"/><path d="M111 81q9 7 18 0" stroke="#925e4c" stroke-width="2.5" fill="none"/><path d="M78 137l-5 33 40 8M162 137l5 33-40 8" stroke="#295989" stroke-width="24" fill="none" stroke-linecap="round"/><rect x="98" y="162" width="26" height="17" rx="8" fill="#dfab87"/><rect x="122" y="162" width="26" height="17" rx="8" fill="#dfab87"/></svg>';
const btn=(k,a,c='primary',i='',d=false)=>'<button class="'+c+'" data-a="'+e(a)+'" '+(d?'disabled':'')+'>'+(i?ic(i,18):'')+e(t(k))+'</button>',item=(k,a,sel=false,sub='',i='',choice=false,multi=false)=>'<button class="item '+(sel?'selected':'')+'" data-a="'+e(a)+'" '+(choice?'aria-pressed="'+sel+'"':'')+'>'+(i?'<span class="leading">'+ic(i)+'</span>':'')+'<span class="copy"><strong>'+e(t(k))+'</strong>'+(sub?'<small>'+e(t(sub))+'</small>':'')+'</span>'+(choice?'<span class="radio '+(multi?'square':'')+'">'+(sel?ic('check',15):'')+'</span>':'<span class="trail">'+ic('arrow',16)+'</span>')+'</button>';
const h=k=>'<h1>'+e(t(k))+'</h1>',p=k=>'<p>'+e(t(k))+'</p>',note=k=>'<div class="note">'+e(t(k))+'</div>',back=a=>btn('back',a,'back','back'),help=()=>btn('help','help','danger','alert'),quick=(k,i,a)=>'<button class="quick" data-a="'+a+'"><span class="qicon">'+ic(i,24)+'</span><strong>'+e(t(k))+'</strong></button>',select=(id,items,val)=>'<select id="'+id+'" aria-label="'+e(t(id))+'">'+items.map(k=>'<option value="'+e(k)+'" '+(k===val?'selected':'')+'>'+e(t(k))+'</option>').join('')+'</select>';
const R=[['head',['headache','dizzy','throat','ear']],['chest',['cough','chestpain','breath','palp']],['belly',['abpain','nausea','vomit','diarrhea']],['muscle',['musclepain','joint','swelling','movement']],['general',['fever','fatigue','chills','weak']],['others',['skin','urine','sleep']]];
function qs(){return (S.regions.length?S.regions:[5]).flatMap(i=>[{k:'sym'+i,l:'symptoms',r:i,q:'feel',o:[...R[i][1],'another','unknown'],multi:true},{k:'onset'+i,l:'onset',r:i,q:'onsetq',o:['today','yesterday','days','weeks','unknown']},{k:'intensity'+i,l:'intensity',r:i,q:'intensityq',o:['none','mild','moderate','severe','unknown']},{k:'evolution'+i,l:'evolution',r:i,q:'evolutionq',o:['better','same','worse','intermittent','unknown']}]).concat([{k:'conditions',l:'conditions',q:'conditionsq',o:['yes','no','unknown']},{k:'meds',l:'meds',q:'medsq',o:['yes','no','unknown']},{k:'allergies',l:'allergies',q:'allergiesq',o:['yes','no','unknown']}])}
const q=()=>qs()[S.step]||qs()[0], vals=k=>S.answers[k]?.v||[],line=(l,a,n='')=>'<div class="line"><small>'+e(l)+'</small><strong>'+e(a)+'</strong>'+(n?'<p>'+e(n)+'</p>':'')+'</div>';
function report(clin=false){let l=clin?0:S.lang;return line(t('bodymap',l),S.areas.map(a=>t(a,l)).join(', ')||t('notinformed',l))+qs().map(x=>{let a=S.answers[x.k],n=S.notes[x.k];return line(t(x.l,l)+(x.r===undefined?'':' · '+t(R[x.r][0],l)),vals(x.k).map(v=>t(v,l)).join(', ')||t('notinformed',l),(clin&&a&&a.lang!==0?N[a.lang]+': '+a.v.map(v=>t(v,a.lang)).join(', '):'')+(n?.text?' · '+N[n.lang]+': '+n.text:''))}).join('')}
function savedReport(){let c=S.apiReport?.content;if(!c)return report();return line('Queixa principal',c.queixa_principal)+line('Tempo de evolução',c.tempo_evolucao)+line('Síntese preliminar',c.soap?.avaliacao||'')+line('Fonte do relato',c.fonte_relato)}
function modes(){return item('text','mode:text',S.mode==='text','textdesc','chat',true)+item('voice','mode:voice',S.mode==='voice','voicedesc','mic',true)+item('Libras','mode:libras',S.mode==='libras','librasdesc','access',true)}
function avatarView(){return '<div class="avatar">'+avatar+'<small>'+e(t('avatar'))+'</small>'+btn('human','human','link')+'</div>'}
function voiceView(){return '<div class="center"><small>'+e(t('voicehint'))+'</small><button class="mic" data-a="record" aria-label="'+e(t('speak'))+'" '+(S.listening?'disabled':'')+'>'+ic('mic',30)+'</button><strong role="status">'+e(t(S.listening?'listening':'speak'))+'</strong>'+(S.heard?'<p>'+e(S.heard)+'</p>':'')+btn('listen','listen','link','speaker')+note('voiceprivacy')+'</div>'}
function pts(){let f=S.side==='front';return [['head',50,9],['neck',50,19],[f?'chest':'upperback',50,29],[f?'belly':'lowerback',50,42],['pelvis',50,51],[f?'rarm':'larm',22,35],[f?'larm':'rarm',78,35],[f?'rleg':'lleg',39,71],[f?'lleg':'rleg',61,71]]}
function seg(keys,k){return '<div class="seg">'+keys.map(a=>'<button class="'+(S[k]===a?'on':'')+'" data-a="'+k+':'+a+'" aria-pressed="'+(S[k]===a)+'">'+e(t(a))+'</button>').join('')+'</div>'}
function body(){let f=S.model==='female',m=S.model==='male',front=S.side==='front';let torso=f?'M108 76 Q88 78 78 91 Q71 109 87 137 Q99 160 95 175 Q84 193 77 210 Q76 224 97 232 L143 232 Q164 224 163 210 Q156 193 145 175 Q141 160 153 137 Q169 109 162 91 Q152 78 132 76Z':m?'M106 78 Q83 80 68 94 L78 152 L87 188 Q81 206 92 223 L148 223 Q159 206 153 188 L162 152 L172 94 Q157 80 134 78Z':'M106 78 Q83 82 72 96 L80 151 Q87 169 83 188 Q80 207 92 223 L148 223 Q160 207 157 188 Q153 169 160 151 L168 96 Q157 82 134 78Z';return '<div class="body"><svg viewBox="0 0 240 400" aria-hidden="true"><g fill="#a8b9cf" stroke="#d1dfee" stroke-width="1.5">'+(f?'<path d="M92 50Q81 9 115 4Q151 0 151 38L145 80H95Z" fill="#485c75"/>':'')+'<path d="M108 57h24v27h-24z"/><ellipse cx="120" cy="36" rx="'+(f?26:29)+'" ry="34"/><path d="M74 93 Q56 95 51 125 L42 165 L27 190 Q16 199 22 213 L31 219 Q43 221 47 208 L63 175 L80 131Z"/><path d="M166 93 Q184 95 189 125 L198 165 L213 190 Q224 199 218 213 L209 219 Q197 221 193 208 L177 175 L160 131Z"/><path d="M89 204 Q77 221 81 257 L86 295 L83 353 L77 369 Q71 383 86 388 L105 388 Q112 387 111 370 L109 306 L118 240 L118 210Z"/><path d="M151 204 Q163 221 159 257 L154 295 L157 353 L163 369 Q169 383 154 388 L135 388 Q128 387 129 370 L131 306 L122 240 L122 210Z"/><path d="'+torso+'"/></g>'+(f?'<path d="'+(front?'M94 34 Q87 7 116 4 Q149 3 148 36 Q135 30 126 15 Q112 29 94 34Z':'M94 31Q89 7 117 4Q148 4 148 32L145 66Q120 78 95 66Z')+'" fill="#485c75"/>':'')+'<g fill="none" stroke="#6d849e" stroke-width="1.4">'+(front?'<path d="M95 110q25 12 50 0M93 148q27 6 54 0M95 190q25 8 50 0M108 35h2m20 0h2M113 53q7 4 14 0"/>':'<path d="M120 88v104M93 109q11 24 20 25m34-25q-11 24-20 25M95 180q25 9 50 0"/>')+'</g></svg>'+pts().map(([k,x,y])=>'<button class="point '+(S.areas.includes(k)?'on':'')+'" style="left:'+x+'%;top:'+y+'%" data-a="area:'+k+'" aria-label="'+e(t(k))+'" aria-pressed="'+S.areas.includes(k)+'"><i></i></button>').join('')+'</div>'}
function page(){switch(S.page){
case 'home':return '<div class="welcome"><div style="flex:1"><span class="eyebrow">'+e(t('welcome'))+'</span>'+h('slogan')+p('intro')+'</div><div class="orb">'+logo(83)+'</div></div><div class="hero"><div class="heroart">'+art+'</div><span class="eyebrow" style="color:#b3d5fa">LUMI</span><h2>'+e(t(S.draft?'resume':S.sent?'visit':'smart'))+'</h2>'+p('hero')+btn(S.draft?'resume':S.sent?'visit':'start',S.draft?'resume':S.sent?'status':'start','primary','arrow')+'</div><div class="section"><h2>'+e(t('quick'))+'</h2></div><div class="quickgrid">'+quick('wallet','wallet','wallet')+quick('history','history','history')+quick('symptoms','activity','update')+quick('dependents','users','dependents')+'</div><div class="section"><h2>'+e(t('visit'))+'</h2></div>'+item(S.sent?(S.validated?'reviewed':'pending'):S.draft?'resume':'empty',S.sent?'status':S.draft?'resume':'start',false,S.sent?S.unit:'','file')+item('access','access',false,S.mode==='libras'?'Libras':S.mode,'access')+help();
case 'modes':return back('home')+h('mode')+modes()+(S.mode==='libras'?avatarView():S.mode==='voice'?note('voiceprivacy'):'')+btn('next','identify');
case 'access':return back('return')+h('access')+modes()+item('large','toggle:large',S.large,'','',true)+item('contrast','toggle:contrast',S.contrast,'','',true)+item('reduce','toggle:reduce',S.reduce,'','',true)+item('language','language',false,N[S.lang],'globe')+btn('save','return')+(S.mode==='libras'?avatarView():'');
case 'language':return back('langreturn')+h('language')+N.map((n,i)=>item(n,'lang:'+i,i===S.lang,'','',true)).join('')+btn('save','langreturn');
case 'identify':return back('modes')+h('who')+item('self','person:0',!S.person,'','user',true)+item('other','person:1',S.person,'','users',true)+'<label>'+e(t('unit'))+'</label>'+select('unit',['Hospital Exemplo','Clínica Exemplo'],S.unit)+'<label>'+e(t('payment'))+'</label>'+select('payment',['SUS','plan','private'],S.payment)+note('fake')+btn('next','safety')+help();
case 'safety':return back('identify')+h('safe')+help()+item('safecontinue','map');
case 'help':return h('urgent')+p('urgentdesc')+btn('back','helpback','link');
case 'human':return h('human')+p('humanNote')+btn('back','helpback','link');
case 'map':return back('safety')+h('where')+p('multi')+seg(['male','female','neutral'],'model')+seg(['front','backview'],'side')+'<div class="map">'+body()+'<div class="regions">'+pts().map(([k])=>item(k,'area:'+k,S.areas.includes(k),'','',true,true)).join('')+'</div></div>'+item('nopain','area:nopain',S.areas.includes('nopain'),'','',true)+btn('next','interview')+btn('skip','skipmap','link')+help();
case 'regions':return back('map')+btn('next','interview');
case 'interview':return back('prev')+'<div class="row"><span class="eyebrow">LUMI · '+e(t(S.mode))+'</span><small>Conversa em andamento</small></div><div class="ai">'+logo(60)+'<small>'+e(t('smart'))+'</small></div><div class="chat" aria-live="polite">'+(S.apiMessages||[]).map(m=>'<article class="message '+(m.role==='user'?'user':'')+'"><span class="message-name">'+(m.role==='user'?(S.person?'Acompanhante':'Paciente'):'Lumi')+'</span><div class="message-content">'+e(m.content)+'</div>'+(m.role==='assistant'?'<div class="message-tools"><button class="mini-btn" data-a="listen">'+ic('speaker',14)+e(t('listen'))+'</button></div>':'')+'</article>').join('')+'</div>'+(S.mode==='voice'?voiceView():'')+'<textarea id="chatInput" aria-label="Sua resposta" placeholder="Escreva o que está sentindo…" '+(S.sending?'disabled':'')+'>'+e(S.draftMessage||'')+'</textarea><div class="row flex-wrap"><button class="primary" data-a="send-message" '+(!S.draftMessage.trim()||S.sending?'disabled':'')+'>'+ic('arrow',18)+(S.sending?'Enviando…':e(t('sendchat')))+'</button><button class="link" data-a="review">Conferir relato</button></div>'+(S.mode!=='voice'?'<button class="link" data-a="record">'+ic('mic',17)+e(t('speak'))+'</button>':'')+btn('send','send','link')+btn('pause','pause','link')+help();
case 'review':return back('interview')+h('review')+'<div class="chat">'+(S.apiMessages||[]).map(m=>'<article class="message '+(m.role==='user'?'user':'')+'"><span class="message-name">'+(m.role==='user'?'Relato':'Lumi')+'</span>'+e(m.content)+'</article>').join('')+'</div>'+btn('edit','interview','link')+btn('send','send');
case 'status':return '<div class="ai" style="color:var(--blue)">'+ic('check',45)+'</div>'+h('sent')+line(t('unit'),S.unit)+line(t('visit'),t(S.validated?'reviewed':'pending'))+note('fake')+S.updates.map(u=>line(t(u.kind),t(u.sym),u.note)).join('')+btn('update','update')+btn('history','history','link')+help();
case 'update':return back(S.sent?'status':'home')+h('change')+(!S.sent?note('empty')+btn(S.draft?'resume':'start',S.draft?'resume':'start'):'<label>'+e(t('change'))+'</label>'+select('kind',['new','worse','better'])+'<label>'+e(t('which'))+'</label>'+select('sym',R.flatMap(r=>r[1]).concat('another'))+'<label>'+e(t('details'))+'</label><textarea id="change"></textarea>'+btn('save','saveupdate')+note('queue'))+help();
case 'wallet':return h('wallet')+S.cards.map((k,i)=>'<div class="credit"><div class="row"><h2>'+e(t(k))+'</h2>'+ic('wallet',24)+'</div><p>'+e(t('fake'))+'</p><strong>•••• •••• '+(k==='SUS'?'1234':'5678')+'</strong>'+btn('remove','remove:'+i,'link')+'</div>').join('')+btn('addcard','addcard','link');
case 'addcard':return back('wallet')+h('addcard')+item('SUS','card:SUS',false,'','wallet')+item('plan','card:plan',false,'','wallet');
case 'history':return h('history')+(S.sent?savedReport()+btn('visit','status'):S.draft?item('resume','resume',false,'','file'):p('empty')+btn('start','start'));
case 'dependents':return back('home')+h('dependents')+item('other','otherstart',false,'','users')+note('fake');
case 'notifications':return back('home')+h('notifications')+(S.sent?line(t('visit'),t('sent')):p('nothing'))+(S.validated?line(t('visit'),t('reviewed')):'');
case 'profile':return h('profile')+item('access','access',false,'','access')+item('language','language',false,N[S.lang],'globe')+item('dependents','dependents',false,'','users')+item('privacy','privacy')+item('reset','reset');
case 'privacy':return back('profile')+h('privacy')+note('fake')+note('voiceprivacy');
default:return ''}}
async function loadClinicianReports(){let token=sessionStorage.getItem('lumiClinicianToken');if(!token)return;S.clinicianReports=await apiRequest('/api/reports',{headers:{'X-Clinician-Token':token}});S.activeReport=null;render()}
async function openClinicalReport(id){let token=sessionStorage.getItem('lumiClinicianToken');S.activeReport=await apiRequest('/api/reports/'+id,{headers:{'X-Clinician-Token':token}});render()}
async function saveClinicalReview(){let token=sessionStorage.getItem('lumiClinicianToken'),report=S.activeReport;if(!token||!report)return;let content=report.content;for(let input of root.querySelectorAll('[data-clinical-field]')){let [section,field]=input.dataset.clinicalField.split('.');if(section==='soap')content.soap[field]=input.value;else content[field]=input.value}let notes=root.querySelector('#clinNote')?.value||'';await apiRequest('/api/reports/'+report.id+'/review',{method:'PATCH',headers:{'X-Clinician-Token':token,'Content-Type':'application/json'},body:JSON.stringify({reviewer:'Profissional de saúde',notes,approved:true,edited_content:content})});S.activeReport=null;await loadClinicianReports()}
function clinical(){let token=sessionStorage.getItem('lumiClinicianToken');let head='<div class="clinical"><div class="brand">'+logo(30)+' lumi</div><span class="eyebrow">EQUIPE DE SAÚDE</span>';if(!token)return head+'<h1>Anamneses recebidas</h1><p>Acesse com o token profissional configurado no servidor.</p><label>Token profissional<input id="clinicianToken" type="password" autocomplete="current-password" placeholder="Token da equipe de saúde"></label><button class="primary" data-a="clinicianLogin">Acessar relatos</button></div>';if(S.activeReport){let c=S.activeReport.content,transcript=(S.activeReport.messages||[]).map(m=>line(m.role==='user'?'Relato informado':'Lumi',m.content)).join('');return head+'<button class="back" data-a="clinicianBack">'+ic('back',16)+'Voltar aos relatos</button><h1>Revisão profissional</h1>'+line('Paciente',S.activeReport.session_id)+line('Situação',S.activeReport.status)+'<h2>Conversa e atualizações</h2>'+transcript+'<h2>Relato estruturado</h2><label>Queixa principal<textarea data-clinical-field="queixa_principal">'+e(c.queixa_principal)+'</textarea></label><label>Tempo de evolução<textarea data-clinical-field="tempo_evolucao">'+e(c.tempo_evolucao)+'</textarea></label>'+['subjetivo','objetivo','avaliacao','plano'].map(k=>'<label>'+e(k==='avaliacao'?'Síntese preliminar':k[0].toUpperCase()+k.slice(1))+'<textarea data-clinical-field="soap.'+k+'">'+e(c.soap[k])+'</textarea></label>').join('')+'<label>Notas profissionais<textarea id="clinNote"></textarea></label><button class="primary" data-a="validate">Salvar revisão e aprovar</button><p>O relato é preliminar e precisa da validação de um profissional habilitado.</p></div>'}let rows=(S.clinicianReports||[]).map(r=>'<button class="item" data-a="open-report:'+e(r.id)+'"><span class="copy"><strong>'+e(r.patient_name)+'</strong><small>'+e(r.status)+' · '+e(new Date(r.created_at).toLocaleString(L[S.lang]))+'</small></span><span class="trail">'+ic('arrow',16)+'</span></button>').join('');return head+'<div class="row"><h1>Anamneses recebidas</h1><button class="link" data-a="clinicianRefresh">Atualizar</button></div><p>Relatos persistidos no Lumi para revisão profissional.</p>'+(rows||'<p>Nenhuma anamnese encontrada.</p>')+'<button class="link" data-a="clinicianLogout">Sair</button></div>'}
function render(){document.documentElement.lang=L[S.lang];root.innerHTML='<div class="app '+(!S.dark?'light ':'')+(S.large?'large ':'')+(S.contrast?'contrast ':'')+(S.reduce?'reduce ':'')+(S.clinical?'wide':'')+'"><div class="bar"><span>LUMI · DEMO</span><button data-a="switch">'+e(t(S.clinical?'app':'clinical'))+'</button></div><header><button class="brand" data-a="home" aria-label="Lumi">'+logo(31)+'lumi</button><div class="tools"><button class="iconbtn" data-a="access" aria-label="'+e(t('access'))+'">'+ic('access')+'</button><button class="iconbtn" data-a="language" aria-label="'+e(t('language'))+'">'+ic('globe',18)+L[S.lang].slice(0,2).toUpperCase()+'</button><button class="iconbtn" data-a="theme" aria-label="Light / dark">'+ic(S.dark?'sun':'moon',19)+'</button><button class="iconbtn" data-a="notifications" aria-label="'+e(t('notifications'))+'">'+ic('bell',19)+'</button></div></header><main>'+(S.notice?'<p role="status">'+e(S.notice)+'</p>':'')+(S.clinical?clinical():page())+'</main>'+(S.clinical?'':'<nav aria-label="Navigation">'+[['home','home','home'],['anam','chat','anam'],['wallet','wallet','wallet'],['history','history','history'],['profile','user','profile']].map(([k,i,a])=>'<button data-a="'+a+'" class="'+(S.page===a||(a==='anam'&&['modes','identify','safety','map','regions','interview','review','status'].includes(S.page))?'active':'')+'">'+ic(i,22)+e(t(k))+'</button>').join('')+'</nav>')+'</div>';persist()}
 let rec=null,speechVersion=0;function stop(){let r=rec;rec=null;if(r)try{r.abort()}catch(_){}S.listening=false;speechVersion++;window.speechSynthesis?.cancel()}
function availableSpeechVoices(synth){let voices=synth.getVoices();if(voices.length)return Promise.resolve(voices);return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;synth.removeEventListener?.('voiceschanged',finish);resolve(synth.getVoices())};synth.addEventListener?.('voiceschanged',finish,{once:true});setTimeout(finish,700)})}
function voiceScore(voice,locale){let lang=(voice.lang||'').toLowerCase().replace('_','-'),name=(voice.name+' '+voice.voiceURI).toLowerCase(),score=lang===locale.toLowerCase()?100:lang.startsWith(locale.slice(0,2).toLowerCase())?35:0;if(/natural|neural|online/.test(name))score+=45;if(/francisca|luciana|fernanda|vit[oó]ria|maria|camila|bruna|let[ií]cia|female/.test(name))score+=35;if(/google|microsoft|apple/.test(name))score+=15;if(/compact|espeak|pico|mbrola/.test(name))score-=80;return score}
async function say(text){const request=++speechVersion;try{let synth=window.speechSynthesis;if(!synth)throw Error();let voices=await availableSpeechVoices(synth);if(request!==speechVersion)return;let language=L[S.lang].slice(0,2).toLowerCase(),voice=voices.filter(v=>(v.lang||'').toLowerCase().replace('_','-').startsWith(language)).map(v=>({voice:v,score:voiceScore(v,L[S.lang])})).sort((a,b)=>b.score-a.score)[0]?.voice;if(!voice)throw Error();let u=new SpeechSynthesisUtterance(text);u.lang=L[S.lang];u.voice=voice;u.rate=.96;u.pitch=1.03;u.volume=1;synth.cancel();synth.speak(u)}catch(_){if(request!==speechVersion)return;S.notice='unavailable';render()}}
function read(){let last=[...(S.apiMessages||[])].reverse().find(m=>m.role==='assistant');say(last?.content||t('intro'))}
function go(pg){stop();S.page=pg;S.notice='';S.heard='';render();window.scrollTo(0,0);if(pg==='interview'&&S.mode==='voice')read()}
function choose(v,voice=false){let x=q(),old=vals(x.k);S.answers[x.k]={v:x.multi?(v==='unknown'?[v]:old.includes(v)?(voice?old:old.filter(a=>a!==v)):[...old.filter(a=>a!=='unknown'),v]):[v],lang:S.lang};render()}
function record(){let C=window.SpeechRecognition||window.webkitSpeechRecognition;if(!C){S.notice='unavailable';render();return}if(!confirm(t('voiceprivacy')))return;stop();try{let r=new C();rec=r;r.lang=L[S.lang];r.continuous=false;r.interimResults=false;S.listening=true;render();r.onresult=ev=>{if(rec!==r)return;S.draftMessage=ev.results[0][0].transcript;S.heard=S.draftMessage;S.listening=false;render()};r.onerror=()=>{if(rec===r){S.listening=false;S.notice='unavailable';render()}};r.onend=()=>{if(rec===r){rec=null;S.listening=false;render()}};r.start()}catch(_){S.listening=false;S.notice='unavailable';render()}}
function begin(other=false){Object.assign(S,{regions:[],areas:[],step:0,answers:{},notes:{},draft:true,sent:false,validated:false,updates:[],person:other,extra:false,resume:'modes',clinNote:'',draftMessage:'',sending:false,apiMessages:[],sessionId:'',sessionToken:'',apiReport:null});go('modes')}
root.addEventListener('input',ev=>{if(ev.target.id==='extra')S.notes[q().k]={text:ev.target.value,lang:S.notes[q().k]?.lang??S.lang};if(ev.target.id==='chatInput')S.draftMessage=ev.target.value;if(ev.target.id==='clinNote')S.clinNote=ev.target.value;if(ev.target.id==='clinicianToken')S.clinicianTokenDraft=ev.target.value;persist()});
root.addEventListener('change',ev=>{if(ev.target.id==='unit')S.unit=ev.target.value;if(ev.target.id==='payment')S.payment=ev.target.value;persist()});
root.addEventListener('click',async ev=>{let b=ev.target.closest('[data-a]');if(!b||b.disabled)return;let a=b.dataset.a;S.notice='';
if(a==='theme'){S.dark=!S.dark;render();return}
if(a==='switch'){stop();S.clinical=!S.clinical;if(S.clinical&&sessionStorage.getItem('lumiClinicianToken')){try{await loadClinicianReports()}catch(err){S.notice=err.message}}render();return}
if(a==='access'){S.returnPage=S.page;S.returnClinical=S.clinical;S.clinical=false;go('access');return}
if(a==='return'){S.clinical=!!S.returnClinical;go(S.returnPage||'home');return}
if(a==='language'){S.langBack=S.page;S.langClinical=S.clinical;S.clinical=false;go('language');return}
if(a.startsWith('lang:')){S.lang=+a.slice(5);render();return}
if(a==='langreturn'){S.clinical=!!S.langClinical;go(S.langBack||'home');return}
if(a.startsWith('mode:')){S.mode=a.slice(5);render();return}
if(a==='start'||a==='otherstart'||a==='anam'){if(S.sent||S.draft){go(S.sent?'status':S.resume);return}begin(a==='otherstart');return}
if(a==='resume'){go(S.resume);return}
if(a.startsWith('person:')){S.person=a.endsWith('1');render();return}
if(a==='home'||a==='notifications'){S.clinical=false;go(a);return}
if(a==='help'||a==='human'){S.helpBack=S.page;go(a);return}
if(a==='helpback'){go(S.helpBack||'home');return}
if(a.startsWith('model:')){S.model=a.slice(6);render();return}
if(a.startsWith('side:')){S.side=a.slice(5);render();return}
if(a.startsWith('area:')){let k=a.slice(5);S.areas=k==='nopain'?(S.areas.includes(k)?[]:[k]):S.areas.includes(k)?S.areas.filter(x=>x!==k):[...S.areas.filter(x=>x!=='nopain'),k];render();return}
if(a==='skipmap'){S.areas=[];S.resume='interview';try{await createApiSession();go('interview')}catch(err){S.notice=err.message;render()}return}
if(a.startsWith('region:')){let i=+a.slice(7);S.regions=S.regions.includes(i)?S.regions.filter(x=>x!==i):[...S.regions,i];S.step=0;render();return}
if(a==='unknownregion'){S.regions=[5];S.step=0;S.resume='interview';try{await createApiSession();go('interview')}catch(err){S.notice=err.message;render()}return}
if(a==='interview'){S.resume=a;S.step=0;try{await createApiSession();go(a)}catch(err){S.notice=err.message;render()}return}
if(a.startsWith('choose:')){choose(a.slice(7));return}
if(a==='extra'){S.extra=!S.extra;render();return}
if(a==='record'){record();return}
if(a==='listen'){read();return}
if(a==='next'){if(!vals(q().k).length)return;S.extra=false;if(S.step<qs().length-1){S.step++;go('interview')}else{S.resume='review';go('review')}return}
if(a==='prev'){S.extra=false;go(S.page==='review'?'interview':'map');return}
if(a==='pause'){S.resume='interview';go('home');return}
if(a==='edit'){S.step=0;S.resume='interview';go('interview');return}
if(a==='send-message'){try{await sendApiMessage()}catch(err){S.notice=err.message;render()}return}
if(a==='send'){try{await finalizeApiInterview();S.sent=true;S.draft=false;go('status')}catch(err){S.notice=err.message;render()}return}
if(a==='saveupdate'){let update={kind:root.querySelector('#kind').value,sym:root.querySelector('#sym').value,note:root.querySelector('#change').value};try{await saveApiUpdate(update);S.updates.push(update);S.validated=false;go('status')}catch(err){S.notice=err.message;render()}return}
if(a.startsWith('card:')){S.cards.push(a.slice(5));go('wallet');return}
if(a.startsWith('remove:')){S.cards.splice(+a.slice(7),1);render();return}
if(a.startsWith('toggle:')){let k=a.slice(7);S[k]=!S[k];render();return}
if(a==='validate'){if(S.clinical){try{await saveClinicalReview();S.notice='Revisão profissional salva.'}catch(err){S.notice=err.message;render()}return}S.validated=true;render();return}
if(a==='clinicianLogin'){let token=root.querySelector('#clinicianToken')?.value?.trim();if(!token){S.notice='Informe o token profissional.';render();return}sessionStorage.setItem('lumiClinicianToken',token);S.clinical=true;try{await loadClinicianReports()}catch(err){S.notice=err.message;sessionStorage.removeItem('lumiClinicianToken')}render();return}
if(a==='clinicianRefresh'){try{await loadClinicianReports()}catch(err){S.notice=err.message;render()}return}
if(a==='clinicianLogout'){sessionStorage.removeItem('lumiClinicianToken');S.clinicianReports=[];S.activeReport=null;S.clinical=false;render();return}
if(a==='clinicianBack'){S.activeReport=null;render();return}
if(a.startsWith('open-report:')){try{await openClinicalReport(a.slice(12))}catch(err){S.notice=err.message;render()}return}
if(a==='reset'){Object.assign(S,{draft:false,sent:false,validated:false,regions:[],areas:[],step:0,answers:{},notes:{},updates:[],cards:['SUS','plan'],clinNote:'',extra:false,sessionId:'',sessionToken:'',apiReport:null});go('home');return}
if(['identify','safety','map','regions','modes'].includes(a))S.resume=a;go(a)});
render();

