import { useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DemandaForm } from '../components/DemandaForm';
import { useAgenda, Demanda } from '../hooks/useAgenda';

export function Agenda() {
  const { demandas, isLoading, createDemanda, updateStatus, deleteDemanda, isCreating } = useAgenda();
  const [showForm, setShowForm] = useState(false);
  const [editingDemanda, setEditingDemanda] = useState<Demanda | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'pendente' | 'concluida' | null>(null);

  const handleCreate = (data: any) => {
    createDemanda(data, {
      onSuccess: () => {
        setShowForm(false);
        setEditingDemanda(null);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deletar demanda?')) {
      deleteDemanda(id);
    }
  };

  const filteredDemandas = demandas.filter((d) => {
    if (filterPriority && d.prioridade !== filterPriority) return false;
    if (filterStatus && d.status !== filterStatus) return false;
    return true;
  });

  const demandaByDate = filteredDemandas.reduce((acc: Record<string, Demanda[]>, d) => {
    const date = new Date(d.start_time).toLocaleDateString('pt-BR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(d);
    return acc;
  }, {});

  return (
    <ProtectedRoute resource="agenda" action="view">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground mt-1">Demandas e eventos agendados</p>
          </div>
          <button
            onClick={() => {
              setEditingDemanda(null);
              setShowForm(!showForm);
            }}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
          >
            {showForm ? '✕ Cancelar' : '+ Nova Demanda'}
          </button>
        </div>

        {showForm ? (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">
              {editingDemanda ? 'Editar Demanda' : 'Nova Demanda'}
            </h2>
            <DemandaForm
              demanda={editingDemanda || undefined}
              onSubmit={handleCreate}
              isLoading={isCreating}
            />
          </div>
        ) : (
          <div>
            <div className="flex gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setFilterPriority(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterPriority === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilterPriority('urgente')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterPriority === 'urgente'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                }`}
              >
                🔴 Urgente
              </button>
              <button
                onClick={() => setFilterPriority('alta')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterPriority === 'alta'
                    ? 'bg-warning text-warning-foreground'
                    : 'bg-warning/10 text-warning hover:bg-warning/20'
                }`}
              >
                🟠 Alta
              </button>
              <button
                onClick={() => setFilterStatus(filterStatus === 'pendente' ? null : 'pendente')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === 'pendente'
                    ? 'bg-info text-info-foreground'
                    : 'bg-info/10 text-info hover:bg-info/20'
                }`}
              >
                ⏳ Pendentes
              </button>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : Object.keys(demandaByDate).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhuma demanda encontrada</p>
              ) : (
                Object.entries(demandaByDate).map(([date, items]) => (
                  <div key={date}>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-3">
                      📅 {date}
                    </h3>
                    <div className="space-y-2">
                      {items.map((demanda) => (
                        <div
                          key={demanda.id}
                          className={`bg-card border-l-4 border-b border-r rounded-lg p-4 transition-all ${
                            demanda.prioridade === 'urgente'
                              ? 'border-l-destructive'
                              : demanda.prioridade === 'alta'
                              ? 'border-l-warning'
                              : demanda.prioridade === 'media'
                              ? 'border-l-info'
                              : 'border-l-success'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <input
                                  type="checkbox"
                                  checked={demanda.status === 'concluida'}
                                  onChange={(e) =>
                                    updateStatus({
                                      id: demanda.id,
                                      status: e.target.checked ? 'concluida' : 'pendente',
                                    })
                                  }
                                  className="w-4 h-4 rounded"
                                />
                                <span className="text-sm text-muted-foreground">
                                  {new Date(demanda.start_time).toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <h4
                                className={`font-semibold ${
                                  demanda.status === 'concluida'
                                    ? 'line-through text-muted-foreground'
                                    : 'text-foreground'
                                }`}
                              >
                                {demanda.titulo}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {demanda.empresa} • {demanda.duration_min}min
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingDemanda(demanda);
                                  setShowForm(true);
                                }}
                                className="px-3 py-1 text-sm bg-primary bg-opacity-10 text-primary rounded hover:bg-opacity-20"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(demanda.id)}
                                className="px-3 py-1 text-sm bg-destructive bg-opacity-10 text-destructive rounded hover:bg-opacity-20"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          {demanda.descricao && (
                            <p className="text-sm text-muted-foreground mt-2 ml-6">
                              {demanda.descricao}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
