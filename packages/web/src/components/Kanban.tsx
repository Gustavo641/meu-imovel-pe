import { useLeads } from '../hooks/useLeads';
import { useKanban } from '../hooks/useKanban';
import { KanbanColumn } from './KanbanColumn';
import type { LeadStatus } from '@meu-imovel-pe/shared';

const KANBAN_STATUSES: LeadStatus[] = [
  'novo_lead',
  'primeiro_contato',
  'qualificado',
  'em_atendimento',
  'visita_agendada',
  'proposta',
  'negociacao',
  'venda_concluida',
];

interface KanbanProps {
  onSelectLead?: (leadId: string) => void;
}

export function Kanban({ onSelectLead }: KanbanProps) {
  const { data: leads = [], isLoading, error } = useLeads();
  const { moveLead, isMoving, getLeadsByStatus } = useKanban();

  if (isLoading) return <div className="text-center py-8">Carregando leads...</div>;
  if (error) return <div className="text-red-500">Erro ao carregar leads</div>;

  const handleDropLead = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await moveLead(leadId, newStatus);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Funil de Vendas</h2>
        <span className="text-sm text-gray-600">Total: {leads.length} leads</span>
      </div>

      {/* Kanban Board */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 pb-4 min-w-max md:min-w-full">
          {KANBAN_STATUSES.map((status) => (
            <div key={status} className="w-72">
              <KanbanColumn
                status={status}
                leads={getLeadsByStatus(leads, status)}
                onDropLead={handleDropLead}
                isMoving={isMoving}
                onSelectLead={onSelectLead}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {getLeadsByStatus(leads, 'venda_concluida').length}
          </p>
          <p className="text-sm text-gray-600">Vendas Fechadas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            {getLeadsByStatus(leads, 'novo_lead').length}
          </p>
          <p className="text-sm text-gray-600">Novos Leads</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">
            {getLeadsByStatus(leads, 'em_atendimento').length +
              getLeadsByStatus(leads, 'visita_agendada').length +
              getLeadsByStatus(leads, 'proposta').length}
          </p>
          <p className="text-sm text-gray-600">Em Negociação</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {getLeadsByStatus(leads, 'perdido').length}
          </p>
          <p className="text-sm text-gray-600">Perdidos</p>
        </div>
      </div>
    </div>
  );
}
