import { useLeads } from '../hooks/useLeads';
import { LeadTemperature } from './LeadTemperature';
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

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Carregando leads...</div>;
  if (error) return <div className="text-destructive text-center py-8">Erro ao carregar leads</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-display font-bold text-foreground">Leads</h2>

      {leads && leads.length === 0 ? (
        <div className="text-muted-foreground text-center py-12 bg-surface border border-border rounded-xl">
          <p className="text-lg">Nenhum lead encontrado</p>
          <p className="text-sm mt-2">Comece criando seu primeiro lead</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads?.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead?.(lead.id)}
              className="p-5 border border-border rounded-lg bg-surface hover-lift cursor-pointer space-y-3"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">{lead.name}</h3>
                  <div className="mt-2">
                    <LeadTemperature lead={lead} size="sm" />
                  </div>
                </div>
                <span
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-white shrink-0"
                  style={{ backgroundColor: LEAD_STATUS_CONFIG[lead.status as LeadStatus].color }}
                >
                  {LEAD_STATUS_CONFIG[lead.status as LeadStatus].label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {lead.email && (
                  <div>
                    <span className="text-muted-foreground">Email</span>
                    <p className="text-foreground">{lead.email}</p>
                  </div>
                )}
                {lead.phone && (
                  <div>
                    <span className="text-muted-foreground">Telefone</span>
                    <p className="text-foreground">{lead.phone}</p>
                  </div>
                )}
                {lead.origin && (
                  <div>
                    <span className="text-muted-foreground">Origem</span>
                    <p className="text-foreground">{LEAD_ORIGINS[lead.origin as LeadOrigin]}</p>
                  </div>
                )}
                {lead.city && (
                  <div>
                    <span className="text-muted-foreground">Cidade</span>
                    <p className="text-foreground">{lead.city}</p>
                  </div>
                )}
              </div>

              {lead.notes && <p className="text-sm text-muted-foreground italic mt-2">"{lead.notes}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
