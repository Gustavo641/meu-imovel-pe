# Meu Imóvel.PE - CRM Imobiliário

Um CRM profissional e moderno para corretores e consultores imobiliários, com suporte para web, mobile (React Native) e desktop (Electron).

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Mobile**: React Native + Expo
- **Desktop**: Electron + React
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: Zustand
- **API Client**: TanStack React Query
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Deployment**: Vercel (Web), Expo EAS (Mobile)

## 📋 MVP - Funcionalidades

### ✅ Fase 1: Autenticação
- [x] Estrutura de tipos
- [x] Configuração do Supabase
- [x] Schema do banco de dados
- [x] Hooks de autenticação
- [x] Formulário de login

### 📊 Fase 2: Dashboard
- [x] Componente de Dashboard
- [x] Estatísticas de leads
- [x] Visualização do funil de vendas
- [x] Listagem de leads recentes

### 👥 Fase 3: Gestão de Leads
- [x] Criar novo lead
- [x] Listar leads
- [x] Editar lead
- [x] Deletar lead
- [x] Filtrar por status e origem
- [x] Adicionar notas/interações

### 📅 Fase 4: Agenda
- [x] Visualizar calendário
- [x] Agendar visitas
- [x] Próximas visitas
- [x] Confirmação de visitas

### 🎯 Fase 5: Funil de Vendas (Próximo)
- [ ] View Kanban
- [ ] Drag-drop entre status
- [ ] Real-time sync

## 🛠 Setup Rápido

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase (gratuita)

### 1. Clonar e Instalar
```bash
cd meu-imovel-pe
npm install
# ou
yarn install
```

### 2. Configurar Supabase
1. Criar projeto em [supabase.com](https://supabase.com)
2. Executar migrations em `supabase/migrations/001_initial_schema.sql`
3. Copiar URL e Anon Key do projeto

### 3. Configurar Variáveis de Ambiente

#### Web (`packages/web/.env.local`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Mobile (`packages/mobile/.env`)
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### Desktop (`packages/desktop/.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Executar Aplicações

#### Web
```bash
cd packages/web
npm run dev
```
Acessar em `http://localhost:3000`

#### Mobile (Expo)
```bash
cd packages/mobile
npm start
```

#### Desktop (Electron)
```bash
cd packages/desktop
npm run dev
```

## 📱 Status das Plataformas

- ✅ **Web**: Funcionando com Vite + React
- 🔄 **Mobile**: Em desenvolvimento (Expo)
- 🔄 **Desktop**: Em desenvolvimento (Electron)

## 🗂 Estrutura do Projeto

```
meu-imovel-pe/
├── packages/
│   ├── shared/          # Tipos, constantes e utilidades compartilhadas
│   │   ├── types.ts     # TypeScript interfaces
│   │   └── constants.ts # Configurações e dados fixos
│   ├── web/             # Aplicação React (Vercel)
│   │   ├── src/
│   │   │   ├── pages/       # Dashboard, Leads, Calendar
│   │   │   ├── components/  # Componentes reutilizáveis
│   │   │   ├── hooks/       # Hooks customizados
│   │   │   ├── services/    # Integração com Supabase
│   │   │   └── styles/      # CSS global
│   │   └── index.html
│   ├── mobile/          # React Native (Expo)
│   └── desktop/         # Electron
├── supabase/
│   └── migrations/      # SQL migrations
└── README.md
```

## 🔐 Segurança

- Row Level Security (RLS) ativado no Supabase
- Autenticação via email/password
- Validação de dados no frontend e backend
- Variáveis de ambiente protegidas

## 📈 Roadmap

- [ ] WhatsApp Business Integration
- [ ] Google Maps Integration
- [ ] OpenAI Integration (descrições automáticas)
- [ ] Relatórios e Analytics
- [ ] Portal do Cliente
- [ ] Assinatura Digital (Clicksign/DocuSign)
- [ ] Mobile build nativo (iOS/Android)
- [ ] Desktop installer

## 💬 Suporte

Para dúvidas ou sugestões, entre em contato com o time de desenvolvimento.

## 📄 Licença

Privado - Todos os direitos reservados.
