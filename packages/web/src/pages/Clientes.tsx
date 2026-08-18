import { useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ClienteForm } from '../components/ClienteForm';
import { useClientes, Cliente } from '../hooks/useClientes';

export function Clientes() {
  const { clientes, isLoading, createCliente, updateCliente, deleteCliente, archiveCliente, isCreating } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [activeTab, setActiveTab] = useState<'lista' | 'dados' | 'historico' | 'vinculos'>('lista');

  const handleCreate = (data: any) => {
    createCliente(data, {
      onSuccess: () => {
        setShowForm(false);
        setEditingCliente(null);
      },
    });
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setShowForm(true);
    setActiveTab('dados');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      deleteCliente(id);
    }
  };

  const handleArchive = (id: string) => {
    if (confirm('Tem certeza que deseja arquivar este cliente?')) {
      archiveCliente(id);
    }
  };

  return (
    <ProtectedRoute resource="clientes" action="view">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Clientes</h1>
            <p className="text-muted-foreground mt-1">Gestão de empresas e contatos</p>
          </div>
          <button
            onClick={() => {
              setEditingCliente(null);
              setShowForm(!showForm);
              setActiveTab('lista');
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
          >
            {showForm ? '✕ Cancelar' : '+ Novo Cliente'}
          </button>
        </div>

        {/* Form ou Lista */}
        {showForm ? (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">
              {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
            </h2>
            <ClienteForm
              cliente={editingCliente || undefined}
              onSubmit={handleCreate}
              isLoading={isCreating}
            />
          </div>
        ) : (
          <div>
            {/* Abas */}
            <div className="flex gap-4 border-b border-border mb-6">
              <button
                onClick={() => setActiveTab('lista')}
                className={`px-4 py-2 font-medium border-b-2 transition-all ${
                  activeTab === 'lista'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Lista ({clientes.length})
              </button>
              <button
                onClick={() => setActiveTab('historico')}
                className={`px-4 py-2 font-medium border-b-2 transition-all ${
                  activeTab === 'historico'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Histórico
              </button>
              <button
                onClick={() => setActiveTab('vinculos')}
                className={`px-4 py-2 font-medium border-b-2 transition-all ${
                  activeTab === 'vinculos'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Vínculos
              </button>
            </div>

            {/* Conteúdo das Abas */}
            {activeTab === 'lista' && (
              <div className="space-y-3">
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-8">Carregando...</p>
                ) : clientes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum cliente cadastrado</p>
                ) : (
                  clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className="bg-card border border-border rounded-lg p-4 flex justify-between items-start hover:border-primary transition-all"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{cliente.razao_social}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cliente.email} • {cliente.telefone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cliente.cidade}, {cliente.estado}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="px-3 py-1 text-sm bg-primary bg-opacity-10 text-primary rounded hover:bg-opacity-20"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleArchive(cliente.id)}
                          className="px-3 py-1 text-sm bg-warning bg-opacity-10 text-warning rounded hover:bg-opacity-20"
                        >
                          📦 Arquivar
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="px-3 py-1 text-sm bg-destructive bg-opacity-10 text-destructive rounded hover:bg-opacity-20"
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'historico' && (
              <div className="text-center py-8 text-muted-foreground">
                📋 Histórico de interações com clientes em desenvolvimento
              </div>
            )}

            {activeTab === 'vinculos' && (
              <div className="text-center py-8 text-muted-foreground">
                🔗 Vínculos com leads e contratos em desenvolvimento
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
