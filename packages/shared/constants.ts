// Cores da marca - Identidade Visual
export const COLORS = {
  // Paleta Principal (Recomendada para CRM Imobiliário)
  background: '#F4F6F9',        // Gelo/Cinza Claro
  text_primary: '#1E293B',      // Azul Escuro/Chumbo
  brand_primary: '#0284C7',     // Azul Profissional
  action_cta: '#F97316',        // Laranja Coral
  success: '#10B981',           // Verde Confiança

  // Paleta Alternativa (Violeta Evenyx)
  violet_primary: '#955BFE',
  violet_glow: '#AC79FF',
  blue_secondary: '#0087F8',
  accent: '#333551',
};

// Status de leads com cores
export const LEAD_STATUS_CONFIG = {
  novo_lead: { label: 'Novo Lead', color: '#3B82F6' },
  primeiro_contato: { label: 'Primeiro Contato', color: '#8B5CF6' },
  qualificado: { label: 'Qualificado', color: '#06B6D4' },
  em_atendimento: { label: 'Em Atendimento', color: '#F59E0B' },
  visita_agendada: { label: 'Visita Agendada', color: '#EC4899' },
  proposta: { label: 'Proposta', color: '#EF4444' },
  negociacao: { label: 'Negociação', color: '#8B5CF6' },
  venda_concluida: { label: 'Venda Concluída', color: '#10B981' },
  perdido: { label: 'Perdido', color: '#6B7280' },
};

// Origens de leads
export const LEAD_ORIGINS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  olx: 'OLX',
  viva_real: 'Viva Real',
  whatsapp: 'WhatsApp',
  indicacao: 'Indicação',
  site: 'Site',
  portal: 'Portal Imobiliário',
};

// Tipos de imóvel
export const PROPERTY_TYPES = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  terreno: 'Terreno',
  comercial: 'Comercial',
  lote: 'Lote',
  outro: 'Outro',
};

// Faixas de investimento
export const INVESTMENT_RANGES = {
  ate_100k: 'Até R$ 100 mil',
  '100k_200k': 'R$ 100 - 200 mil',
  '200k_500k': 'R$ 200 - 500 mil',
  '500k_1m': 'R$ 500 mil - 1 milhão',
  acima_1m: 'Acima de R$ 1 milhão',
};

// Tipos de interação
export const INTERACTION_TYPES = {
  ligacao: 'Ligação',
  whatsapp: 'WhatsApp',
  email: 'E-mail',
  visita: 'Visita',
  proposta: 'Proposta',
  nota: 'Nota',
};

// Configurações da aplicação
export const APP_CONFIG = {
  APP_NAME: 'Meu Imóvel.PE',
  APP_VERSION: '0.1.0',
  APP_DESCRIPTION: 'CRM Imobiliário Profissional',
};

// URLs e endpoints (será atualizado com variáveis de ambiente)
export const ENDPOINTS = {
  // Endpoints serão carregados via import.meta.env no serviço do Supabase
};
