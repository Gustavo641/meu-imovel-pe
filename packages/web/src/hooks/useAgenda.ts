import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'demanda' | 'evento' | 'follow_up' | 'reuniao';
  start_time: string;
  duration_min: number;
  status: 'pendente' | 'concluida';
  resultado?: string;
  prioridade: 'urgente' | 'alta' | 'media' | 'baixa';
  empresa: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDemandaDTO {
  titulo: string;
  descricao: string;
  tipo: 'demanda' | 'evento' | 'follow_up' | 'reuniao';
  start_time: string;
  duration_min: number;
  prioridade: 'urgente' | 'alta' | 'media' | 'baixa';
  empresa: string;
}

export function useAgenda() {
  const queryClient = useQueryClient();

  // Fetch demandas
  const { data: demandas = [], isLoading, error } = useQuery({
    queryKey: ['agenda'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Create demanda
  const createMutation = useMutation({
    mutationFn: async (dto: CreateDemandaDTO) => {
      const { data, error } = await supabase
        .from('activities')
        .insert([dto])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
    },
  });

  // Update demanda
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<CreateDemandaDTO>) => {
      const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
    },
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pendente' | 'concluida' }) => {
      const { error } = await supabase
        .from('activities')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
    },
  });

  // Delete demanda
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agenda'] });
    },
  });

  return {
    demandas,
    isLoading,
    error,
    createDemanda: createMutation.mutate,
    updateDemanda: updateMutation.mutate,
    updateStatus: updateStatusMutation.mutate,
    deleteDemanda: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
