-- Record whether the report came from the patient or assisted intake.
alter table public.anamnesis_sessions
    add column informant_type varchar(20) not null default 'patient';
