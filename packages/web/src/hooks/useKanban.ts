import { useUpdateLead } from './useLeads';
import type { Lead, LeadStatus } from '@meu-imovel-pe/shared';

export function useKanban() {
  const updateLead = useUpdateLead();

  const moveLead = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLead.mutateAsync({
        id: leadId,
        status: newStatus,
      });
    } catch (error) {
      // Erro ao mover lead
      throw error;
    }
  };

  const getLeadsByStatus = (leads: Lead[], status: LeadStatus) => {
    return leads.filter((lead) => lead.status === status);
  };

  return {
    moveLead,
    getLeadsByStatus,
    isMoving: updateLead.isPending,
  };
}
