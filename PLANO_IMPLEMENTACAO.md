# LUNA CRM — Plano de Implementação v1.0

**Baseado no**: Documento Mestre v1.0  
**Status**: 📋 Pronto para Codificação  
**Data**: 17 de Agosto de 2026

---

## 📊 Matriz de Implementação

### Fases e Prioridades

```
Fase 1 (CRÍTICA): Infra e Autenticação
├─ Schema SQL com RLS
├─ RBAC e permissões
└─ Autenticação e sessão

Fase 2 (NÚCLEO): Pipelines e Leads
├─ Pipeline Comercial (Kanban)
├─ Pipeline Operacional (Kanban)
├─ Modelo de Lead com campos
└─ Duplicação automática de comissão

Fase 3 (OPERACIONAL): Módulos
├─ Dashboard com indicadores
├─ Clientes (CRUD + validações)
├─ Agenda e Demandas
└─ Documentos

Fase 4 (GESTÃO): Admin e Relatórios
├─ Configurações (usuários, cargos, perms)
├─ Auditoria e Logs
├─ Relatórios
└─ Equipe/Diretório

Fase 5 (POLIMENTO): Refine
├─ Testes de RLS
├─ Performance
├─ UX refinement
└─ Deploy
```

---

## 🗄️ FASE 1: INFRAESTRUTURA E AUTENTICAÇÃO

### 1.1 Schema SQL

**Arquivo**: `supabase/migrations/002_luna_schema.sql`

```sql
-- Enum types
CREATE TYPE user_role AS ENUM ('CEO', 'OPERACIONAL', 'COMERCIAL');
CREATE TYPE lead_stage AS ENUM (
  'lead', 'primeiro_contato', 'reuniao', 'novo_evento',
  'proposta', 'entrada_operacional', 'comissoes_a_pagar', 'comissoes_pagas'
);
CREATE TYPE lead_temperature AS ENUM ('quente', 'morno', 'frio', 'fechado');
CREATE TYPE activity_type AS ENUM ('demanda', 'evento', 'follow_up', 'reuniao');
CREATE TYPE finance_status AS ENUM ('pendente', 'pago', 'cancelado');
CREATE TYPE priority AS ENUM ('urgente', 'alta', 'media', 'baixa');
CREATE TYPE lead_profile AS ENUM (
  'novo_lead', 'cliente_ativo', 'ex_cliente', 'parceiro', 'influenciador'
);
CREATE TYPE document_type AS ENUM (
  'contrato', 'proposta', 'briefing', 'marketing', 'financeiro'
);

-- Tabela: roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name user_role UNIQUE NOT NULL,
  is_system BOOLEAN DEFAULT true,
  see_all_demands BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: role_permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  resource VARCHAR NOT NULL,
  action VARCHAR NOT NULL, -- 'view', 'edit', 'export'
  UNIQUE(role_id, resource, action),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: profiles (usuários)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  ativo BOOLEAN DEFAULT true,
  ultima_atividade TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa TEXT NOT NULL,
  produtor TEXT,
  cidade TEXT,
  estado TEXT,
  valor DECIMAL(12, 2),
  responsavel UUID NOT NULL REFERENCES profiles(id),
  temperatura lead_temperature DEFAULT 'morno',
  origem VARCHAR, -- instagram, whatsapp, linkedin, indicacao, site
  stage lead_stage DEFAULT 'lead',
  tags TEXT[] DEFAULT '{}',
  prioridade priority DEFAULT 'media',
  perfil lead_profile,
  email TEXT,
  telefone TEXT,
  instagram TEXT,
  segmento TEXT,
  notas TEXT,
  is_commission_copy BOOLEAN DEFAULT false,
  original_lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Tabela: activities (demandas/eventos)
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
  prioridade priority DEFAULT 'media',
  empresa TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Tabela: finance_transactions
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
  status finance_status DEFAULT 'pendente',
  comissao_paga BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo document_type NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  cliente_id UUID, -- será referência a tabela clientes quando criada
  url TEXT NOT NULL,
  tamanho INT,
  criado_por UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela: audit_logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES profiles(id),
  acao VARCHAR NOT NULL, -- 'create', 'update', 'delete'
  tabela VARCHAR NOT NULL,
  registro_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_leads_responsavel ON leads(responsavel);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_temperatura ON leads(temperatura);
CREATE INDEX idx_leads_is_commission ON leads(is_commission_copy);
CREATE INDEX idx_activities_lead ON activities(lead_id);
CREATE INDEX idx_activities_responsavel ON activities(responsavel);
CREATE INDEX idx_finance_lead ON finance_transactions(lead_id);
CREATE INDEX idx_documents_lead ON documents(lead_id);
CREATE INDEX idx_audit_usuario ON audit_logs(usuario_id);

-- RLS: Enable
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (ver seção abaixo)
-- ... (políticas de linha)
```

### 1.2 Políticas RLS (Exemplo)

```sql
-- Leads: Leitura
CREATE POLICY "lead_read_own_or_all"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid()
      AND (r.see_all_demands OR leads.responsavel = auth.uid())
    )
  );

-- Leads: Escrita (próprios apenas)
CREATE POLICY "lead_write_own"
  ON leads FOR UPDATE, DELETE
  USING (leads.responsavel = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'CEO'
    )
  );

-- Activities: Mesmo escopo
CREATE POLICY "activity_read_own"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid()
      AND (r.see_all_demands OR activities.responsavel = auth.uid())
    )
  );

-- Profiles: Diretório público (sem dados sensíveis)
CREATE POLICY "profile_read_public"
  ON profiles FOR SELECT
  USING (true);
```

