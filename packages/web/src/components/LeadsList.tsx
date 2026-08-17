import { useLeads } from '../hooks/useLeads';
import { LEAD_STATUS_CONFIG, LEAD_ORIGINS } from '@meu-imovel-pe/shared';
import type { LeadStatus, LeadOrigin } from '@meu-imovel-pe/shared';

interface LeadsListProps {
  statusFilter?: LeadStatus;
  originFilter?: LeadOrigin;
  onSelectLead?: (leadId: string) => void;
}

export function LeadsList({ statusFilter, originFilter, onSelectLead }: LeadsListProps) {
  const { data: leads, isLoading, error } = useLeads({
    status: statusFilter,
    origin: originFilter,
  });

  if (isLoading) return <div className="text-center py-8">Carregando leads...</div>;
  if (error) return <div className="text-red-500">Erro ao carregar leads</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Leads</h2>

      {leads && leads.length === 0 ? (
        <div className="text-gray-500 text-center py-8">Nenhum lead encontrado</div>
      ) : (
        <div className="grid gap-4">
          {leads?.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead?.(lead.id)}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{lead.name}</h3>
                <span
                  className="px-3 py-1 rounded-full text-white text-sm"
                  style={{ backgroundColor: LEAD_STATUS_CONFIG[lead.status as LeadStatus].color }}
                >
                  {LEAD_STATUS_CONFIG[lead.status as LeadStatus].label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Email:</span> {lead.email || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Telefone:</span> {lead.phone || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Origem:</span> {LEAD_ORIGINS[lead.origin as LeadOrigin]}
                </div>
                <div>
                  <span className="font-medium">Cidade:</span> {lead.city || 'N/A'}
                </div>
              </div>

              {lead.notes && <p className="mt-2 text-sm text-gray-700">{lead.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
