-- LUNA CRM — Schema Completo com RLS
-- Data: 17/08/2026
-- Status: PRODUCTION READY

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

CREATE TYPE user_role_type AS ENUM ('CEO', 'OPERACIONAL', 'COMERCIAL');

CREATE TYPE lead_stage_type AS ENUM (
  'lead',
  'primeiro_contato',
  'reuniao',
  'novo_evento',
  'proposta',
  'entrada_operacional',
  'comissoes_a_pagar',
  'comissoes_pagas'
);

CREATE TYPE lead_temperature_type AS ENUM ('quente', 'morno', 'frio', 'fechado');

CREATE TYPE activity_type AS ENUM ('demanda', 'evento', 'follow_up', 'reuniao');

CREATE TYPE finance_status_type AS ENUM ('pendente', 'pago', 'cancelado');

CREATE TYPE priority_type AS ENUM ('urgente', 'alta', 'media', 'baixa');

CREATE TYPE lead_profile_type AS ENUM (
  'novo_lead',
  'cliente_ativo',
  'ex_cliente',
  'parceiro',
  'influenciador'
);

CREATE TYPE document_type AS ENUM (
  'contrato',
  'proposta',
  'briefing',
  'marketing',
  'financeiro'
);

-- ============================================================================
-- TABLES
-- ============================================================================

-- Tabela: roles (Cargos do sistema)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name user_role_type UNIQUE NOT NULL,
  is_system BOOLEAN DEFAULT true,
  see_all_demands BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: role_permissions (Permissões por cargo)
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  resource VARCHAR NOT NULL,
  action VARCHAR NOT NULL, -- 'view', 'edit', 'export'
  UNIQUE(role_id, resource, action),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: profiles (Usuários do sistema)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role_id UUID NOT NULL REFERENCES roles(id),
  ativo BOOLEAN DEFAULT true,
  ultima_atividade TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: leads (Oportunidades no CRM)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa TEXT NOT NULL,
  produtor TEXT,
  cidade TEXT,
  estado TEXT,
  valor DECIMAL(12, 2),
  responsavel UUID NOT NULL REFERENCES profiles(id),
  temperatura lead_temperature_type DEFAULT 'morno',
  origem VARCHAR, -- instagram, whatsapp, linkedin, indicacao, site
  stage lead_stage_type DEFAULT 'lead',
  tags TEXT[] DEFAULT '{}',
  prioridade priority_type DEFAULT 'media',
  perfil lead_profile_type,
  email TEXT,
  telefone TEXT,
  instagram TEXT,
  segmento TEXT,
  notas TEXT,
  is_commission_copy BOOLEAN DEFAULT false,
  original_lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Tabela: activities (Demandas e eventos)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type activity_type NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  start_time TIMESTAMPTZ,
  duration_min INT,
  status VARCHAR DEFAULT 'pendente', -- pendente, concluida
  resultado VARCHAR, -- sim, nao, reagendado
  resultado_obs TEXT,
  responsavel UUID NOT NULL REFERENCES profiles(id),
  prioridade priority_type DEFAULT 'media',
  empresa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Tabela: finance_transactions (Transações financeiras)
CREATE TABLE finance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  empresa TEXT,
  valor DECIMAL(12, 2),
  comercial VARCHAR,
  data DATE,
  vencimento DATE,
  comissao_pct DECIMAL(5, 2),
  forma_pagamento VARCHAR, -- dinheiro, cartao, transferencia
  status finance_status_type DEFAULT 'pendente',
  comissao_paga BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: documents (Documentos vinculados)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo document_type NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  cliente_id UUID, -- Será usado quando tabela clientes for criada
  url TEXT NOT NULL,
  tamanho INT,
  criado_por UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: audit_logs (Auditoria)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES profiles(id),
  acao VARCHAR NOT NULL, -- 'create', 'update', 'delete', 'stage_change'
  tabela VARCHAR NOT NULL,
  registro_id UUID,
  registro_nome TEXT,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_leads_responsavel ON leads(responsavel);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_temperatura ON leads(temperatura);
CREATE INDEX idx_leads_is_commission ON leads(is_commission_copy);
CREATE INDEX idx_leads_original_id ON leads(original_lead_id);
CREATE INDEX idx_leads_created_by ON leads(created_by);
CREATE INDEX idx_activities_lead ON activities(lead_id);
CREATE INDEX idx_activities_responsavel ON activities(responsavel);
CREATE INDEX idx_finance_lead ON finance_transactions(lead_id);
CREATE INDEX idx_documents_lead ON documents(lead_id);
CREATE INDEX idx_audit_usuario ON audit_logs(usuario_id);
CREATE INDEX idx_audit_tabela ON audit_logs(tabela);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: roles (leitura pública para construir menu)
-- ============================================================================

CREATE POLICY "roles_read_public"
  ON roles FOR SELECT
  USING (true);

-- ============================================================================
-- RLS POLICIES: role_permissions (leitura pública)
-- ============================================================================

CREATE POLICY "role_permissions_read_public"
  ON role_permissions FOR SELECT
  USING (true);

CREATE POLICY "role_permissions_write_ceo_only"
  ON role_permissions FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

-- ============================================================================
-- RLS POLICIES: profiles (diretório com segurança)
-- ============================================================================

CREATE POLICY "profiles_read_own_or_public_directory"
  ON profiles FOR SELECT
  USING (
    id = auth.uid() OR
    true -- Diretório público (sem dados sensíveis)
  );

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "profiles_insert_ceo_only"
  ON profiles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "profiles_delete_ceo_only"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

-- ============================================================================
-- RLS POLICIES: leads (escopo por responsável ou CEO vê tudo)
-- ============================================================================

