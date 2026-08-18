import { useState } from 'react';
import { useLeads } from '../hooks/useLeads';
import { supabase } from '../services/supabase';
import type { Lead } from '@meu-imovel-pe/shared';

interface KanbanProps {
  stages: string[];
  pipeline: 'comercial' | 'operacional';
}

const STAGE_LABELS: Record<string, string> = {
  lead: '1. Lead',
  primeiro_contato: '2. Primeiro Contato',
  reuniao: '3. Reunião',
  novo_evento: '4. Novo Evento',
  proposta: '5. Proposta',
  entrada_operacional: '6. Entrada Operacional',
  comissoes_a_pagar: '7. Comissões a Pagar',
  comissoes_pagas: '8. Comissões Pagas'
};

export function Kanban({ stages, pipeline }: KanbanProps) {
  const { data: leads = [] } = useLeads();
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const stage = lead.stage || 'lead';
    if (pipeline === 'comercial') {
      return ['lead', 'primeiro_contato', 'reuniao', 'novo_evento', 'proposta', 'entrada_operacional', 'comissoes_a_pagar', 'comissoes_pagas'].includes(stage);
    }
    return stage !== 'comissoes_pagas';
  });

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnColumn = async (toStage: string) => {
    if (!draggedLead) return;
    const currentStage = draggedLead.stage || 'lead';
    const currentIndex = stages.indexOf(currentStage);
    const toIndex = stages.indexOf(toStage);
    if (Math.abs(currentIndex - toIndex) !== 1) {
      alert('Apenas movimentação adjacente permitida');
      return;
    }

    try {
      await supabase
        .from('leads')
        .update({ stage: toStage })
        .eq('id', draggedLead.id);

      if (toStage === 'entrada_operacional' && !draggedLead.is_commission_copy) {
        const { error: insertError } = await supabase
          .from('leads')
          .insert({
            nome: draggedLead.name,
            empresa: draggedLead.empresa || '',
            valor: draggedLead.valor,
            responsavel: draggedLead.responsavel,
            stage: 'comissoes_a_pagar',
            is_commission_copy: true,
            original_lead_id: draggedLead.id,
            created_by: draggedLead.created_by,
            email: draggedLead.email,
            telefone: draggedLead.phone
          });

        if (insertError) throw insertError;
      }

      setDraggedLead(null);
    } catch (error) {
      alert('Erro ao mover lead');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-display font-bold text-foreground mb-6">
        {pipeline === 'comercial' ? '🎯 Funil Comercial' : '⚙️ Operacional'}
      </h1>
      <div className="flex gap-4 overflow-x-auto">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            label={STAGE_LABELS[stage]}
            leads={filteredLeads.filter((l) => (l.stage || 'lead') === stage)}
            onDragOver={handleDragOver}
            onDrop={() => handleDropOnColumn(stage)}
            onLeadDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}

function KanbanColumn({ stage, label, leads, onDragOver, onDrop, onLeadDragStart }: any) {
  return (
    <div className="flex-shrink-0 w-80 bg-surface rounded-lg border border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">{label}</h2>
        <p className="text-muted-foreground text-sm">{leads.length} leads</p>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto" onDragOver={onDragOver} onDrop={onDrop}>
        {leads.map((lead: Lead) => (
          <div
            key={lead.id}
            draggable
            onDragStart={() => onLeadDragStart(lead)}
            className="p-3 bg-card border border-border rounded hover-lift cursor-move"
          >
            <h3 className="font-semibold text-foreground text-sm">{lead.empresa}</h3>
            <p className="text-xs text-muted-foreground mt-1">{lead.produtor}</p>
            {lead.valor && (
              <p className="text-sm font-semibold text-success mt-2">R$ {lead.valor.toLocaleString('pt-BR')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
