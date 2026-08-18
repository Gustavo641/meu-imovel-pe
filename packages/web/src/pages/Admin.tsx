import { useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { UsuariosAdmin } from '../components/UsuariosAdmin';
import { PermissoesAdmin } from '../components/PermissoesAdmin';
import { AuditLogsAdmin } from '../components/AuditLogsAdmin';

type AdminTab = 'usuarios' | 'permissoes' | 'logs';

export function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>('usuarios');

  return (
    <ProtectedRoute resource="configuracoes" action="view">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground">Configurações Admin</h1>
          <p className="text-muted-foreground mt-1">Gestão de usuários, permissões e auditoria</p>
        </div>

        {/* Abas */}
        <div className="flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === 'usuarios'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            👥 Usuários
          </button>
          <button
            onClick={() => setActiveTab('permissoes')}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === 'permissoes'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            🔐 Permissões
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              activeTab === 'logs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            📋 Auditoria
          </button>
        </div>

        {/* Conteúdo */}
        <div>
          {activeTab === 'usuarios' && <UsuariosAdmin />}
          {activeTab === 'permissoes' && <PermissoesAdmin />}
          {activeTab === 'logs' && <AuditLogsAdmin />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
