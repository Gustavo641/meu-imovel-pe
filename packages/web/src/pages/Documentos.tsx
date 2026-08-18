import { useState } from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { DocumentoForm } from '../components/DocumentoForm';
import { useDocumentos } from '../hooks/useDocumentos';

export function Documentos() {
  const { documentos, isLoading, uploadDocumento, deleteDocumento, isUploading } = useDocumentos();
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleUpload = (data: any) => {
    uploadDocumento(data, {
      onSuccess: () => {
        setShowForm(false);
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Deletar documento?')) {
      deleteDocumento(id);
    }
  };

  const filteredDocumentos = filterType
    ? documentos.filter((d) => d.tipo === filterType)
    : documentos;

  const getTypeIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      contrato: '📋',
      proposta: '📊',
      briefing: '📝',
      marketing: '🎯',
      financeiro: '💰',
    };
    return icons[tipo] || '📄';
  };

  const getTypeLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      contrato: 'Contrato',
      proposta: 'Proposta',
      briefing: 'Briefing',
      marketing: 'Marketing',
      financeiro: 'Financeiro',
    };
    return labels[tipo] || tipo;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute resource="documentos" action="view">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">Documentos</h1>
            <p className="text-muted-foreground mt-1">Gestão de contratos, propostas e arquivos</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
          >
            {showForm ? '✕ Cancelar' : '📤 Novo Documento'}
          </button>
        </div>

        {/* Form ou Lista */}
        {showForm ? (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">
              Upload de Documento
            </h2>
            <DocumentoForm onSubmit={handleUpload} isLoading={isUploading} />
          </div>
        ) : (
          <div>
            {/* Filtros */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <button
                onClick={() => setFilterType(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                Todos ({documentos.length})
              </button>
              <button
                onClick={() => setFilterType('contrato')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'contrato' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-600'
                }`}
              >
                📋 Contratos
              </button>
              <button
                onClick={() => setFilterType('proposta')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'proposta' ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-600'
                }`}
              >
                📊 Propostas
              </button>
              <button
                onClick={() => setFilterType('financeiro')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterType === 'financeiro' ? 'bg-yellow-500 text-white' : 'bg-yellow-500/10 text-yellow-600'
                }`}
              >
                💰 Financeiros
              </button>
            </div>

            {/* Lista de Documentos */}
            <div className="space-y-3">
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredDocumentos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {filterType ? 'Nenhum documento encontrado' : 'Nenhum documento enviado'}
                </p>
              ) : (
                filteredDocumentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-card border border-border rounded-lg p-4 flex justify-between items-center hover:border-primary transition-all"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <div className="text-3xl">{getTypeIcon(doc.tipo)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{doc.nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getTypeLabel(doc.tipo)} • {formatFileSize(doc.tamanho)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(doc.created_at).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-lg text-sm font-medium hover:bg-opacity-20 transition-all"
                      >
                        📥 Baixar
                      </a>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-3 py-2 bg-destructive bg-opacity-10 text-destructive rounded-lg text-sm font-medium hover:bg-opacity-20"
                      >
                        🗑️
                      </button>
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
