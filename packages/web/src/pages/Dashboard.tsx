import { useLeads } from '../hooks/useLeads';
import { LeadsList } from '../components/LeadsList';
import { LEAD_STATUS_CONFIG } from '@meu-imovel-pe/shared';
import type { LeadStatus } from '@meu-imovel-pe/shared';

export function Dashboard() {
  const { data: leads = [] } = useLeads();

  const stats = {
    total: leads.length,
    novo_lead: leads.filter((l) => l.status === 'novo_lead').length,
    qualificado: leads.filter((l) => l.status === 'qualificado').length,
    em_atendimento: leads.filter((l) => l.status === 'em_atendimento').length,
    venda_concluida: leads.filter((l) => l.status === 'venda_concluida').length,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard label="Total de Leads" value={stats.total} />
        <StatCard label="Novos" value={stats.novo_lead} />
        <StatCard label="Qualificados" value={stats.qualificado} />
        <StatCard label="Em Atendimento" value={stats.em_atendimento} />
        <StatCard label="Vendas" value={stats.venda_concluida} color="#10B981" />
      </div>

      {/* Sales Funnel */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Funil de Vendas</h2>
        <div className="space-y-3">
          {(['novo_lead', 'primeiro_contato', 'qualificado', 'em_atendimento', 'visita_agendada', 'proposta', 'negociacao', 'venda_concluida'] as LeadStatus[]).map((status) => {
            const count = leads.filter((l) => l.status === status).length;
            const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;

            return (
              <div key={status}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{LEAD_STATUS_CONFIG[status].label}</span>
                  <span className="text-sm text-gray-600">{count} leads</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: LEAD_STATUS_CONFIG[status].color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Leads */}
      <div>
        <LeadsList />
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color?: string;
}

function StatCard({ label, value, color = '#0284C7' }: StatCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
