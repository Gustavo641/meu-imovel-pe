# 🚀 VERCEL DEPLOYMENT - GUIA RÁPIDO

## Step 1: Preparar Supabase

1. Acesse https://console.supabase.com
2. Selecione seu projeto
3. Vá para **Settings → API**
4. Copie:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`

## Step 2: Criar Conta Vercel

1. Acesse https://vercel.com/signup
2. Clique "Continue with GitHub"
3. Autorize Vercel no GitHub
4. Conclua o signup

## Step 3: Importar Projeto

1. Vá para https://vercel.com/dashboard
2. Clique "Add New..." → "Project"
3. Selecione "Import Git Repository"
4. Busque por `meu-imovel-pe` ou `Gustavo641/meu-imovel-pe`
5. Clique "Import"

## Step 4: Configurar Projeto

**Framework**: Vite (detecta automaticamente)  
**Build Command**: `npm run build`  
**Output Directory**: `packages/web/dist`  
**Root Directory**: `./` (não mude)

## Step 5: Adicionar Variáveis de Ambiente

No formulário "Environment Variables", adicione:

```
VITE_SUPABASE_URL = https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 6: Deploy

1. Clique "Deploy"
2. Aguarde ~5-10 minutos
3. Vercel mostrará link quando terminar

## Step 7: Verificar Deploy

```
✅ Production URL: https://seu-projeto.vercel.app
✅ Git integrado: próximos git push = deploy automático
✅ Logs: Vercel Dashboard → Deployments → Logs
```

## Troubleshooting

**Build failed?**
```
vercel logs --follow
```

**Deploy passou mas app não funciona?**
- Verificar variáveis de ambiente
- Verificar console do navegador (F12)
- Checar Supabase status

**Quer fazer rollback?**
- Dashboard → Deployments → Clique no anterior → Redeploy

---

## URLs Importantes

| Serviço | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Seu App | https://seu-projeto.vercel.app |
| Supabase | https://console.supabase.com |
| GitHub Repo | https://github.com/Gustavo641/meu-imovel-pe |

---

**Time**: 10-15 minutos total
**Difficulty**: ⭐ Easy
**Status**: Ready to deploy! 🚀
