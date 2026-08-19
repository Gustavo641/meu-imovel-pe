import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateLead } from '../hooks/useLeads';
import { LeadsList } from '../components/LeadsList';
import { LEAD_ORIGINS, PROPERTY_TYPES, INVESTMENT_RANGES } from '@meu-imovel-pe/shared';
import type { Lead, LeadStatus, LeadOrigin } from '@meu-imovel-pe/shared';

type LeadFormData = Omit<Lead, 'id' | 'created_at' | 'updated_at'>;

export function Leads() {
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | undefined>();
  const createLead = useCreateLead();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeadFormData>();

  const onSubmit = async (data: LeadFormData) => {
    try {
      await createLead.mutateAsync(data);
      reset();
      setShowForm(false);
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
            Gestão de Leads
          </h1>
          <p className="text-muted-foreground mt-2">Acompanhe e qualifique seus leads</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn-primary px-6 py-3 rounded-lg transition-all ${
            showForm ? 'btn-secondary' : ''
          }`}
        >
          {showForm ? '✕ Cancelar' : '+ Novo Lead'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap p-4 bg-surface rounded-lg border border-border">
        <button
          onClick={() => setSelectedStatus(undefined)}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedStatus === undefined
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          📊 Todos
        </button>
        {['novo_lead', 'qualificado', 'em_atendimento', 'venda_concluida'].map((status) => {
          const icons: Record<string, string> = {
            novo_lead: '🆕',
            qualificado: '✅',
            em_atendimento: '📞',
            venda_concluida: '🎉',
          };
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status as LeadStatus)}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {icons[status]} {status.replace(/_/g, ' ').toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-6 bg-card rounded-xl border border-border shadow-elevated">
          <h2 className="text-2xl font-display font-bold mb-6 text-foreground">✨ Novo Lead</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">Nome *</label>
              <input
                {...register('name', { required: 'Nome é obrigatório' })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                {...register('phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Origem *</label>
              <select
                {...register('origin', { required: 'Origem é obrigatória' })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Selecione...</option>
                {Object.entries(LEAD_ORIGINS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              {errors.origin && <span className="text-red-500 text-sm">{errors.origin.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <input
                {...register('city')}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bairro</label>
              <input
                {...register('neighborhood')}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo de Imóvel</label>
              <select
                {...register('property_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Selecione...</option>
                {Object.entries(PROPERTY_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Faixa de Investimento</label>
              <select
                {...register('investment_range')}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Selecione...</option>
                {Object.entries(INVESTMENT_RANGES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Notas</label>
              <textarea
                {...register('notes')}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                disabled={createLead.isPending}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {createLead.isPending ? 'Salvando...' : 'Criar Lead'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leads List */}
      <LeadsList statusFilter={selectedStatus} />
    </div>
  );
}
