# Lumi — MVP de anamnese

Aplicação web simples servida pela API FastAPI, com persistência SQLAlchemy, migrations Alembic, entrevista adaptativa, estrutura SOAP validada, revisão profissional protegida e integração opcional com Groq.

## Requisitos

Python 3.11 ou superior. PostgreSQL é suportado; sem `DATABASE_URL`, o projeto usa SQLite local para facilitar a demonstração. O modo sem `GROQ_API_KEY` usa um fluxo determinístico claramente rotulado como demonstração, não como resposta de IA.

## Executar no Windows

```powershell
cd C:\Users\Rafael\Downloads\lumi
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
alembic upgrade head
uvicorn backend.main:app --reload
```

Abra http://127.0.0.1:8000. O Swagger fica em `/docs`.

## Supabase

Para criar o schema no Supabase, execute o arquivo `supabase/migrations/20261126000100_initial_lumi_schema.sql` no SQL Editor do projeto, ou aplique-o com a Supabase CLI. Ele cria as tabelas, índices e ativa RLS; não cria acesso direto para `anon`/`authenticated`. A API FastAPI deve usar uma credencial PostgreSQL guardada apenas no `.env` do servidor.

No Dashboard do Supabase, abra **Connect** e copie a URL de conexão. Para este backend persistente, use Direct Connection se o host tiver IPv6/IPv4 compatível, ou Session Pooler (porta 5432) se precisar de IPv4. No `.env`, configure `DATABASE_URL` no formato SQLAlchemy, por exemplo `postgresql+psycopg://postgres:SENHA@HOST:5432/postgres?sslmode=require`. Não coloque essa URL no frontend e não envie a senha no chat. Depois de criar o schema com a migration Supabase, **não execute Alembic nesse mesmo banco**, pois o histórico de migrations do Supabase e o do Alembic são separados.

Para banco SQLite local ou PostgreSQL fora do Supabase, continue usando `alembic upgrade head`.

## Deploy completo na Vercel

O `vercel.json` configura um único projeto Vercel Services com dois serviços no mesmo domínio: Next.js em `/` e FastAPI em `/api/*`. As chamadas do navegador são same-origin. A Vercel aceita o FastAPI como serviço Python; execute `vercel dev` na raiz do Lumi para validar o mesmo roteamento localmente. A disponibilidade de Vercel Services depende de o recurso estar habilitado para o projeto/conta.

No ambiente da Vercel, cadastre as variáveis abaixo no serviço correspondente. Mantenha `DATABASE_URL` e `GROQ_API_KEY` como secrets somente do servidor:

- `DATABASE_URL`: URI do Supabase Transaction Pooler na porta 6543, trocando o prefixo para `postgresql+psycopg://` e exigindo SSL (`?sslmode=require`). A senha precisa estar URL-encoded se tiver caracteres especiais.
- `GROQ_API_KEY`: chave privada do provedor, se quiser ativar a IA/transcrição.
- `HANDTALK_TOKEN`: token do Hand Talk for Devs para habilitar o avatar 3D e a tradução das respostas em Libras. O token é recebido após contratação com a Hand Talk; configure também o domínio de preview/produção conforme as regras da sua conta. A rota do frontend o entrega ao SDK no navegador, conforme o modelo de integração do fornecedor, portanto use um token limitado ao domínio do projeto.
- `CLINICIAN_TOKEN`: substitua o token demonstrativo por um valor forte.

O modo Libras pede consentimento antes de enviar respostas da Lumi à Hand Talk. Com a chave configurada, o avatar pode sinalizar automaticamente cada resposta durante a entrevista. A tradução automática pode conter imprecisões e não substitui intérprete humano nem revisão clínica.

O backend desliga prepared statements no Psycopg para o Transaction Pooler e começa com pool local de uma conexão por instância. A migration SQL do Supabase é aplicada uma vez pelo SQL Editor/CLI; a função Vercel não executa migrations ao iniciar. `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` não são necessários para o acesso SQLAlchemy atual; eles serão usados se adicionarmos Supabase Auth/Data API no frontend. A publishable key nunca substitui `DATABASE_URL`.

Para executar o frontend Next.js com hot reload em outra janela:

```powershell
cd C:\Users\Rafael\Downloads\lumi\frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abra http://localhost:3000. A aplicação também está disponível em http://127.0.0.1:8000 pela página HTML leve servida pelo FastAPI.

Para PostgreSQL, ajuste `DATABASE_URL` no `.env`, por exemplo `postgresql+psycopg://lumi:senha@localhost:5432/lumi`, e instale o driver `psycopg[binary]`.

Exemplo de preparação local do banco com `psql`:

```sql
CREATE ROLE lumi LOGIN PASSWORD 'troque-esta-senha';
CREATE DATABASE lumi OWNER lumi;
```

Depois configure `DATABASE_URL=postgresql+psycopg://lumi:troque-esta-senha@localhost:5432/lumi` e execute `alembic upgrade head`.

## Configurações

- `DATABASE_URL`: banco persistente; PostgreSQL recomendado para ambiente compartilhado.
- `GROQ_API_KEY`: chave do Groq. Sem ela, o app permanece em modo demonstrativo de regras.
- `GROQ_MODEL`: modelo configurável, padrão `openai/gpt-oss-120b`. O Llama 3.3 pode ser informado manualmente se a conta Enterprise ainda tiver acesso; o Groq o descontinuou para planos gratuitos/de desenvolvimento em agosto de 2026.
- `CLINICIAN_TOKEN`: token simples de acesso à área profissional; altere antes de qualquer uso fora do computador local.
- `ALLOWED_ORIGINS`: origens CORS separadas por vírgula.
- `MAX_AUDIO_MB`: limite de upload. A transcrição depende da chave Groq.

## API principal

`POST /api/sessions`, `GET /api/sessions/{id}`, `POST /api/sessions/{id}/messages`, `PATCH /api/sessions/{id}/structured-answers`, `POST /api/sessions/{id}/updates`, `POST /api/sessions/{id}/audio`, `POST /api/sessions/{id}/finalize`, `GET /api/reports`, `GET /api/reports/{id}`, `PATCH /api/reports/{id}/review`. A criação retorna um token aleatório da sessão, armazenado apenas como hash e necessário em `X-Session-Token` para recuperar e alterar essa sessão. Endpoints profissionais recebem `X-Clinician-Token`.

As migrations ficam em `migrations/`; crie uma revisão com `alembic revision --autogenerate -m "descricao"`.

## Validação

```powershell
pytest -q
```

Estrutura principal: `backend/` (API e serviços clínicos), `migrations/` (Alembic), `tests/` (testes de API e regras), `frontend/src/app/` (Next.js App Router) e `app.html` (tela leve servida pelo FastAPI).

## Limites conhecidos

O token profissional é um mecanismo simples de MVP, não autenticação adequada para produção; falta identidade, papéis e controle de acesso organizacional. Não há envio de áudio persistido, WhatsApp, consentimento formal nem integração com prontuário. Dados demonstrativos usam marcação `is_demo`. A aplicação não deve receber dados reais sem controles de segurança, privacidade e revisão clínica apropriados.

### Migração incremental do Supabase

Se o schema inicial `supabase/migrations/20261126000100_initial_lumi_schema.sql` já foi aplicado, execute agora `supabase/migrations/20261126000200_add_informant_type.sql` no SQL Editor do Supabase. Esse SQL adiciona a origem do relato (paciente, acompanhante ou equipe) usada pela interface e API atuais. Não rode Alembic nesse banco: a pasta `migrations/` mantém a sequência equivalente para o SQLite local e bancos geridos por Alembic.
