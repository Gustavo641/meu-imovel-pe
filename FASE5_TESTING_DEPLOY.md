# FASE 5 - Testes e Deploy

## ✅ Testes Unitários & Integração

### RBAC (Role-Based Access Control)
- [ ] Matriz de permissões validada com `npm test -- rbac.test.ts`
- [ ] CEO tem acesso a todos os recursos
- [ ] OPERACIONAL acesso restrito a CRM_OPERACIONAL, Clientes, Agenda
- [ ] COMERCIAL acesso restrito a CRM_COMERCIAL, Clientes, Agenda
- [ ] Apenas CEO pode acessar Admin
- [ ] Apenas CEO pode exportar relatórios

### RLS (Row-Level Security)
- [ ] Validar que usuários NÃO podem ver dados de outros usuários
- [ ] Audit logs são somente leitura
- [ ] Foreign keys têm índices corretos
- [ ] Realtime habilitado em: clientes, demandas, agenda
- [ ] Realtime DESABILITADO em: audit_logs, role_permissions
- [ ] Políticas de delete funcionam corretamente

---

## 🧪 Testes Manuais

### Autenticação
- [ ] Login com email e senha funciona
- [ ] Logout funciona
- [ ] Recuperação de senha funciona
- [ ] Conta permanece autenticada após reload
- [ ] Session expira após inatividade (timeout)

### Dashboard
- [ ] Dashboard carrega sem erros
- [ ] Resumo de dados atualiza em tempo real
- [ ] Gráficos carregam corretamente
- [ ] Cards mostram números corretos

### Clientes (CRUD)
- [ ] Criar cliente com validações
- [ ] Listar clientes com paginação
- [ ] Editar cliente existente
- [ ] Arquivar cliente (soft delete)
- [ ] Deletar cliente permanentemente
- [ ] Filtros funcionam (cidade, estado, ativo)
- [ ] Histórico de clientes mostra versões anteriores

### Agenda/Demandas
- [ ] Criar demanda com tipo, prioridade, data
- [ ] Visualizar demanda no calendário
- [ ] Marcar demanda como concluída
- [ ] Editar demanda
- [ ] Deletar demanda
- [ ] Filtros por prioridade/status funcionam
- [ ] Lembretes aparecem para próximas demandas

### Documentos
- [ ] Upload de arquivo funciona
- [ ] Arquivo armazenado no Supabase Storage
- [ ] Listar documentos com tipo
- [ ] Download de documento funciona
- [ ] Deletar documento remove arquivo e metadata
- [ ] Validação de tipo de arquivo funciona

### Admin
- [ ] **Usuários**: Listar, criar, editar, desativar/ativar
- [ ] **Permissões**: Matriz mostra estado correto
- [ ] **Auditoria**: Logs aparecem com filtros funcionando
- [ ] Expandir log mostra dados antes/depois
- [ ] Apenas CEO pode acessar Admin

### Permissões
- [ ] CEO vê todos os menus
- [ ] OPERACIONAL não vê menu CRM_COMERCIAL
- [ ] COMERCIAL não vê menu CRM_OPERACIONAL
- [ ] Ninguém (exceto CEO) vê menu Admin
- [ ] Botões Edit/Delete aparecem apenas se tem permissão

### Responsividade
- [ ] Layout mobile (375px) funciona
- [ ] Layout tablet (768px) funciona
- [ ] Layout desktop (1280px) funciona
- [ ] Menu sidebar responsivo
- [ ] Tabelas scrollam horizontalmente se necessário

### Dark Mode
- [ ] Toggle dark mode funciona
- [ ] Cores ajustam corretamente
- [ ] Contraste atende WCAG AA

---

## 🔒 Testes de Segurança

### Validação de Entrada
- [ ] Telefone aceita apenas (XX) 9XXXX-XXXX
- [ ] Email validado corretamente
- [ ] Campos obrigatórios marcados como required
- [ ] SQL injection impossível (usando Supabase)
- [ ] XSS impossível (React sanitiza por padrão)

### Autenticação
- [ ] Tokens armazenados seguramente (HttpOnly cookies)
- [ ] CSRF protection ativo
- [ ] Rate limiting no login (máx 5 tentativas)
- [ ] Senha resetada requer confirmação via email

### Autorização
- [ ] Usuários não podem acessar recursos sem permissão
- [ ] Query parameters não contêm dados sensíveis
- [ ] API calls validam permissão no backend (RLS)
- [ ] Audit logs registram todas as mudanças

### Conformidade
- [ ] LGPD: Dados pessoais não são expostos
- [ ] Notificação de cookies/privacidade presente
- [ ] Direito ao esquecimento implementável
- [ ] Exportação de dados funciona

