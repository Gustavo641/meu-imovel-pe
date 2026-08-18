import { DateTime } from '../components/DateTime';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useLeadStats } from '../hooks/useLeadStats';
import { usePermissionStore } from '../hooks/usePermissions';

export function Dashboard() {
  const stats = useLeadStats();
  const role = usePermissionStore((s) => s.role);
  const canExportRevenue = usePermissionStore((s) => s.permissions.some((p) => p.resource === 'dashboard' && p.action === 'export'));

  if (!stats) {
    return (
      <ProtectedRoute resource="dashboard" action="view">
        <div className="text-center py-12 text-muted-foreground">Carregando dados...</div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute resource="dashboard" action="view">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Dashboard</h1>
          <DateTime />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total de Leads" value={stats.totalLeads} subtext="em gestão" icon="📊" />
          <StatCard label="Leads Quentes" value={stats.hotLeads} subtext="negociação ativa" icon="🔥" color="destructive" />
          <StatCard label="Leads Mornos" value={stats.warmLeads} subtext="contato feito" icon="🌤️" color="warning" />
          <StatCard label="Vendas Fechadas" value={stats.closedDeals} subtext="negócio ganho" icon="✅" color="success" />
        </div>

        {role === 'CEO' && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground mb-2">Receita Mensal</h2>
                <p className="text-4xl font-bold text-success">R$ {stats.monthlyRevenue.toLocaleString('pt-BR')}</p>
              </div>
              {canExportRevenue && <button className="px-4 py-2 btn-primary rounded-lg text-sm">Exportar</button>}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Prospecção por Canal</h2>
          <div className="space-y-3">
            {Object.entries(stats.prospectionByChannel).map(([channel, count]) => (
              <div key={channel} className="flex items-center justify-between">
                <span className="capitalize text-foreground">{channel}</span>
                <div className="flex items-center gap-3 flex-1 justify-end">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0}%` }} />
                  </div>
                  <span className="text-foreground font-semibold w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Taxa de Conversão</h2>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-success">{stats.conversionRate.toFixed(1)}%</p>
              <p className="text-muted-foreground text-sm mt-2">Conversão Geral</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Distribuição por Temperatura</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TemperatureCard emoji="🔥" label="Quente" count={stats.hotLeads} color="destructive" />
            <TemperatureCard emoji="🌤️" label="Morno" count={stats.warmLeads} color="warning" />
            <TemperatureCard emoji="❄️" label="Frio" count={stats.coldLeads} color="info" />
            <TemperatureCard emoji="✅" label="Fechado" count={stats.closedDeals} color="success" />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  subtext: string;
  icon: string;
  color?: 'primary' | 'destructive' | 'warning' | 'success' | 'info';
}

function StatCard({ label, value, subtext, icon, color = 'primary' }: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary',
    destructive: 'text-destructive',
    warning: 'text-warning',
    success: 'text-success',
    info: 'text-info'
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover-lift">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className={`text-4xl font-display font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-xs text-muted-foreground">{subtext}</p>
    </div>
  );
}

interface TemperatureCardProps {
  emoji: string;
  label: string;
  count: number;
  color: string;
}

function TemperatureCard({ emoji, label, count, color }: TemperatureCardProps) {
  const colorClasses = {
    destructive: 'bg-destructive bg-opacity-10 border-destructive text-destructive',
    warning: 'bg-warning bg-opacity-10 border-warning text-warning',
    info: 'bg-info bg-opacity-10 border-info text-info',
    success: 'bg-success bg-opacity-10 border-success text-success'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} text-center`}>
      <p className="text-3xl mb-2">{emoji}</p>
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-2xl font-bold mt-2">{count}</p>
    </div>
  );
}
