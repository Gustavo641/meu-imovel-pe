-- FASE 3: Tabela Clientes
-- Data: 18/08/2026

CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado VARCHAR(2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_cidade ON clientes(cidade);
CREATE INDEX idx_clientes_estado ON clientes(estado);
CREATE INDEX idx_clientes_ativo ON clientes(ativo);

-- RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "clientes_read_all" ON clientes FOR SELECT USING (true);
CREATE POLICY "clientes_write_all" ON clientes FOR INSERT, UPDATE, DELETE USING (true);
