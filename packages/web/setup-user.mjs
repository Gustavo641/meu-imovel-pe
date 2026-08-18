import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://zikikxrqbqhmdppbbrsp.supabase.co',
  'sb_publishable_gqwTE_Ggl3tlxhaw8-W2Jg_OUVCY8Nt'
);

async function setup() {
  console.log('🔧 Configurando usuário demo@meuimovel.pe como CEO...');
  
  // 1. Get CEO role
  const { data: ceoRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'CEO')
    .single();

  if (roleError || !ceoRole) {
    console.log('❌ CEO role não encontrado:', roleError);
    return;
  }

  console.log('✅ CEO role encontrado:', ceoRole.id);

  // 2. Find profile by email
  const { data: existingProfile, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'demo@meuimovel.pe')
    .single();

  if (existingProfile) {
    // Update role
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role_id: ceoRole.id })
      .eq('id', existingProfile.id);

    if (updateError) {
      console.log('❌ Erro ao atualizar:', updateError.message);
    } else {
      console.log('✅ Perfil atualizado como CEO!');
    }
  } else {
    console.log('⚠️ Perfil não encontrado. Erro:', findError?.message);
    console.log('ℹ️ Você precisa fazer login primeiro para criar o perfil.');
  }
}

setup().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
