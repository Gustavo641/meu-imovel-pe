import { useState } from 'react';
import { useLeads, useUpdateLead } from '../hooks/useLeads';
import type { Lead, LeadStatus } from '@meu-imovel-pe/shared';
import { LEAD_STATUS_CONFIG } from '@meu-imovel-pe/shared';

const STAGES: LeadStatus[] = ['novo_lead', 'qualificado', 'em_atendimento', 'venda_concluida'];

const STAGE_COLORS: Record<LeadStatus, string> = {
  novo_lead: '#EF4444',
  qualificado: '#F59E0B',
  em_atendimento: '#3B82F6',
  venda_concluida: '#10B981',
};

interface KanbanProps {
  onSelectLead?: (leadId: string) => void;
}

export function Kanban({ onSelectLead }: KanbanProps) {
  const { data: leads = [] } = useLeads();
  const updateLead = useUpdateLead();
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnStage = async (toStage: LeadStatus) => {
    if (!draggedLead) return;
    if (draggedLead.status === toStage) return;

    try {
      setIsLoading(true);
      await updateLead.mutateAsync({
        id: draggedLead.id,
        status: toStage,
      });
      setDraggedLead(null);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
          🎯 Funil de Vendas
        </h1>
        <p className="text-muted-foreground mt-2">Arraste os leads entre os estágios</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage);
          return (
            <div
              key={stage}
              className="flex-shrink-0 w-96 bg-surface rounded-xl border border-border flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-border bg-card/50">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[stage] }}
                  />
                  <div className="flex-1">
                    <h2 className="font-display font-bold text-foreground">
                      {LEAD_STATUS_CONFIG[stage]?.label || stage}
                    </h2>
                    <p className="text-xs text-muted-foreground">{stageLeads.length} leads</p>
                  </div>
                </div>
              </div>

              {/* Cards Container */}
              <div
                className="flex-1 p-4 space-y-3 overflow-y-auto min-h-96"
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnStage(stage)}
              >
                {stageLeads.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Nenhum lead
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      onClick={() => onSelectLead?.(lead.id)}
                      className="p-4 bg-card border border-border rounded-lg hover-lift cursor-move transition-all hover:shadow-md"
                    >
                      <h3 className="font-semibold text-foreground text-sm">{lead.name}</h3>
                      {lead.email && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">{lead.email}</p>
                      )}
                      {lead.phone && (
                        <p className="text-xs text-muted-foreground truncate">{lead.phone}</p>
                      )}
                      {lead.origin && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <span className="inline-block px-2 py-1 rounded text-xs bg-secondary text-secondary-foreground">
                            {lead.origin}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
          Atualizando...
        </div>
      )}
    </div>
  );
}
