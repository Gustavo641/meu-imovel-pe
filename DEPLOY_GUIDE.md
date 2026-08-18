# LUNA CRM - Guia de Deploy

## 🚀 Deploy para Vercel

### Pré-requisitos

```bash
# 1. Node.js 18+
node --version

# 2. Conta no Vercel
# https://vercel.com/signup

# 3. CLI do Vercel
npm install -g vercel

# 4. Repositório no GitHub
# https://github.com/new
```

### Setup Inicial

#### 1. Conectar Repositório GitHub

```bash
# Login no Vercel
vercel login

# Link seu projeto
cd meu-imovel-pe
vercel link
```

#### 2. Configurar Variáveis de Ambiente

No dashboard do Vercel ([vercel.com/dashboard](https://vercel.com/dashboard)):

1. Selecione seu projeto
2. Vá para **Settings → Environment Variables**
3. Adicione as seguintes variáveis:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Analytics (opcional)
VITE_GA_ID=G-XXXXXXXXXX

# API
VITE_API_URL=https://api.lunacrm.app
```

**Onde encontrar essas chaves?**

- Supabase: https://console.supabase.com → Project Settings → API
- Google Analytics: https://analytics.google.com → Admin → Property Settings

#### 3. Configurar Build

Vercel detecta automaticamente que é um projeto React + Vite:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Se precisar customizar, edite `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "packages/web/dist",
  "monorepo": true
}
```

### Deployment

#### Opção 1: Deploy via CLI (Recomendado para testes)

```bash
# Deploy para staging (preview)
vercel --prod

# Ou deploy automático após git push
# (já configurado se você linkou o GitHub)
```

#### Opção 2: Deploy Automático (Production)

1. Faça push para `main`:
   ```bash
   git add .
   git commit -m "feat: feature name"
   git push origin main
   ```

2. Vercel faz deploy automaticamente
3. Acesse seu app: `https://seu-projeto.vercel.app`

#### Opção 3: Deploy Manual via Dashboard

1. Vá para [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Clique em **Redeploy**
4. Escolha a branch: `main`

### Verificação Pós-Deploy

```bash
# 1. Testar se site está online
curl https://seu-projeto.vercel.app

# 2. Verificar status de deployment
vercel status

# 3. Ver logs
vercel logs seu-projeto
```

### Monitoramento

#### Vercel Dashboard

- Analytics: https://vercel.com/dashboard/project/seu-projeto/analytics
- Logs: https://vercel.com/dashboard/project/seu-projeto/logs
- Deployments: https://vercel.com/dashboard/project/seu-projeto/deployments

#### Healthcheck Personalizado

Adicione um endpoint de health check em seu app:

```typescript
// packages/web/src/pages/Health.tsx
export function Health() {
  return <div>{"status": "ok"}</div>;
}
```

Deploy monitora: `https://seu-projeto.vercel.app/health`

### Rollback (Se algo der errado)

#### Opção 1: Revert no Vercel Dashboard

1. Vá para **Deployments**
2. Clique no deployment anterior
3. Clique em **Rollback**

#### Opção 2: Via Git

```bash
# Ver commits recentes
git log --oneline | head -5

# Revert do commit problemático
git revert abc1234
git push origin main

# Vercel faz novo deploy automaticamente
```

### Variáveis de Ambiente

#### Development Local

Crie `.env.local`:

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

#### Staging (Preview)

Vercel cria automaticamente Preview URLs para PRs:
- `https://seu-projeto-git-feature-name-seu-usuario.vercel.app`

#### Production

Variáveis em **Settings → Environment Variables** no dashboard.

### Troubleshooting

#### Deploy falhou: "Build failed"

```bash
# 1. Verificar build local
npm run build

# 2. Ver logs detalhados
vercel logs seu-projeto --follow

# 3. Verificar variáveis de ambiente
vercel env ls
```

#### App carrega mas mostra erro

```bash
# 1. Verificar console do navegador (F12)
# 2. Verificar Vercel logs
vercel logs seu-projeto

# 3. Verificar Supabase logs
# https://console.supabase.com → Logs
```

#### Performance lenta

```bash
# 1. Verificar Web Vitals
# Dashboard Vercel → Analytics

# 2. Verificar bundle size
npm run build && npm run analyze

# 3. Otimizar imagens (usar next/image ou similar)
```

### Otimizações para Produção

#### 1. Comprimir Assets

Vercel faz isso automaticamente, mas você pode verificar:

```bash
npm run build
ls -lh dist/
```

#### 2. Cache

Adicione headers de cache em `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/dist/static/js/:file*",
      "headers": [
        {
          "key": "cache-control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 3. Monitoramento

Configure Sentry para error tracking:

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://xxx@xxx.ingest.sentry.io/123',
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

### URLs Importantes

| Serviço | URL |
|---------|-----|
| App Web | https://seu-projeto.vercel.app |
| Vercel Dashboard | https://vercel.com/dashboard |
| GitHub Repo | https://github.com/seu-usuario/meu-imovel-pe |
| Supabase Console | https://console.supabase.com |
| Sentry (opcional) | https://sentry.io/organizations/ |

### Proximos Passos

1. ✅ Setup no Vercel
2. ✅ Configurar variáveis de ambiente
3. ✅ Deploy automático via GitHub
4. ✅ Configurar custom domain (opcional)
5. ✅ Setup SSL/HTTPS (automático no Vercel)
6. ✅ Configurar monitoring

---

**Última atualização**: 2026-08-18
**Status**: Pronto para production
