# 🔧 Setup do Supabase para Meu Imóvel.PE

Este guia detalha como configurar o Supabase para o CRM.

## 1️⃣ Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta (gratuita)
3. Clique em "New Project"
4. Preencha:
   - **Name**: `meu-imovel-pe`
   - **Database Password**: Algo seguro (copie para referência)
   - **Region**: Escolha a mais próxima do seu usuário (ex: São Paulo)
5. Clique em "Create new project"

## 2️⃣ Executar as Migrations

1. Vá para **SQL Editor** no painel do Supabase
2. Clique em **New Query**
3. Copie o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Cole na query do Supabase
5. Clique em **Run**

Pronto! O banco de dados está criado com todas as tabelas necessárias.

## 3️⃣ Obter as Credenciais

1. Vá para **Settings** → **API**
2. Copie:
   - **Project URL** (copie para `VITE_SUPABASE_URL`)
   - **anon public** (copie para `VITE_SUPABASE_ANON_KEY`)

Exemplo:
```
VITE_SUPABASE_URL=https://abc123xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4️⃣ Configurar Autenticação

1. Vá para **Authentication** → **Providers**
2. Ative "Email" (já deve estar ativo por padrão)
3. Em **Email Auth**, ative "Confirm email" se quiser (opcional)

## 5️⃣ Verificar Segurança

1. Vá para **Database** → **Tables**
2. Selecione cada tabela (profiles, leads, lead_interactions, properties, appointments)
3. Verifique que **RLS** está **ativado** (mostrado como "🔒 Policy")
4. Se não estiver, ative em **RLS** → **Enable RLS**

## 6️⃣ Adicionar Primeiros Usuários (Optional)

Via painel do Supabase:
1. Vá para **Authentication** → **Users**
2. Clique em **Invite user**
3. Digite um email
4. Copie o link de convite
5. Crie uma senha

Ou use o login form da aplicação (signup).

## 7️⃣ Testes Rápidos

Você pode testar as APIs direto no SQL Editor do Supabase:

```sql
-- Listar todos os leads
SELECT * FROM leads;

-- Contar leads por status
SELECT status, COUNT(*) as total 
FROM leads 
GROUP BY status;

-- Ver primeiras 5 interações
SELECT * FROM lead_interactions LIMIT 5;
```

## 🚀 Próximos Passos

1. Configure as variáveis de ambiente nas aplicações (web, mobile, desktop)
2. Execute `npm install` em cada package
3. Inicie o servidor de desenvolvimento
4. Faça login e comece a usar!

## 📚 Referências

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
