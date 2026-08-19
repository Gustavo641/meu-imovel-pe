# 🔗 Como Mudar a URL do Vercel

**URL Atual**: https://luna-crm.vercel.app  
**Objetivo**: Mudar para algo como https://crmdocorretor.vercel.app

---

## 🎯 Opções de URL Sugeridas

### Opção 1: "crmdocorretor" (Recomendada)
```
https://crmdocorretor.vercel.app
```
✅ Simples e direto  
✅ Fácil de lembrar  
✅ Reflete o nome da aplicação  

### Opção 2: "corretor-crm"
```
https://corretor-crm.vercel.app
```

### Opção 3: "meu-imovel-pe"
```
https://meu-imovel-pe.vercel.app
```

### Opção 4: "app-corretor"
```
https://app-corretor.vercel.app
```

### Opção 5: Domínio personalizado
```
https://seudominio.com.br
```
(Requer domínio próprio)

---

## 📋 Passo-a-Passo para Mudar no Vercel

### **PASSO 1: Acesse o Vercel Dashboard**

1. Abra: https://vercel.com/dashboard
2. Faça login com sua conta
3. Procure o projeto "meu-imovel-pe" ou "luna-crm"

---

### **PASSO 2: Acesse as Configurações**

1. Clique no projeto "luna-crm"
2. Vá para **Settings** (Configurações)
3. Procure por **"Domains"** ou **"Project Name"**

---

### **PASSO 3: Mude o Domínio**

#### Opção A: Mudar Nome do Projeto (Mais Fácil)

1. Em Settings → General
2. Procure **"Project Name"**
3. Mude de "luna-crm" para "crmdocorretor"
4. Clique em "Save"
5. Aguarde alguns segundos
6. **Pronto!** A URL muda automaticamente

#### Opção B: Adicionar Domínio Personalizado (Mais Avançado)

1. Em Settings → Domains
2. Clique em "Add Domain"
3. Digite seu domínio customizado
4. Siga as instruções de configuração DNS
5. Aguarde 24-48h para propagação

---

## 📸 Capturas de Tela (Guia Visual)

### Tela 1: Vercel Dashboard
```
https://vercel.com/dashboard
↓
Clique no projeto "luna-crm"
↓
Veja a página do projeto
```

### Tela 2: Settings
```
No topo da página, clique em:
[Settings] ou [Configurações]
```

### Tela 3: Project Name
```
Procure por "Project Name"
Atual: luna-crm
Novo: crmdocorretor
↓
Clique em "Save"
```

---

## ⚡ Depois de Mudar

### URLs Antigas vs Novas

| Antes | Depois |
|-------|--------|
| https://luna-crm.vercel.app | https://crmdocorretor.vercel.app |

### ⚠️ Importante
- A URL antiga **pode demorar até 1 dia para expirar**
- A URL nova fica disponível **imediatamente**
- Recomendação: use a **URL nova** daqui em diante

---

## 🔄 Se Algo Der Errado

### Problema: Mudança não aparece

**Solução**:
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Recarregue a página (Ctrl+R)
3. Aguarde 5-10 minutos
4. Tente novamente

### Problema: Projeto não encontrado

**Solução**:
1. Faça logout do Vercel
2. Faça login novamente
3. Procure pelo projeto correto
4. Se não achar, crie um novo deploy

---

## 📝 Alternativa: Criar um Arquivo de Configuração

Se preferir, pode criar um arquivo `vercel.json` no projeto:

```json
{
  "name": "crmdocorretor",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ]
}
```

Depois faça:
```bash
git add vercel.json
git commit -m "docs: adicionar nome do projeto no vercel.json"
git push origin main
```

---

## 🌐 Opção: Domínio Personalizado

Se quiser um domínio mais profissional:

### Exemplo com seu próprio domínio:
```
https://www.seusite.com.br
https://crm.seusite.com.br
https://app.seusite.com.br
```

### Como configurar:

1. **Compre um domínio** (GoDaddy, Namecheap, etc)
2. **No Vercel**: Settings → Domains → Add Domain
3. **Digite seu domínio**
4. **Configure DNS** conforme instruções do Vercel
5. **Aguarde 24-48h** para propagação

---

## ✅ Resumo Rápido

| Tarefa | Tempo | Dificuldade |
|--------|-------|------------|
| Mudar nome do projeto | 2 min | Fácil ✅ |
| Adicionar domínio personalizado | 10 min | Médio ⚠️ |
| Comprar + configurar domínio | 1 dia | Difícil 🔴 |

---

## 🎯 Recomendação Final

**Para você**, recomendo:

### ✅ OPÇÃO 1: Mudar para "crmdocorretor" (Recomendado)
```
https://crmdocorretor.vercel.app
← Fácil, rápido, profissional
```

**Passo a Passo Resumido**:
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto "luna-crm"
3. Vá em Settings → General
4. Mude "Project Name" de "luna-crm" para "crmdocorretor"
5. Clique em "Save"
6. Aguarde 1 minuto
7. **Pronto!** Nova URL: https://crmdocorretor.vercel.app

---

## 🔗 Links Úteis

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Documentação Vercel**: https://vercel.com/docs
- **Suporte Vercel**: https://vercel.com/help

---

## 📞 Se Precisar de Ajuda

Se encontrar problemas:

1. ✅ Verifique este guia novamente
2. ✅ Consulte a documentação do Vercel
3. ✅ Crie uma issue no GitHub
4. ✅ Entre em contato via email

---

## 🎉 Quando Conseguir

Após mudar a URL, atualize:

1. **Documentação**:
   - Atualizar COMO_ACESSAR.md
   - Atualizar DEPLOYMENT.md
   - Atualizar todos os guias

2. **Commit git**:
   ```bash
   git add -A
   git commit -m "docs: atualizar URL para crmdocorretor.vercel.app"
   git push origin main
   ```

3. **Compartilhar**:
   - Avise seus usuários
   - Atualize links nos documentos
   - Compartilhe a nova URL

---

**Sucesso!** 🚀

A mudança é simples e rápida. Qualquer dúvida, consulte este guia novamente!
