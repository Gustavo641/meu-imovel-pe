# Dashboard Preview - Meu Imóvel.PE

## 🎨 Visual Completo do Dashboard (Opção 1 - Minimalista)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║                        🏢 Meu Imóvel.PE                                   ║
║                       CRM Imobiliário                                     ║
║                   [Logout] [Seu Email]                                    ║
║                                                                           ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                           ║
║  SIDEBAR                         │  📅 Dom, 17 de Agosto de 2026 • 14:32:45
║  ─────────────────────────────── │
║  🏠 Dashboard ← ATIVO             │  ┌───────────────┬──────────────┐
║  📋 Gestão de Leads              │  │   TOTAL       │  QUENTES     │
║  📊 Funil de Vendas              │  │   ───────     │  ────────    │
║  📅 Agenda                       │  │      10       │     2        │
║                                  │  │   Leads       │ Negociação   │
║                                  │  └───────────────┴──────────────┘
║                                  │  
║                                  │  ┌───────────────┬──────────────┐
║                                  │  │   MORNOS      │  FECHADOS    │
║                                  │  │   ────────    │  ─────────   │
║                                  │  │      5        │      1       │
║                                  │  │  Contato      │   Vendas     │
║                                  │  └───────────────┴──────────────┘
║                                  │
║                                  │  ╔═ Leads por Temperatura ══════════╗
║                                  │  ║                                  ║
║                                  │  ║  ┌─ 🔥 QUENTE                  ┐║
║                                  │  ║  │ 2 leads - Negociação ativa   ││
║                                  │  ║  └──────────────────────────────┘║
║                                  │  ║                                  ║
║                                  │  ║  ┌─ 🌤️ MORNO                   ┐║
║                                  │  ║  │ 5 leads - Contato feito      ││
║                                  │  ║  └──────────────────────────────┘║
║                                  │  ║                                  ║
║                                  │  ║  ┌─ ❄️ FRIO                     ┐║
║                                  │  ║  │ 2 leads - Sem interação      ││
║                                  │  ║  └──────────────────────────────┘║
║                                  │  ║                                  ║
║                                  │  ║  ┌─ ✅ FECHADO                  ┐║
║                                  │  ║  │ 1 leads - Negócio ganho      ││
║                                  │  ║  └──────────────────────────────┘║
║                                  │  ║                                  ║
║                                  │  ╚══════════════════════════════════╝
║                                  │
╚═══════════════════════════════════════════════════════════════════════════╝
```

## 📋 Lead Card Example

```
┌─ Gestão de Leads ────────────────────────────────────────────────────────┐
│                                                                           │
│  João Silva                        [Negociação]                          │
│  🔥 Quente                                                               │
│  ├─ Email: joao@email.com                                               │
│  ├─ Telefone: 85 98765-4321                                             │
│  ├─ Origem: Instagram | Cidade: Recife                                  │
│  └─ Notas: Cliente muito interessado em apartamento de 3 quartos        │
│                                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Maria Santos                      [Proposta]                            │
│  🔥 Quente                                                               │
│  ├─ Email: maria@email.com                                              │
│  ├─ Telefone: 85 91234-5678                                             │
│  ├─ Origem: Indicação | Cidade: Caruaru                                 │
│  └─ Notas: Proposta enviada em 15/08/2026                               │
│                                                                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Carlos Costa                      [Em Atendimento]                      │
│  🌤️ Morno                                                                │
│  ├─ Email: carlos@email.com                                             │
│  ├─ Telefone: 85 97654-3210                                             │
│  ├─ Origem: Facebook | Cidade: Pernambuco                               │
│  └─ Notas: Primeira conversa realizada                                  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

## 📊 Funil de Vendas (Kanban)

```
┌─ Novo Lead ────┬─ Primeiro Contato ┬─ Qualificado ───┬─ Em Atendimento ─┐
│                │                   │                 │                  │
│ João Silva     │ Pedro Mendes      │ Lucia Ferreira  │ Carlos Costa     │
│ [Lead Card]    │ [Lead Card]       │ [Lead Card]     │ [Lead Card]      │
│                │                   │                 │                  │
│ Count: 1       │ Count: 1          │ Count: 1        │ Count: 1         │
└────────────────┴───────────────────┴─────────────────┴──────────────────┘

┌─ Visita Agendada ┬─ Proposta ───────┬─ Negociação ──┬─ Venda Concluída┐
│                  │                  │               │                 │
│ Ana Oliveira     │ Maria Santos     │ João Silva    │ Roberto Alves   │
│ [Lead Card]      │ [Lead Card]      │ [Lead Card]   │ [Lead Card]     │
│                  │                  │               │                 │
│ Count: 1         │ Count: 1         │ Count: 1      │ Count: 1        │
└──────────────────┴──────────────────┴───────────────┴─────────────────┘

Drag-and-drop para mover leads entre estágios
```

