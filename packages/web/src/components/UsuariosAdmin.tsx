import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  ultima_atividade: string;
  created_at: string;
}

export function UsuariosAdmin() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', email: '', role: 'COMERCIAL' });

  const { data: usuarios = [], isLoading, refetch } = useQuery({
    queryKey: ['usuarios-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, role_id, ativo, ultima_atividade, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from('profiles')
        .update({ nome: formData.nome })
        .eq('id', editingId);

      if (error) {
        alert('Erro ao atualizar usuário');
        return;
      }
    }

    setFormData({ nome: '', email: '', role: 'COMERCIAL' });
    setEditingId(null);
    setShowForm(false);
    refetch();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ ativo: !currentStatus })
      .eq('id', id);

    if (error) {
      alert('Erro ao atualizar usuário');
      return;
    }

    refetch();
  };

  const handleEdit = (usuario: Usuario) => {
    setFormData({ nome: usuario.nome, email: usuario.email, role: usuario.role });
    setEditingId(usuario.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Botão */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ nome: '', email: '', role: 'COMERCIAL' });
            setShowForm(!showForm);
          }}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
        >
          {showForm ? '✕ Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {editingId ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!editingId}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cargo</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
              >
                <option value="CEO">CEO</option>
                <option value="OPERACIONAL">OPERACIONAL</option>
                <option value="COMERCIAL">COMERCIAL</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90"
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Carregando...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum usuário cadastrado</p>
        ) : (
          usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="bg-card border border-border rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{usuario.nome}</h4>
                <p className="text-sm text-muted-foreground">{usuario.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {usuario.role} • {usuario.ativo ? '✅ Ativo' : '❌ Inativo'} •
                  {new Date(usuario.ultima_atividade || usuario.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(usuario)}
                  className="px-3 py-1 text-sm bg-primary bg-opacity-10 text-primary rounded hover:bg-opacity-20"
                >
                  ✏️
                </button>
                <button
                  onClick={() => toggleActive(usuario.id, usuario.ativo)}
                  className={`px-3 py-1 text-sm rounded ${
                    usuario.ativo
                      ? 'bg-warning bg-opacity-10 text-warning'
                      : 'bg-success bg-opacity-10 text-success'
                  }`}
                >
                  {usuario.ativo ? '🔒 Desativar' : '🔓 Ativar'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
