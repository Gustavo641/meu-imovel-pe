import { useLeads } from './useLeads';
import type { Lead } from '@meu-imovel-pe/shared';

export interface LeadStats {
  totalLeads: number;
  activeLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  closedDeals: number;
  conversionRate: number;
  prospectionByChannel: Record<string, number>;
  conversionByStage: Record<string, { total: number; converted: number }>;
  monthlyRevenue: number;
}

const ACTIVE_STAGES = ['primeiro_contato', 'reuniao', 'novo_evento', 'proposta'];
const CONVERSION_STAGES = ['primeiro_contato', 'reuniao', 'novo_evento', 'proposta', 'entrada_operacional'];

export function useLeadStats(): LeadStats | null {
  const { data: leads = [] } = useLeads();

  if (!leads || leads.length === 0) {
    return null;
  }

  // Filtrar apenas leads, não cópias de comissão
  const realLeads = leads.filter((l) => !l.is_commission_copy);

  // Calcula temperatura baseado em status e data
  const getTemperature = (lead: Lead) => {
    if (lead.status === 'venda_concluida' || lead.stage === 'comissoes_pagas') return 'fechado';
    if (['negociacao', 'proposta', 'entrada_operacional'].includes(lead.stage)) return 'quente';
    if (['em_atendimento', 'visita_agendada', 'reuniao', 'novo_evento'].includes(lead.stage)) return 'morno';
    const daysOld = Math.floor((new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    return daysOld > 30 ? 'frio' : 'morno';
  };

  // Total de leads
  const totalLeads = realLeads.length;

  // Leads ativos (etapas 2-3 conforme spec)
  const activeLeads = realLeads.filter((l) => ACTIVE_STAGES.includes(l.stage)).length;

  // Por temperatura
  const hotLeads = realLeads.filter((l) => getTemperature(l) === 'quente').length;
  const warmLeads = realLeads.filter((l) => getTemperature(l) === 'morno').length;
  const coldLeads = realLeads.filter((l) => getTemperature(l) === 'frio').length;
  const closedDeals = realLeads.filter((l) => getTemperature(l) === 'fechado').length;

  // Taxa de conversão
  const conversionRate = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0;

  // Prospecção por canal
  const prospectionByChannel = realLeads.reduce((acc, lead) => {
    const channel = lead.origem || 'desconhecido';
    acc[channel] = (acc[channel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Assegurar 5 canais
  const channels = ['instagram', 'whatsapp', 'linkedin', 'indicacao', 'site'];
  channels.forEach((channel) => {
    if (!prospectionByChannel[channel]) {
      prospectionByChannel[channel] = 0;
    }
  });

  // Conversão por etapa
  const conversionByStage = CONVERSION_STAGES.reduce((acc, stage) => {
    const stageLeads = realLeads.filter((l) => l.stage === stage);
    const converted = stageLeads.filter((l) => getTemperature(l) === 'fechado').length;
    acc[stage] = {
      total: stageLeads.length,
      converted
    };
    return acc;
  }, {} as Record<string, { total: number; converted: number }>);

  // Receita mensal (apenas com valor)
  const monthlyRevenue = realLeads
    .filter((l) => l.valor && l.stage === 'comissoes_pagas')
    .reduce((sum, l) => sum + (l.valor || 0), 0);

  return {
    totalLeads,
    activeLeads,
    hotLeads,
    warmLeads,
    coldLeads,
    closedDeals,
    conversionRate,
    prospectionByChannel,
    conversionByStage,
    monthlyRevenue
  };
}
