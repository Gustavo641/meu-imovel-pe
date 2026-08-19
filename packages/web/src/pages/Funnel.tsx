import { useState } from 'react';
import { Kanban } from '../components/Kanban';
import { useLead } from '../hooks/useLeads';
import { LEAD_STATUS_CONFIG, LEAD_ORIGINS } from '@meu-imovel-pe/shared';
import type { LeadOrigin } from '@meu-imovel-pe/shared';

export function Funnel() {
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { data: lead } = useLead(selectedLeadId || '');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-foreground">
          Funil de Vendas
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o progresso dos seus leads através do funil comercial
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kanban Board */}
        <div className="lg:col-span-3">
          <Kanban onSelectLead={setSelectedLeadId} />
        </div>

        {/* Sidebar - Lead Details */}
        <div className="lg:col-span-1">
          {selectedLeadId && lead ? (
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24 h-fit shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-display font-bold text-foreground">
                  Detalhes
                </h3>
                <button
                  onClick={() => setSelectedLeadId(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-sm">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Nome
                  </label>
                  <p className="text-foreground font-semibold mt-1">{lead.name}</p>
                </div>

                {/* Status Badge */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className="inline-block px-3 py-1 rounded-md text-xs font-semibold text-white"
                      style={{
                        backgroundColor:
                          LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG]?.color ||
                          '#6B7280',
                      }}
                    >
                      {LEAD_STATUS_CONFIG[lead.status as keyof typeof LEAD_STATUS_CONFIG]?.label || lead.status}
                    </span>
                  </div>
                </div>

                {/* Email */}
                {lead.email && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Email
                    </label>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-primary hover:underline mt-1 block"
                    >
                      {lead.email}
                    </a>
                  </div>
                )}

                {/* Phone */}
                {lead.phone && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Telefone
                    </label>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-primary hover:underline mt-1 block"
                    >
                      {lead.phone}
                    </a>
                  </div>
                )}

                {/* Origin */}
                {lead.origin && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Origem
                    </label>
                    <p className="text-foreground mt-1">
                      {LEAD_ORIGINS[lead.origin as LeadOrigin] || lead.origin}
                    </p>
                  </div>
                )}

                {/* City */}
                {lead.city && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Cidade
                    </label>
                    <p className="text-foreground mt-1">{lead.city}</p>
                  </div>
                )}

                {/* Notes */}
                {lead.notes && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Notas
                    </label>
                    <p className="text-foreground mt-1 italic">{lead.notes}</p>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Created Date */}
                <div className="text-xs text-muted-foreground">
                  Criado em{' '}
                  {lead.created_at
                    ? new Date(lead.created_at).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground sticky top-24">
              <p>Selecione um lead para ver detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
