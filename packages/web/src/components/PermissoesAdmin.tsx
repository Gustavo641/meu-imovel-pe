import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

interface Permissao {
  id: string;
  role: string;
  resource: string;
  action: 'view' | 'edit' | 'export';
}

const RECURSOS = [
  'dashboard', 'crm_comercial', 'crm_operacional', 'clientes',
  'agenda', 'documentos', 'relatorios', 'equipe', 'configuracoes', 'usuarios'
];

const ROLES = ['CEO', 'OPERACIONAL', 'COMERCIAL'];

export function PermissoesAdmin() {
  const { data: permissoes = [], isLoading } = useQuery({
    queryKey: ['permissoes-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('id, role_id, resource, action')
        .order('resource');

      if (error) throw error;
      return data || [];
    },
  });

  const getPermissionMatrix = () => {
    const matrix: Record<string, Record<string, Set<string>>> = {};

    ROLES.forEach((role) => {
      matrix[role] = {};
      RECURSOS.forEach((resource) => {
        matrix[role][resource] = new Set();
      });
    });

    permissoes.forEach((p: any) => {
      const roleData = ROLES.find((r) => r === p.role);
      if (roleData && matrix[roleData][p.resource]) {
        matrix[roleData][p.resource].add(p.action);
      }
    });

    return matrix;
  };

  const matrix = getPermissionMatrix();

  return (
    <div className="space-y-6">
      <div className="bg-info bg-opacity-10 border border-info rounded-lg p-4">
        <p className="text-sm text-info">
          📋 Matriz de Permissões: V (View), E (Edit), X (Export)
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-card border-b border-border">
              <th className="p-3 text-left font-semibold text-foreground">Recurso</th>
              {ROLES.map((role) => (
                <th key={role} className="p-3 text-center font-semibold text-foreground">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECURSOS.map((resource) => (
              <tr key={resource} className="border-b border-border hover:bg-card/50">
                <td className="p-3 font-medium text-foreground">{resource}</td>
                {ROLES.map((role) => {
                  const perms = matrix[role][resource];
                  const hasView = perms.has('view');
                  const hasEdit = perms.has('edit');
                  const hasExport = perms.has('export');

                  return (
                    <td key={`${role}-${resource}`} className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <span
                          className={`inline-block w-6 h-6 rounded text-center text-xs font-bold ${
                            hasView
                              ? 'bg-success bg-opacity-20 text-success'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          V
                        </span>
                        <span
                          className={`inline-block w-6 h-6 rounded text-center text-xs font-bold ${
                            hasEdit
                              ? 'bg-info bg-opacity-20 text-info'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          E
                        </span>
                        <span
                          className={`inline-block w-6 h-6 rounded text-center text-xs font-bold ${
                            hasExport
                              ? 'bg-warning bg-opacity-20 text-warning'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          X
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-3">Resumo de Permissões</h4>
        <div className="space-y-2 text-sm">
          {ROLES.map((role) => {
            const rolePerms = permissoes.filter((p: any) => p.role === role);
            const views = rolePerms.filter((p: any) => p.action === 'view').length;
            const edits = rolePerms.filter((p: any) => p.action === 'edit').length;
            const exports = rolePerms.filter((p: any) => p.action === 'export').length;

            return (
              <div key={role} className="flex justify-between">
                <span className="font-medium text-foreground">{role}</span>
                <span className="text-muted-foreground">
                  V: {views} | E: {edits} | X: {exports}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
