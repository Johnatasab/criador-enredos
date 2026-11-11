--A Ectensão, ativa um pacote extra do Postgrescom função de criptografia
create extension if not exists "pgcrypto";

--Profiles espelhan auth.users
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade, --uuid é um identificador único
    email text,
    display_name text,
    avatar_erl text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

--Ao ativar o "Row Level Security" ninguém acessa nehuma linha, a menos que a política permita
alter table public.profiles enable row level security;

--Cada pessoa só lê o seu perfil
create policy "Os usuários podem ler o próprio perfil."
on public.profiles for select --Vale para leitura 
using (auth.uid() = id); --auth.uid() devolver o id de quem está logado

create policy "Os usuários podem atualizar seu próprio perfil."
on public.profiles for update
using (auth.uid() = id);

--Cria perfil automaticamente quando um user se regista
create or replace function public.handle_new_user() --Cria, ou substitui se já existir
returns trigger     --Feito para chamada por um gatilho
language plpgsql    --Linguagem interna do Postgres
security definer    --Função roda com a permissões de quem criou 
set search_path = public    --Fixa aonde o Postgres procura a tabela 
as $$
begin
    insert into public.profiles (id, email, display_name, avatar_url)
    values (
        new.id,
        new.email,
        coalesce(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            new.email
        ),
        new.raw_user_meta_data->>'avatar_url'
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

--O gatilho
drop trigger if exists on_auth_user_created on auth.users;  --Remove a versão antiga para o arquivo ser reexecutado sem erro

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
