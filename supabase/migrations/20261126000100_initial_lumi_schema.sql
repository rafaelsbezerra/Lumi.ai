-- Lumi schema for Supabase PostgreSQL.
-- Apply once from the Supabase SQL Editor or with `supabase db push`.
-- RLS is enabled on all application tables. The FastAPI backend connects
-- with a server-only database credential; no database credential belongs
-- in the Next.js frontend.

begin;

create table public.patients (
    id varchar(36) primary key,
    display_name varchar(120) not null default 'Paciente demonstrativo',
    is_demo boolean not null default true,
    created_at timestamptz not null default now()
);

create table public.anamnesis_sessions (
    id varchar(36) primary key,
    patient_id varchar(36) not null references public.patients(id),
    access_token_hash varchar(64) not null default '',
    status varchar(30) not null default 'in_progress',
    channel varchar(30) not null default 'web',
    provider_mode varchar(30) not null default 'rules_demo',
    collected json not null default '{}'::json,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.messages (
    id varchar(36) primary key,
    session_id varchar(36) not null references public.anamnesis_sessions(id) on delete cascade,
    role varchar(20) not null,
    content text not null,
    created_at timestamptz not null default now()
);

create table public.soap_reports (
    id varchar(36) primary key,
    session_id varchar(36) not null unique references public.anamnesis_sessions(id) on delete cascade,
    content json not null,
    status varchar(30) not null default 'pending_review',
    created_at timestamptz not null default now()
);

create table public.review_audits (
    id varchar(36) primary key,
    report_id varchar(36) not null references public.soap_reports(id) on delete cascade,
    reviewer varchar(120) not null,
    action varchar(30) not null,
    notes text not null default '',
    edited_content json,
    created_at timestamptz not null default now()
);

create index ix_anamnesis_sessions_patient_id on public.anamnesis_sessions(patient_id);
create index ix_anamnesis_sessions_status on public.anamnesis_sessions(status);
create index ix_messages_session_id on public.messages(session_id);
create index ix_soap_reports_session_id on public.soap_reports(session_id);
create index ix_soap_reports_status on public.soap_reports(status);
create index ix_review_audits_report_id on public.review_audits(report_id);

alter table public.patients enable row level security;
alter table public.anamnesis_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.soap_reports enable row level security;
alter table public.review_audits enable row level security;

-- No browser-facing policies are created. Direct anon/authenticated access is denied.
revoke all on table public.patients, public.anamnesis_sessions, public.messages,
    public.soap_reports, public.review_audits from anon, authenticated;

commit;
