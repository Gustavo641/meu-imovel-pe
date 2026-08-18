// Tipos de origem de lead
export type LeadOrigin = 'instagram' | 'facebook' | 'olx' | 'viva_real' | 'whatsapp' | 'indicacao' | 'site' | 'portal';

// Status do atendimento
export type LeadStatus =
  | 'novo_lead'
  | 'primeiro_contato'
  | 'qualificado'
  | 'em_atendimento'
  | 'visita_agendada'
  | 'proposta'
  | 'negociacao'
  | 'venda_concluida'
  | 'perdido';

// Faixa de investimento
export type InvestmentRange =
  | 'ate_100k'
  | '100k_200k'
  | '200k_500k'
  | '500k_1m'
  | 'acima_1m';

// Tipo de imóvel
export type PropertyType = 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'lote' | 'outro';

// Tipo de interação
export type InteractionType = 'ligacao' | 'whatsapp' | 'email' | 'visita' | 'proposta' | 'nota';

// Status de agendamento
export type AppointmentStatus = 'agendada' | 'confirmada' | 'realizada' | 'cancelada';

// Usuário/Perfil
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

// Lead
export interface Lead {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  phone?: string;
  origin?: LeadOrigin;
  status?: LeadStatus;
  investment_range?: InvestmentRange;
  family_income?: string;
  city?: string;
  neighborhood?: string;
  property_type?: PropertyType;
  notes?: string;
  // Propriedades adicionais do sistema
  empresa?: string;
  responsavel?: string;
  created_by?: string;
  stage?: string;
  valor?: number;
  temperatura?: 'quente' | 'morno' | 'frio' | 'fechado';
  is_commission_copy?: boolean;
  original_lead_id?: string;
  tags?: string[];
  prioridade?: 'urgente' | 'alta' | 'media' | 'baixa';
  created_at: string;
  updated_at: string;
}

// Interação com o lead
export interface LeadInteraction {
  id: string;
  lead_id: string;
  type: InteractionType;
  notes: string;
  created_by: string;
  created_at: string;
}

// Imóvel
export interface Property {
  id: string;
  user_id: string;
  title: string;
  address?: string;
  city?: string;
  price?: number;
  type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

// Agendamento/Visita
export interface Appointment {
  id: string;
  lead_id: string;
  property_id?: string;
  user_id: string;
  scheduled_date: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Dashboard stats
export interface DashboardStats {
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  in_progress_leads: number;
  closed_deals: number;
  scheduled_appointments: number;
}
