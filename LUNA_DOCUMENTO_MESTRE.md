# LUNA CRM — Documento Mestre v1.0

**Data**: 17 de Agosto de 2026

---

## Sumário
1. Visão geral do sistema
2. Cargos, permissões e controle de acesso
3. Pipelines do CRM (Comercial e Operacional)
4. Regras de negócio
5. Clientes e validações
6. Agenda e demandas
7. Documentos
8. Auditoria e logs
9. Modelo de dados
10. Segurança de dados (RLS)
11. Arquitetura técnica
12. Glossário

---

## 1. Visão Geral do Sistema

O LUNA CRM centraliza toda a inteligência comercial e operacional da empresa em um único sistema. Não existe módulo financeiro separado: o acompanhamento de valores, taxas e comissões acontece dentro dos pipelines do CRM, com visibilidade condicionada ao cargo do usuário.

### Módulos

| Módulo | Rota | Recurso | Finalidade |
|--------|------|---------|-----------|
| **Dashboard** | `/dashboard` | dashboard | Indicadores gerais: leads ativos, origem de prospecção, conversão e receita mensal (CEO) |
| **CRM Comercial** | `/crm/comercial` | crm_comercial | Prospecção, qualificação, proposta e fechamento; controle de comissões |
| **CRM Operacional** | `/crm/operacional` | crm_operacional | Execução do evento: contrato, pagamentos, andamento e pós-evento |
| **Clientes** | `/clientes` | clientes | Cadastro de empresas/produtores, histórico e dados de contato |
| **Agenda** | `/agenda` | agenda | Demandas e eventos vinculados a leads, com deep-link para o pipeline |
| **Documentos** | `/documentos` | documentos | Contratos, propostas, briefings e arquivos |
| **Relatórios** | `/relatorios` | relatorios | Análises de desempenho do pipeline |
| **Equipe** | `/equipe` | equipe | Diretório de usuários reais do sistema |
| **Configurações** | `/configuracoes` | configuracoes | Usuários, cargos, permissões e logs de auditoria |
| **Ajuda** | `/ajuda` | público | Orientações de uso; visível a qualquer usuário autenticado |

---

## 2. Cargos, Permissões e Controle de Acesso

### Sistema RBAC (Role-Based Access Control)

Acesso definido por cargo. Cada cargo possui permissões no formato `recurso:ação`, onde a ação pode ser:
- **V** = visualizar
- **E** = editar (criar/editar/excluir)
- **X** = exportar/baixar

### Cargos Cadastrados

| Cargo | Vê Todas as Demandas | Característica |
|-------|----------------------|-----------------|
| **CEO** | Sim | Acesso total a todos os módulos, incluindo usuários, cargos e receita mensal |
| **OPERACIONAL** | Não (apenas próprias) | Acesso amplo de operação e relatórios; sem gestão de usuários e cargos |
| **COMERCIAL** | Não (apenas próprias) | Foco em prospecção e fechamento; CRM Operacional apenas leitura; sem relatórios |

### Matriz de Permissões por Cargo

| Módulo | Recurso | CEO | OPERACIONAL | COMERCIAL |
|--------|---------|-----|-------------|-----------|
| Dashboard | dashboard | V E X | V E X | V — X |
| CRM Comercial | crm_comercial | V E X | V E X | V E X |
| CRM Operacional | crm_operacional | V E X | V E X | V — — |
| Clientes | clientes | V E X | V E X | V E X |
| Agenda | agenda | V E X | V E X | V E X |
| Documentos | documentos | V E X | V E X | V E X |
| Relatórios | relatorios | V E X | V E X | — — — |
| Equipe | equipe | V E X | V E X | V — — |
| Configurações | configuracoes | V E X | — — — | — — — |
| Usuários | usuarios | V E X | — — — | — — — |

**Legenda**: V = visualizar, E = editar, X = exportar/baixar, — = sem permissão

### Regras Especiais de Visibilidade

- **Receita Mensal**: Card visível somente para CEO
- **Valores monetários**: Ocultos nas etapas iniciais do funil (Lead até Entrada Operacional)
- **Escopo de demandas**: Usuários sem "ver todas as demandas" acessam apenas registros onde são responsáveis (aplicado no banco por RLS)
- **Sincronização de sessão**: Perfil e permissões sincronizados no layout autenticado antes da renderização
- **Acesso negado**: Usuário sem permissão é direcionado para tela de acesso negado

---

## 3. Pipelines do CRM

### 3.1 Pipeline Comercial

