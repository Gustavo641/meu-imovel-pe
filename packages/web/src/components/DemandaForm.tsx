import { useForm } from 'react-hook-form';
import { CreateDemandaDTO, Demanda } from '../hooks/useAgenda';

interface DemandaFormProps {
  demanda?: Demanda;
  onSubmit: (data: CreateDemandaDTO) => void;
  isLoading?: boolean;
}

const TIPOS = [
  { value: 'demanda', label: '📋 Demanda' },
  { value: 'evento', label: '🎯 Evento' },
  { value: 'follow_up', label: '📞 Follow-up' },
  { value: 'reuniao', label: '👥 Reunião' },
];

const PRIORIDADES = [
  { value: 'urgente', label: '🔴 Urgente', bg: 'bg-destructive' },
  { value: 'alta', label: '🟠 Alta', bg: 'bg-warning' },
  { value: 'media', label: '🟡 Média', bg: 'bg-info' },
  { value: 'baixa', label: '🟢 Baixa', bg: 'bg-success' },
];

export function DemandaForm({ demanda, onSubmit, isLoading }: DemandaFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateDemandaDTO>({
    defaultValues: demanda || {
      titulo: '',
      descricao: '',
      tipo: 'demanda',
      start_time: new Date().toISOString().slice(0, 16),
      duration_min: 30,
      prioridade: 'media',
      empresa: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Título
        </label>
        <input
          {...register('titulo', { required: 'Título obrigatório' })}
          type="text"
          placeholder="Ex: Reunião com cliente X"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
        />
        {errors.titulo && (
          <p className="text-destructive text-sm mt-1">{errors.titulo.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Descrição
        </label>
        <textarea
          {...register('descricao')}
          placeholder="Detalhes da demanda..."
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground h-24 resize-none"
        />
      </div>

      {/* Tipo e Prioridade */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Tipo
          </label>
          <select
            {...register('tipo')}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Prioridade
          </label>
          <select
            {...register('prioridade')}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            {PRIORIDADES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data/Hora e Duração */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Data e Hora
          </label>
          <input
            {...register('start_time', { required: 'Data obrigatória' })}
            type="datetime-local"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          />
          {errors.start_time && (
            <p className="text-destructive text-sm mt-1">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Duração (minutos)
          </label>
          <input
            {...register('duration_min', { required: 'Duração obrigatória' })}
            type="number"
            min="15"
            step="15"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          />
          {errors.duration_min && (
            <p className="text-destructive text-sm mt-1">{errors.duration_min.message}</p>
          )}
        </div>
      </div>

      {/* Empresa */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Empresa
        </label>
        <input
          {...register('empresa', { required: 'Empresa obrigatória' })}
          type="text"
          placeholder="Nome da empresa"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
        />
        {errors.empresa && (
          <p className="text-destructive text-sm mt-1">{errors.empresa.message}</p>
        )}
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Salvando...' : demanda ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
}