### 1.3 Seed de Dados Iniciais

**Arquivo**: `supabase/seed.sql`

```sql
-- Inserir cargos
INSERT INTO roles (name, is_system, see_all_demands)
VALUES
  ('CEO', true, true),
  ('OPERACIONAL', true, false),
  ('COMERCIAL', true, false);

-- Inserir permissões (exemplo para CEO)
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
WHERE r.name = 'CEO';
```

---

## 🎯 FASE 2: PIPELINES E LEADS

### 2.1 Componente: Kanban (Comercial)

**Arquivo**: `packages/web/src/pages/CRMComercial.tsx`

```tsx
import { Kanban } from '../components/Kanban';

const COMMERCIAL_STAGES = [
  'lead',
  'primeiro_contato',
  'reuniao',
  'novo_evento',
  'proposta',
  'entrada_operacional',
  'comissoes_a_pagar',
  'comissoes_pagas'
];

export function CRMComercial() {
  return <Kanban stages={COMMERCIAL_STAGES} pipeline="comercial" />;
}
```

### 2.2 Componente: Kanban Genérico

**Arquivo**: `packages/web/src/components/Kanban.tsx`

- Colunas por etapa
- Drag-drop entre colunas (apenas adjacentes)
- Cards com: empresa, temperatura, prioridade, valor (condicionado)
- Menu de movimentação
- Filtros por responsável, temperatura, prioridade

### 2.3 Duplicação de Comissão

**Hook**: `packages/web/src/hooks/useLeadMovement.ts`

```tsx
async function moveLeadToStage(leadId: string, newStage: string) {
  // 1. Atualizar lead
  await updateLead(leadId, { stage: newStage });

  // 2. Se novo stage é 'entrada_operacional' e não tem cópia
  if (newStage === 'entrada_operacional') {
    const lead = await getLeadById(leadId);
    if (!lead.is_commission_copy && !lead.original_lead_id) {
      // Criar cópia em 'comissoes_a_pagar'
      await createCommissionCopy(leadId);
    }
  }

  // 3. Log de auditoria
  await logAudit('lead_stage_change', 'leads', leadId, { ...lead });
}
```

---

## 📊 FASE 3: DASHBOARD E MÓDULOS

### 3.1 Dashboard Refinado

**Indicadores**:
- Leads ativos (etapas 2-3)
- Prospecção por canal (5 canais)
- Conversão por etapa
- Receita mensal (CEO only)

**Implementação**: Uso de React Query com `useLeads`, `useFinance`, filtros condicionais por permissão.

### 3.2 Módulo Clientes (CRUD)

**Campos**:
- Razão social, email, telefone, cidade, estado
- Validações: telefone (DDD + 8-9 dígitos), cidade ↔ estado
- Abas: Dados, Histórico, Vínculos
- Ações: criar, editar, duplicar, arquivar, excluir

### 3.3 Módulo Agenda

**Demandas/Eventos**:
- Vinculação obrigatória a lead
- Tipos: demanda, evento, follow-up, reunião
- Responsável, prioridade, duração, status
- Deep-link para lead no pipeline

---

## ⚙️ FASE 4: GESTÃO E AUDITORIA

### 4.1 Configurações (Admin)

- Usuários: criar, editar, desativar
- Cargos: criar, editar permissões
- Logs: filtrar por usuário, ação, tabela
- Backup: exportar dados

### 4.2 Auditoria

Todos os logs registrados na tabela `audit_logs`:
- Criação/edição/exclusão de leads, clientes, demandas
- Movimentação de stage
- Mudança de permissões

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Backend/Banco
- [ ] Schema SQL completo com RLS
- [ ] Seed de roles e permissions
- [ ] Funções RPC para operações
- [ ] Índices otimizados
- [ ] Testes de RLS (usuários não veem dados de outros)

### Frontend - Autenticação & RBAC
- [ ] Store de sessão (Zustand)
- [ ] Store de permissões (carregadas na sessão)
- [ ] Hook `useHasPermission(resource, action)`
- [ ] Layout autenticado com menu dinâmico
- [ ] Tela de acesso negado

### Frontend - Pipelines
- [ ] Kanban comercial (8 etapas)
- [ ] Kanban operacional (7 etapas)
- [ ] Movimentação adjacente apenas
- [ ] Duplicação automática de comissão
- [ ] Ordenação por prioridade

### Frontend - Módulos
- [ ] Dashboard com 4 indicadores
- [ ] CRUD Clientes com validações
- [ ] Agenda com deep-links
- [ ] Documentos (upload, listagem)
- [ ] Relatórios (gráficos)

### Frontend - Admin
- [ ] Painel de usuários
- [ ] Painel de cargos/permissões
- [ ] Logs com filtros
- [ ] Backup/export

### Testes
- [ ] RLS: usuário COMERCIAL não vê dados de outros
- [ ] Permissões: menu filtra itens sem acesso
- [ ] Kanban: movimentação funciona
- [ ] Duplicação: comissão criada corretamente
- [ ] Auditoria: logs são registrados

---

## 🚀 Próximos Passos

1. **Criar schema SQL** com RLS policies
2. **Implementar RBAC** no frontend (store + hook)
3. **Codificar Kanban** (comercial + operacional)
4. **Implementar Dashboard** com indicadores
5. **CRUD Clientes** com validações
6. **Admin panel** (usuários, cargos, logs)
7. **Testes e QA**
8. **Deploy**

---

**Plano de Implementação LUNA CRM**  
**Versão**: 1.0  
**Status**: ✅ Pronto para Desenvolvimento