| # | Etapa | Significado | Valor no Card |
|---|-------|-----------|---------------|
| 1 | **Lead** | Registro recém-criado, sem contato efetivo | Oculto |
| 2 | **Primeiro Contato** | Contato inicial realizado | Oculto |
| 3 | **Reunião** | Reunião agendada ou realizada | Oculto |
| 4 | **Novo Evento** | Evento identificado e em levantamento | Oculto |
| 5 | **Proposta** | Proposta comercial enviada | Oculto |
| 6 | **Entrada Operacional** | Negócio aceito; entra na execução | Oculto |
| 7 | **Comissões a Pagar** | Cópia automática do lead para comissão | Visível |
| 8 | **Comissões Pagas** | Comissão liquidada | Visível |

### 3.2 Pipeline Operacional

| # | Etapa | Significado |
|---|-------|-----------|
| 1 | **Entrada Operacional** | Recebimento da demanda pelo time |
| 2 | **Contrato** | Contrato em elaboração/assinatura |
| 3 | **Pagamento Pendente** | Cobrança emitida, aguardando liquidação |
| 4 | **Pagamento Efetivado** | Pagamento confirmado |
| 5 | **Evento em Andamento** | Execução do evento em curso |
| 6 | **Pós-Evento** | Fechamento, entregáveis e feedback |
| 7 | **Concluído** | Demanda encerrada |

### 3.3 Regras de Movimentação

- Movimentação permitida apenas entre etapas **adjacentes**
- Menu de movimentação deriva lista de etapas dos dois pipelines combinados
- Colunas ordenadas por prioridade: Urgente → Alta → Média → Baixa
- Alertas com data limite em destaque no card
- Valores monetários ocultos em etapas iniciais do funil

---

## 4. Regras de Negócio

### 4.1 Duplicação Automática de Comissão

Quando um lead é movido para **Entrada Operacional**:
1. Card original permanece na etapa
2. Sistema cria automaticamente uma cópia em **Comissões a Pagar**
3. Cópia marcada como registro de comissão
4. Referência ao lead original guardada
5. Duplicação ocorre **uma única vez** por lead

### 4.2 Prioridade, Temperatura e Alertas

| Dimensão | Valores |
|----------|---------|
| **Prioridade** | Urgente, Alta, Média, Baixa (sempre exibida no card) |
| **Temperatura** | Quente, Morno, Frio, Fechado |
| **Alertas** | Follow-up atrasado, Sem resposta, Reunião perdida, Pendência documental |
| **Origem** | Instagram, WhatsApp, LinkedIn, Indicação, Site |
| **Perfil** | Novo Lead, Cliente Ativo, Ex-cliente, Parceiro, Influenciador |

### 4.3 Taxas e Pagamento

- Painel do lead traz **Editar Taxas** com campos: Taxas (%), forma de pagamento, vencimento
- Alterações sincronizam com registro financeiro no banco (assíncrono)
- Valores em reais (BRL), sem centavos nos cards

### 4.4 Indicadores do Dashboard

- **Leads ativos**: Etapas de Primeiro Contato até Contrato (exclui cópias de comissão)
- **Prospecção por canal**: 5 canais sempre listados, inclusive com zero
- **Receita Mensal**: Sincroniza em tempo real, permite período/comparação/export (CEO)
- **Conversão**: Detalhe por etapa e por canal

---

## 5. Clientes e Validações

- Não é permitido salvar cadastro vazio
- Campos obrigatórios validados e destacados com mensagem de erro
- **Telefone**: Máscara e validação de números brasileiros (DDD + 8 ou 9 dígitos)
- **Cidade/Estado**: Validação cruzada (cidade coerente com UF)
- Painel organizado em abas: **Dados**, **Histórico**, **Vínculos**
- Ações: criar, editar, duplicar, arquivar, excluir

---

## 6. Agenda e Demandas

- Demandas/eventos criados do pipeline ou da Agenda, com vínculo obrigatório a lead
- Campo **Empresa** derivado do lead e persistido
- Agenda permite abrir lead correspondente por deep-link
- Cada demanda tem: tipo, responsável, prioridade, duração, status, resultado
- Ações: concluir, reagendar, trocar responsável, duplicar, excluir

---

## 7. Documentos

- **Tipos**: Contrato, Proposta, Briefing, Marketing, Financeiro
- Vínculo opcional a lead, cliente ou sem vínculo
- Busca por nome, tipo, vínculo com filtros e contador
- Menu de ações: baixar, compartilhar link, duplicar, renomear, excluir
- Ações condicionadas a permissão do cargo

---

## 8. Auditoria e Logs

Toda operação relevante gera log com data/hora, usuário e ação:
- Criação, edição, exclusão de leads
- Criação, edição, exclusão de clientes
- Criação, edição, exclusão de demandas/eventos
- Movimentação de etapa (com nome da empresa e etapa de destino)
- Vínculo de evento a lead