---

## 📊 Performance

### Carregamento
- [ ] Página inicial carrega < 3s
- [ ] Dashboard carrega < 2s
- [ ] Lista de clientes carrega < 2s (paginada)
- [ ] Bundled JS < 250KB (gzipped)

### Runtime
- [ ] Sem memory leaks (verificar DevTools Memory)
- [ ] Scroll suave (60fps)
- [ ] Transições fluidas
- [ ] React Query cache funciona (evita requisições duplicadas)

### Banco de Dados
- [ ] Queries otimizadas (sem N+1)
- [ ] Índices criados nas colunas filtradas
- [ ] Sem queries lentas (> 500ms)

---

## 🚀 Checklist de Deploy

### Antes de Fazer Deploy

#### Código
- [ ] Não há `console.log()` em produção
- [ ] Não há comentários de debug
- [ ] Não há arquivos `.test.ts` ou `.spec.ts` compilados
- [ ] Não há variáveis de ambiente hardcoded
- [ ] Build sem erros: `npm run build`
- [ ] Sem TypeScript errors: `npm run type-check`

#### Git
- [ ] Todos os commits estão com mensagens descritivas
- [ ] Nenhuma branch deletada acidentalmente
- [ ] README.md atualizado com instruções de setup
- [ ] .gitignore contém todos os arquivos sensíveis

#### Supabase
- [ ] Todas as migrations rodaram: `npm run db:migrate`
- [ ] RLS policies aplicadas e testadas
- [ ] Realtime subscriptions configuradas
- [ ] Storage buckets criados (se usar)
- [ ] Backups automáticos ativados
- [ ] Edge functions deployadas (se usar)

#### Variáveis de Ambiente
- [ ] `.env.example` criado com todas as vars
- [ ] `.env` local configurado com valores corretos
- [ ] `.env.production` configurado no Vercel
- [ ] Nenhuma chave secreta no repo

#### Documentação
- [ ] README.md inclui:
  - [ ] Descrição do projeto
  - [ ] Stack técnico
  - [ ] Instruções de setup local
  - [ ] Instruções de deploy
  - [ ] Variáveis de ambiente
  - [ ] Como rodar testes
- [ ] CONTRIBUTING.md definindo padrões

### Deploy para Staging

```bash
# 1. Build local
npm run build

# 2. Preview local (simular produção)
npm run preview

# 3. Deploy para staging no Vercel
vercel --prod --scope=seu-usuario
```

### Deploy para Produção

```bash
# 1. Fazer merge em main via PR (não force-push)
git push origin main

# 2. Vercel faz deploy automático
# 3. Verificar health check em produção
# 4. Monitorar logs por erros

# URLs
Web: https://luna-crm.vercel.app
Supabase: https://console.supabase.com
```

### Pós-Deploy

- [ ] Acessar app em produção sem erros
- [ ] Login funciona com usuários reais
- [ ] Dashboard carrega dados corretamente
- [ ] Criar/editar dados funciona end-to-end
- [ ] Audit logs registram atividades
- [ ] Monitorar Vercel analytics/logs por 24h

---

## 📋 Tarefas Finais

### Documentação
- [ ] Guia do usuário (como usar LUNA CRM)
- [ ] Guia do administrador (gestão de permissões)
- [ ] Troubleshooting common issues
- [ ] API documentation (se houver)

### Monitoring
- [ ] Sentry ou similar para error tracking
- [ ] Google Analytics ou Vercel Analytics
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring (Vercel Web Analytics)

### Feedback & Iteração
- [ ] Email para reportar bugs
- [ ] Formulário de feedback in-app
- [ ] Analytics de features mais usadas
- [ ] Roadmap para próximas features

---

## 🎯 Critérios de Sucesso

✅ Todos os testes passam
✅ Deploy automático funciona
✅ 99.9% uptime em 24h
✅ Sem erros críticos em logs
✅ Performance dentro dos SLAs
✅ Usuários conseguem fazer login e usar CRM
✅ Dados persistem corretamente
✅ Audit logs funcionando

---

## 📞 Contato & Suporte

**Erro durante deploy?**
1. Verificar logs no Vercel: https://vercel.com/dashboard
2. Verificar logs do Supabase: https://console.supabase.com
3. Rollback: `git revert <commit>` e `git push`

**Dúvidas técnicas?**
- Email: support@lunacrm.app
- GitHub Issues: https://github.com/seu-usuario/meu-imovel-pe

---

**Último update**: 2026-08-18
**Status**: Pronto para testes finais
