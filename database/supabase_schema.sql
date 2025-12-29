-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
-- Tabela para armazenar dados extras do usuário
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update their own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CONVERSIONS (Jobs)
-- Tabela para armazenar o histórico de conversões
create table public.conversions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  title text, -- Nome amigável, ex: "Relatório_Financeiro.pdf"
  action_type text not null, -- ex: 'compress_pdf', 'merge_pdf', 'convert_to_word'
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  input_format text,
  output_format text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- RLS for Conversions
alter table public.conversions enable row level security;

create policy "Users can view their own conversions" 
  on conversions for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own conversions" 
  on conversions for insert 
  with check (auth.uid() = user_id);

-- DOCUMENTS (Files)
-- Tabela para armazenar metadados dos arquivos
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  conversion_id uuid references public.conversions(id) on delete cascade,
  name text not null,
  size bigint,
  mime_type text,
  storage_path text, -- Caminho no Supabase Storage
  is_output boolean default false, -- Se é o arquivo gerado (saída) ou original (entrada)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Documents
alter table public.documents enable row level security;

create policy "Users can view their own documents" 
  on documents for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own documents" 
  on documents for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete their own documents" 
  on documents for delete 
  using (auth.uid() = user_id);