## 🎨 Paleta de Cores em Ação

### Lead Quente 🔥
```
Status: Negociação ou Proposta
Cor: Vermelho #F92240
Ação: Acompanhamento urgente
```

### Lead Morno 🌤️
```
Status: Em atendimento ou Visita agendada
Cor: Amarelo #F9BD01
Ação: Follow-up programado
```

### Lead Frio ❄️
```
Status: Sem contato há 30+ dias
Cor: Azul #00AEEE
Ação: Reativação de contato
```

### Lead Fechado ✅
```
Status: Venda concluída
Cor: Verde #00BE6A
Ação: Acompanhamento pós-venda
```

## 📱 Responsividade

### Desktop (1280x720)
```
┌─ SIDEBAR ────┬─────── MAIN CONTENT ────────────────┐
│ Menu Items   │  DateTime, Stats, Temperature      │
│ (Fixed)      │  (Scrollable)                      │
└──────────────┴──────────────────────────────────────┘
```

### Tablet (768x1024)
```
┌─ SIDEBAR ────┬─────── MAIN CONTENT ────────────────┐
│ Collapse     │  DateTime, Stats, Temperature      │
│ (Drawer)     │  (Stacked vertically)              │
└──────────────┴──────────────────────────────────────┘
```

### Mobile (375x812)
```
┌──────────── TOP HEADER ──────────────┐
│ Menu (Hamburger) | Logo | Logout    │
├─────────────────────────────────────┤
│  DateTime                           │
│  Stats (Stacked)                    │
│  Temperature Breakdown (Full Width) │
│  Leads List (Scrollable)            │
└─────────────────────────────────────┘
```

## 🔄 Live Updates

### DateTime Component
```
Tempo 1: 14:32:45
Tempo 2: 14:32:46 ← Atualiza automaticamente a cada segundo
Tempo 3: 14:32:47
...
```

### Stats Cards
```
Quando um novo lead é criado:
Total: 9 → 10 (atualiza automaticamente)

Quando um lead muda de status para "negociacao":
Quentes: 1 → 2 (LeadTemperature recalcula)
```

## 💡 Interatividade

### Dashboard
- ✅ DateTime atualiza a cada segundo
- ✅ Stats mudam em tempo real ao adicionar/editar leads
- ✅ Temperature badges mudam cor conforme status

### Leads Page
- ✅ Clicar no lead (futura: abrir detalhes)
- ✅ Criar novo lead (botão + form)
- ✅ Editar lead (botão ✏️)
- ✅ Deletar lead (botão 🗑️)

### Funnel Page
- ✅ Drag-and-drop leads entre colunas
- ✅ Drop automático atualiza status
- ✅ Contagem atualiza em tempo real

### Calendar Page
- ✅ Ver próximas visitas
- ✅ Agendar nova visita
- ✅ Confirmar/cancelar visita

## 🎯 User Journey Completo

```
1. LOGIN
   └─→ Email + Senha
       └─→ Zustand carrega user
           └─→ Renderiza AppContent

2. DASHBOARD
   ├─→ Vê DateTime atualizando
   ├─→ Vê Stats com cores
   └─→ Vê Leads por Temperatura

3. GESTÃO DE LEADS
   ├─→ Clica "Novo Lead"
   ├─→ Preenche formulário
   ├─→ Lead criado com status "novo_lead" (Frio ou Morno)
   └─→ Aparece na lista

4. FUNIL DE VENDAS
   ├─→ Vê todas as colunas (8 estágios)
   ├─→ Arrasta lead de uma coluna para outra
   ├─→ Status do lead atualiza automaticamente
   ├─→ LeadTemperature muda de cor automaticamente
   └─→ Dashboard é atualizado em tempo real

5. AGENDA
   ├─→ Clica em lead
   ├─→ Clica "Agendar Visita"
   ├─→ Seleciona data/hora
   └─→ Aparece no calendário
```

## 🔐 Segurança & Privacidade

- Cada usuário só vê seus próprios leads (RLS)
- Sessão gerenciada pelo Supabase Auth
- Dados criptografados em trânsito (HTTPS)
- Tokens armazenados de forma segura

---

**O dashboard está pronto para uso! Comece criando seus primeiros leads.** 🚀