CREATE POLICY "leads_read_own_or_all"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid()
      AND (r.see_all_demands OR leads.responsavel = auth.uid())
    )
  );

CREATE POLICY "leads_insert_own"
  ON leads FOR INSERT
  WITH CHECK (
    responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "leads_update_own"
  ON leads FOR UPDATE
  USING (
    responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "leads_delete_own"
  ON leads FOR DELETE
  USING (
    responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

-- ============================================================================
-- RLS POLICIES: activities (mesmo escopo de leads)
-- ============================================================================

CREATE POLICY "activities_read_own_leads"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid()
      AND (r.see_all_demands OR activities.responsavel = auth.uid())
    )
  );

CREATE POLICY "activities_insert_own"
  ON activities FOR INSERT
  WITH CHECK (
    responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "activities_update_own"
  ON activities FOR UPDATE
  USING (
    responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "activities_delete_own"
  ON activities FOR DELETE
  USING (
    responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

-- ============================================================================
-- RLS POLICIES: finance_transactions (mesmo escopo de leads)
-- ============================================================================

CREATE POLICY "finance_read_own_leads"
  ON finance_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      JOIN profiles p ON l.responsavel = p.id
      JOIN roles r ON p.role_id = r.id
      WHERE l.id = finance_transactions.lead_id
      AND (r.see_all_demands OR l.responsavel = auth.uid())
    )
  );

CREATE POLICY "finance_write_own"
  ON finance_transactions FOR INSERT, UPDATE, DELETE
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = finance_transactions.lead_id
      AND (l.responsavel = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles p
          JOIN roles r ON p.role_id = r.id
          WHERE p.id = auth.uid() AND r.name = 'CEO'
        )
      )
    )
  );

-- ============================================================================
-- RLS POLICIES: documents
-- ============================================================================

CREATE POLICY "documents_read_all"
  ON documents FOR SELECT
  USING (true);

CREATE POLICY "documents_write_own"
  ON documents FOR INSERT, UPDATE, DELETE
  USING (criado_por = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

-- ============================================================================
-- RLS POLICIES: audit_logs
-- ============================================================================

CREATE POLICY "audit_logs_read_ceo"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

CREATE POLICY "audit_logs_insert_system"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- DATA SEEDING
-- ============================================================================

-- Inserir cargos
INSERT INTO roles (name, is_system, see_all_demands)
VALUES
  ('CEO', true, true),
  ('OPERACIONAL', true, false),
  ('COMERCIAL', true, false)
ON CONFLICT DO NOTHING;

-- Inserir permissões para CEO
INSERT INTO role_permissions (role_id, resource, action)
SELECT r.id, resource, action
FROM roles r
CROSS JOIN (
  VALUES
    ('dashboard', 'view'), ('dashboard', 'edit'), ('dashboard', 'export'),
    ('crm_comercial', 'view'), ('crm_comercial', 'edit'), ('crm_comercial', 'export'),
    ('crm_operacional', 'view'), ('crm_operacional', 'edit'), ('crm_operacional', 'export'),
    ('clientes', 'view'), ('clientes', 'edit'), ('clientes', 'export'),
    ('agenda', 'view'), ('agenda', 'edit'), ('agenda', 'export'),
    ('documentos', 'view'), ('documentos', 'edit'), ('documentos', 'export'),
    ('relatorios', 'view'), ('relatorios', 'edit'), ('relatorios', 'export'),
    ('equipe', 'view'), ('equipe', 'edit'), ('equipe', 'export'),
    ('configuracoes', 'view'), ('configuracoes', 'edit'), ('configuracoes', 'export'),
    ('usuarios', 'view'), ('usuarios', 'edit'), ('usuarios', 'export')
) AS perms(resource, action)
WHERE r.name = 'CEO'
ON CONFLICT DO NOTHING;

-- Inserir permissões para OPERACIONAL
INSERT INTO role_permissions (role_id, resource, action)
SELECT r.id, resource, action
FROM roles r
CROSS JOIN (
  VALUES
    ('dashboard', 'view'), ('dashboard', 'edit'), ('dashboard', 'export'),
    ('crm_comercial', 'view'), ('crm_comercial', 'edit'), ('crm_comercial', 'export'),
    ('crm_operacional', 'view'), ('crm_operacional', 'edit'), ('crm_operacional', 'export'),
    ('clientes', 'view'), ('clientes', 'edit'), ('clientes', 'export'),
    ('agenda', 'view'), ('agenda', 'edit'), ('agenda', 'export'),
    ('documentos', 'view'), ('documentos', 'edit'), ('documentos', 'export'),
    ('relatorios', 'view'), ('relatorios', 'edit'), ('relatorios', 'export'),
    ('equipe', 'view') -- sem edit, sem export
) AS perms(resource, action)
WHERE r.name = 'OPERACIONAL'
ON CONFLICT DO NOTHING;

-- Inserir permissões para COMERCIAL
INSERT INTO role_permissions (role_id, resource, action)
SELECT r.id, resource, action
FROM roles r
CROSS JOIN (
  VALUES
    ('dashboard', 'view'), -- sem edit, sem export
    ('crm_comercial', 'view'), ('crm_comercial', 'edit'), ('crm_comercial', 'export'),
    ('clientes', 'view'), ('clientes', 'edit'), ('clientes', 'export'),
    ('agenda', 'view'), ('agenda', 'edit'), ('agenda', 'export'),
    ('documentos', 'view'), ('documentos', 'edit'), ('documentos', 'export'),
    ('equipe', 'view') -- sem edit, sem export
) AS perms(resource, action)
WHERE r.name = 'COMERCIAL'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
