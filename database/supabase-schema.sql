-- Supabase PostgreSQL schema for the Depression Detection app.
-- Run this in Supabase SQL Editor before starting the backend.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'account_role') then
    create type account_role as enum ('student', 'admin', 'bk');
  end if;

  if not exists (select 1 from pg_type where typname = 'medical_record_status') then
    create type medical_record_status as enum ('open', 'closed', 'follow-up');
  end if;
end $$;

create table if not exists accounts (
  account_id varchar(50) primary key,
  email varchar(100) not null unique,
  password varchar(255) not null,
  role account_role not null,
  profile_picture varchar(255),
  is_active boolean default true,
  last_login timestamp,
  created_at timestamptz not null default now()
);

create table if not exists admins (
  admin_id varchar(50) primary key,
  account_id varchar(50) not null references accounts(account_id) on delete cascade,
  name varchar(100) not null,
  department varchar(100)
);

create table if not exists bk_staff (
  bk_id varchar(50) primary key,
  account_id varchar(50) not null references accounts(account_id) on delete cascade,
  nip varchar(20) unique,
  nidn varchar(20) unique,
  nuptk varchar(20) unique,
  name varchar(100) not null,
  specialization varchar(100)
);

create table if not exists students (
  student_id varchar(50) primary key,
  account_id varchar(50) not null references accounts(account_id) on delete cascade,
  nim varchar(20) not null unique,
  nik varchar(20) unique,
  name varchar(100) not null,
  faculty varchar(100),
  major varchar(100),
  semester integer,
  phone_number varchar(15)
);

create table if not exists medical_records (
  record_id varchar(50) primary key,
  student_id varchar(50) not null references students(student_id) on delete cascade,
  bk_id varchar(50) not null references bk_staff(bk_id) on delete cascade,
  consultation_date timestamp not null,
  consultation_type varchar(50) default 'Individual',
  complaint text,
  diagnosis text,
  depression_level varchar(50) default 'Normal',
  interventions text,
  recommendation text,
  follow_up_date timestamp,
  counselor_name varchar(100),
  counselor_notes text,
  created_at timestamptz not null default now(),
  status medical_record_status default 'open'
);

create table if not exists test_results (
  test_id varchar(50) primary key,
  student_id varchar(50) not null references students(student_id) on delete cascade,
  date timestamp not null,
  score integer not null,
  level varchar(50) not null,
  dass21_score numeric(5, 4) not null,
  answers jsonb not null
);

create table if not exists password_reset_tokens (
  token_id varchar(50) primary key,
  account_id varchar(50) not null references accounts(account_id) on delete cascade,
  token_hash varchar(64) not null unique,
  expires_at timestamp not null,
  used_at timestamp,
  created_at timestamptz not null default now()
);

create index if not exists idx_bk_name on bk_staff(name);
create index if not exists idx_nim on students(nim);
create index if not exists idx_student_name on students(name);
create index if not exists idx_medical_records_student_id on medical_records(student_id);
create index if not exists idx_medical_records_bk_id on medical_records(bk_id);
create index if not exists idx_medical_records_consultation_date on medical_records(consultation_date);
create index if not exists idx_test_results_student_id on test_results(student_id);
create index if not exists idx_test_date on test_results(date);
create index if not exists idx_level on test_results(level);
create index if not exists password_reset_tokens_account_id_idx on password_reset_tokens(account_id);

alter table accounts enable row level security;
alter table admins enable row level security;
alter table bk_staff enable row level security;
alter table students enable row level security;
alter table medical_records enable row level security;
alter table test_results enable row level security;
alter table password_reset_tokens enable row level security;
