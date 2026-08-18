# Setup Supabase - LUNA CRM

## 🚀 Próximos Passos Para Ativar o Sistema

### 1️⃣ Executar Migration no Supabase

Acesse: **https://app.supabase.com** → Seu Projeto → SQL Editor

**Cole este SQL e clique RUN:**

```sql
-- Copy all content from: supabase/migrations/002_luna_complete_schema.sql
```

**OU copie o arquivo completo em:**
`supabase/migrations/002_luna_complete_schema.sql`

---

### 2️⃣ Configurar Usuário Demo

Após a migration, execute este script SQL no Supabase:

```sql
-- Setup demo@meuimovel.pe como CEO
DO $$
DECLARE
  ceo_role_id UUID;
BEGIN
  -- Create CEO role if not exists
  INSERT INTO roles (name, is_system, see_all_demands)
  VALUES ('CEO', true, true)
  ON CONFLICT DO NOTHING;
  
  -- Get CEO role
  SELECT id INTO ceo_role_id FROM roles WHERE name = 'CEO';
  
  -- Update profile if exists
  UPDATE profiles 
  SET role_id = ceo_role_id
  WHERE email = 'demo@meuimovel.pe';
END $$;
```

---

### ✅ Pronto!

Após executar a migration, recarregue o LUNA CRM e você terá acesso total como CEO.

---

## 📋 Credenciais de Login

**Email**: `demo@meuimovel.pe`
**Senha**: (a que você criou)

---

## 🔗 Links Úteis

- Supabase Dashboard: https://app.supabase.com
- LUNA CRM Local: http://localhost:3000
- Documentação: `LUNA_DOCUMENTO_MESTRE.md`
- Plano: `PLANO_IMPLEMENTACAO.md`
