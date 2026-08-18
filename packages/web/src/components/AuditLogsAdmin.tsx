import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

interface AuditLog {
  id: string;
  usuario_id: string;
  acao: string;
  tabela: string;
  registro_id: string;
  registro_nome: string;
  dados_anteriores: any;
  dados_novos: any;
  created_at: string;
}

export function AuditLogsAdmin() {
  const [filterTable, setFilterTable] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit-logs-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
  });

  const filteredLogs = logs.filter((log: AuditLog) => {
    if (filterTable && log.tabela !== filterTable) return false;
    if (filterAction && log.acao !== filterAction) return false;
    return true;
  });

  const tables = [...new Set(logs.map((l: AuditLog) => l.tabela))];
  const actions = [...new Set(logs.map((l: AuditLog) => l.acao))];

  const getActionIcon = (acao: string) => {
    const icons: Record<string, string> = {
      create: '✨',
      update: '✏️',
      delete: '🗑️',
      stage_change: '🔄',
    };
    return icons[acao] || '📝';
  };

  const getActionColor = (acao: string) => {
    const colors: Record<string, string> = {
      create: 'text-success',
      update: 'text-info',
      delete: 'text-destructive',
      stage_change: 'text-warning',
    };
    return colors[acao] || 'text-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilterTable(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterTable === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          Todas as Tabelas
        </button>
        {tables.map((table) => (
          <button
            key={table}
            onClick={() => setFilterTable(table)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterTable === table
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {table}
          </button>
        ))}
      </div>

      {/* Ações */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilterAction(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterAction === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground hover:bg-muted/80'
          }`}
        >
          Todas as Ações
        </button>
        {actions.map((action) => (
          <button
            key={action}
            onClick={() => setFilterAction(action)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterAction === action
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {getActionIcon(action)} {action}
          </button>
        ))}
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Carregando...</p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum log encontrado</p>
        ) : (
          filteredLogs.map((log: AuditLog) => (
            <div key={log.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1">
                  <span className={`text-2xl ${getActionColor(log.acao)}`}>
                    {getActionIcon(log.acao)}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground capitalize">
                      {log.acao} - {log.tabela}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {log.registro_nome || log.registro_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  className="px-3 py-1 text-sm bg-muted rounded hover:bg-muted/80"
                >
                  {expandedId === log.id ? '▼' : '▶'}
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleDateString('pt-BR')} às{' '}
                {new Date(log.created_at).toLocaleTimeString('pt-BR')}
              </div>

              {expandedId === log.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  {log.dados_anteriores && (
                    <div className="bg-destructive bg-opacity-5 p-3 rounded border border-destructive border-opacity-20">
                      <p className="text-xs font-semibold text-destructive mb-1">Antes:</p>
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(log.dados_anteriores, null, 2)}
                      </pre>
                    </div>
                  )}
                  {log.dados_novos && (
                    <div className="bg-success bg-opacity-5 p-3 rounded border border-success border-opacity-20">
                      <p className="text-xs font-semibold text-success mb-1">Depois:</p>
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(log.dados_novos, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
