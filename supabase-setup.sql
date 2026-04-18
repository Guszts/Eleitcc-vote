-- ==============================================================
-- 🚀 SCRIPT DE CONFIGURAÇÃO DO SUPABASE
-- Cole este script no "SQL Editor" do seu painel do Supabase.
-- ==============================================================

-- 1. Criação das tabelas
CREATE TABLE IF NOT EXISTS system_settings (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  winner JSONB,
  vice JSONB
);

-- Insere o estado inicial do sistema
INSERT INTO system_settings (id, status) VALUES ('election', 'ongoing') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE, -- UM POR USUÁRIO
  name TEXT NOT NULL,
  slogan TEXT,
  grade TEXT,
  description TEXT,
  photoUrl TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE, -- UM VOTO POR USUÁRIO
  voted_for_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Políticas de Segurança Simples (RLS off para visualização PWA fluida, segurança baseada na API via constraints)
-- Nota: Para um ambiente mais restritivo em produção pesada, ative o RLS e confira as constraints
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE candidates DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- 3. Inscrição para Tempo Real
begin;
  drop publication if exists supabase_realtime cascade;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table system_settings, candidates, votes;