Consultável na aba de logs em **Configurações**.

---

## 9. Modelo de Dados

PostgreSQL gerenciado, schema público, RLS ativado.

### Tabelas Principais

#### `leads`
Negócios do CRM em ambos os pipelines.

```
id, empresa, produtor, cidade, estado, valor, responsavel,
temperatura, origem, stage, tags[], prioridade, perfil,
email, telefone, instagram, segmento, notas, is_commission_copy,
original_lead_id, created_at, updated_at
```

#### `activities`
Demandas e eventos vinculados a um lead.

```
id, lead_id → leads.id, type, titulo, descricao, start_time,
duration_min, status, resultado, resultado_obs, responsavel,
prioridade, empresa, created_at, updated_at
```

#### `finance_transactions`
Espelho financeiro do lead.

```
id, lead_id → leads.id, empresa, valor, comercial, data,
vencimento, comissao_pct, forma_pagamento, status,
comissao_paga, observacoes, created_at, updated_at
```

#### `profiles`
Perfil do usuário do sistema.

```
id (= usuário autenticado), nome, email, role_id → roles.id,
ativo, ultima_atividade, created_at, updated_at
```

#### `roles`
Cargos do sistema.

```
id, name, is_system, see_all_demands, created_at, updated_at
```

#### `role_permissions`
Permissões de cada cargo.

```
id, role_id → roles.id, resource, action
```

### Relacionamentos

```
roles 1 → N role_permissions
roles 1 → N profiles
leads 1 → N activities
leads 1 → N finance_transactions
leads 1 → 1 cópia de comissão (via original_lead_id)
```

---

## 10. Segurança de Dados (RLS)

Row Level Security habilitado em todas as tabelas. Políticas aplicam escopo do cargo no banco.

| Tabela | Leitura | Escrita |
|--------|---------|---------|
| **leads** | Todos para "ver todas"; caso contrário, apenas onde é responsável | Mesmo escopo de leitura |
| **activities** | Mesmo escopo de leads | Mesmo escopo de leads |
| **finance_transactions** | Mesmo escopo de leads | Mesmo escopo de leads |
| **profiles** | Diretório com campos limitados; dados sensíveis restritos | Próprio usuário + gestores |
| **roles / role_permissions** | Qualquer autenticado (para montar menu) | Somente CEO |

### Boas Práticas
- Funções auxiliares com escopo controlado
- Nenhuma política permissiva em tabelas de negócio
- E-mail e dados sensíveis não expostos no diretório público
- Nenhum cadastro anônimo: acesso exige convite/criação de usuário

---

## 11. Arquitetura Técnica

### Stack

| Camada | Tecnologia | Observações |
|--------|-----------|-----------|
| **Front-end** | React 19 + TanStack Start (Vite 7) | Rotas por arquivo; layout autenticado protege app |
| **Estilo** | Tailwind CSS v4 com tokens semânticos | Tema escuro, primária violeta, sem cores fixas |
| **Estado** | Zustand | Stores de app, sessão, permissões |
| **Dados** | React Query + client do backend | Hooks de consulta/mutação com sync real-time |
| **Backend** | PostgreSQL + Auth + Storage | Gerenciados na cloud |
| **Servidor** | Funções de servidor (RPC tipado) | Sessão, admin de usuários |

### Rotas Principais

```
/login
/ (redireciona para /dashboard)
/acesso-negado
/dashboard
/crm/comercial
/crm/operacional
/clientes
/agenda
/documentos
/relatorios
/equipe
/configuracoes
/perfil
/ajuda
```

### Fluxo de Autenticação

1. Login por e-mail e senha (opção de exibir senha)
2. Sessão persistida; usuário vai ao Dashboard
3. Layout autenticado carrega perfil e permissões
4. Tela renderizada conforme permissões
5. Sem permissão → redireciona para acesso negado
6. Tela de acesso negado permite sair e voltar ao login

---

## 12. Glossário

| Termo | Definição |
|-------|-----------|
| **Lead** | Oportunidade de negócio registrada no CRM |
| **Demanda** | Atividade ou evento vinculado a um lead |
| **Cópia de comissão** | Registro automático em Comissões a Pagar |
| **Taxas (%)** | Percentual aplicado sobre o valor do negócio |
| **Etapa (stage)** | Posição do lead em um dos pipelines |
| **RBAC** | Controle de acesso baseado em cargos |
| **RLS** | Segurança em nível de linha (filtro no banco) |
| **Ver todas as demandas** | Atributo do cargo que libera visão de todos |

---

**Documento Mestre — LUNA CRM v1.0**  
**Data**: 17 de Agosto de 2026  
**Status**: ✅ Especificação Completa e Pronta para Implementação
