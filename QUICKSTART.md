# Quick Start - Meu Imóvel.PE CRM

## 🚀 5 Minutos para Começar

### Passo 1: Iniciar o Servidor
```bash
cd packages/web
npm run dev
```

Acesse: http://localhost:3000

### Passo 2: Criar Usuário

**Via Interface (Recomendado)**
1. Clique em "Criar nova conta"
2. Preencha:
   - Nome: "Serafim Tester"
   - Email: seu-email@gmail.com (use um novo email)
   - Senha: MinimoSeis@123
3. Confirme no link enviado para o email
4. Volta ao login e entre com suas credenciais

**Via Supabase SQL (Alternativa)**
1. Abra: https://app.supabase.com → seu projeto
2. Vá para: Authentication → Users
3. Clique: "Create new user"
4. Preencha email/senha
5. Copie o UUID do usuário
6. Abra SQL Editor
7. Substitua `'test-user-uuid'` no arquivo `supabase/seed.sql` pelo UUID copiado
8. Execute o SQL
9. Volte ao login e entre com as credenciais

### Passo 3: Ver o Dashboard

Após fazer login, você verá:

```
┌─ Meu Imóvel.PE ──────────────────────────────────────────────┐
│                                                                │
│  📅 Dom, 17 de Agosto de 2026 • 14:32:45                     │
│                                                                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────┐ │
│  │   Total     │  │   Quentes    │  │   Mornos     │  │Fecha │
│  │    10       │  │    2         │  │    5         │  │ 1   │
│  │ Leads       │  │ Negociação   │  │ Contato      │  │ Vendas
│  └─────────────┘  └──────────────┘  └──────────────┘  └────┘
│                                                                │
│  Leads por Temperatura:                                       │
│  ┌─ 🔥 Quente          2 leads - Negociação ativa ────────┐  │
│  ├─ 🌤️ Morno           5 leads - Contato feito ─────────┤  │
│  ├─ ❄️ Frio            2 leads - Sem interação ─────────┤  │
│  └─ ✅ Fechado         1 leads - Negócio ganho ─────────┘  │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Funcionalidades Disponíveis

### Dashboard ✅
- **Live Clock**: Hora/data atualizando em tempo real
- **Stats Cards**: Resumo de leads por temperatura
- **Leads por Temperatura**: Agrupamento visual

### Leads Management ✅
- Listar todos os leads
- Criar novo lead
- Editar lead existente
- Deletar lead
- **Temperature Badge**: Indica se o lead é Quente/Morno/Frio/Fechado

### Funnel (Kanban) ✅
- View Kanban com 8 estágios
- Drag-and-drop para mover leads
- Contagem de leads por estágio
- Atualização automática

### Agenda ✅
- Visualizar calendário
- Agendar visitas
- Status de agendamentos

## 🎨 Design

**Dark Mode**: Ativado por padrão
- Background: Cinza escuro (#0F172A)
- Cards: Cinza (#1E293B)
- Texto: Branco/Cinza claro
- Cores customizadas para leads

## 📊 Lead Temperature System

```
🔥 Quente (Vermelho #F92240)
   └─ Status: Negociação ou Proposta
   └─ Ação: Acompanhamento urgente

🌤️ Morno (Amarelo #F9BD01)
   └─ Status: Em atendimento ou Visita agendada
   └─ Ação: Follow-up programado

❄️ Frio (Azul #00AEEE)
   └─ Sem contato há 30+ dias
   └─ Ação: Reativação de contato

✅ Fechado (Verde #00BE6A)
   └─ Status: Venda concluída
   └─ Ação: Acompanhamento pós-venda
```

## 🧪 Teste com Dados de Exemplo

Se tiver criado usuário via SQL, você já terá 7 leads de teste:
- 2 leads quentes (em negociação/proposta)
- 2 leads mornos (em atendimento/visita agendada)
- 2 leads frios (sem interação)
- 1 lead fechado (venda concluída)

## ⌨️ Navegação

| Menu | Funcionalidade |
|------|---|
| Dashboard | Resumo e estatísticas |
| Gestão de Leads | Lista e CRUD de leads |
| Funil de Vendas | Kanban board |
| Agenda | Calendário de visitas |

## 🔧 Troubleshooting

### Porta 3000 já está em uso
```bash
# Altere em packages/web/vite.config.ts
server: {
  port: 3001,  // ou outra porta
}
```

### Env variables não carregando
1. Verifique se `.env.local` existe em `packages/web/`
2. Reinicie o servidor Vite (`Ctrl+C` e `npm run dev` novamente)

### Leads não aparecem
1. Verifique se você criou leads no banco
2. Confirme que está logado com o usuário correto
3. Abra console (F12) e procure por erros

## 📱 Responsivo

Teste em diferentes tamanhos:
- Desktop: 1280x720 (recomendado)
- Tablet: 768x1024
- Mobile: 375x812

## 🎓 Próximas Etapas

1. **Adicionar mais leads**: Use a tela "Gestão de Leads"
2. **Gerenciar funil**: Vá para "Funil de Vendas" e faça drag-drop
3. **Agendar visitas**: Use "Agenda"
4. **Integrar WhatsApp**: Funcionalidade pronta para implementar
5. **Integrar Google Maps**: Funcionalidade pronta para implementar

---

**Pronto! Aproveita o seu novo CRM! 🎉**
