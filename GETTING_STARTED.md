# 🚀 Guia de Início Rápido - Meu Imóvel.PE

Bem-vindo ao seu CRM imobiliário profissional! Este guia vai te ajudar a começar em poucos minutos.

## ✅ Pre-requisitos

Você precisa ter instalado:
- [Node.js 18+](https://nodejs.org)
- [Git](https://git-scm.com)

Verifique com:
```bash
node --version
npm --version
```

## 🔧 Passo 1: Configurar Supabase

### 1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha: `meu-imovel-pe` como nome
4. Copie o **Database Password** (você vai precisar)
5. Clique em "Create new project" e espere

### 2. Executar Migrations
1. Vá para **SQL Editor** do seu projeto Supabase
2. Clique em **New Query**
3. Abra o arquivo `supabase/migrations/001_initial_schema.sql` (no seu projeto)
4. Copie TODO o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **Run**

### 3. Copiar Credenciais
1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL** 
   - **anon public key**

## 💻 Passo 2: Configurar Ambiente Local

### 1. Instalar Dependências
```bash
cd meu-imovel-pe
npm install
```

Isso vai instalar todas as dependências do monorepo.

### 2. Configurar Variáveis de Ambiente

Na pasta `packages/web`, crie um arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

**Não compartilhe estas credenciais!**

## 🎯 Passo 3: Executar a Aplicação Web

```bash
cd packages/web
npm run dev
```

A aplicação abrirá automaticamente em `http://localhost:3000`

## 📝 Primeiro Acesso

### 1. Criar Conta
1. Na tela de login, você pode se registrar com email e senha
2. Ou, no Supabase, vá para **Authentication** → **Users** e adicione um usuário

### 2. Primeira Ação: Criar um Lead
1. Clique em **Gestão de Leads**
2. Clique em **Novo Lead**
3. Preencha os campos:
   - **Nome** (obrigatório)
   - **Email** (opcional)
   - **Telefone** (opcional)
   - **Origem** (selecione uma)
   - **Cidade** (opcional)
   - **Tipo de Imóvel** (opcional)
4. Clique em **Criar Lead**

### 3. Ver Dashboard
1. Clique em **Dashboard**
2. Veja as estatísticas dos seus leads
3. Veja o funil de vendas

### 4. Agendar Visita
1. Clique em **Agenda**
2. O calendário mostra suas visitas agendadas
3. Próximas funcionalidades: agendar visita direto do calendário

## 📱 Passo 4: Executar no Mobile (Opcional)

```bash
cd packages/mobile
npm start
```

Escanear QR code com Expo Go (disponível na App Store e Google Play)

## 🖥 Passo 5: Executar no Desktop (Opcional)

```bash
cd packages/desktop
npm run dev
```

## 🎨 Identidade Visual

A aplicação usa a paleta de cores profissional definida:
- **Azul Profissional** (#0284C7) - Marca
- **Laranja Coral** (#F97316) - CTAs (botões de ação)
- **Verde Confiança** (#10B981) - Status de sucesso
- **Cinza Claro** (#F4F6F9) - Fundos

## 🔑 Funcionalidades Disponíveis no MVP

- ✅ Autenticação (login/signup)
- ✅ Dashboard com estatísticas
- ✅ Criar, editar, deletar leads
- ✅ Filtrar leads por status
- ✅ Adicionar notas/histórico
- ✅ Visualizar agenda de visitas
- ✅ Calendário mensal
- ⏳ Funil Kanban (próxima versão)
- ⏳ WhatsApp Integration (próxima versão)
- ⏳ Google Maps Integration (próxima versão)

## 🐛 Troubleshooting

### Erro: "Missing Supabase configuration"
- Verifique se o arquivo `.env.local` existe em `packages/web`
- Verifique se as variáveis estão corretas

### Erro: "Connection refused"
- Verifique se o Supabase está rodando
- Confirme que o `VITE_SUPABASE_URL` está correto

### Banco de dados vazio
- Execute novamente o SQL do arquivo `supabase/migrations/001_initial_schema.sql`

## 📚 Documentação

- [README.md](./README.md) - Visão geral do projeto
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Configuração detalhada
- [Plano do Projeto](/.claude/plans/) - Arquitetura e decisões técnicas

## 🚀 Próximas Funcionalidades

Depois de testar o MVP, você pode:
1. Integrar WhatsApp Business
2. Adicionar Google Maps
3. Criar o Funil Kanban interativo
4. Adicionar relatórios
5. Implementar automações

## 💬 Dúvidas?

Consulte a documentação ou entre em contato com o time de desenvolvimento.

---

**Pronto para começar? Execute:**

```bash
cd meu-imovel-pe
npm install
cd packages/web
npm run dev
```

Boa sorte! 🎉
