import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';

export interface Documento {
  id: string;
  nome: string;
  tipo: 'contrato' | 'proposta' | 'briefing' | 'marketing' | 'financeiro';
  url: string;
  tamanho: number;
  criado_por: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentoDTO {
  nome: string;
  tipo: 'contrato' | 'proposta' | 'briefing' | 'marketing' | 'financeiro';
  file: File;
}

export function useDocumentos() {
  const queryClient = useQueryClient();

  // Fetch documentos
  const { data: documentos = [], isLoading, error } = useQuery({
    queryKey: ['documentos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Upload documento
  const uploadMutation = useMutation({
    mutationFn: async (dto: CreateDocumentoDTO) => {
      const fileName = `${Date.now()}-${dto.file.name}`;

      // Upload file to storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documentos')
        .upload(fileName, dto.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documentos')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { data, error } = await supabase
        .from('documents')
        .insert([
          {
            nome: dto.nome,
            tipo: dto.tipo,
            url: urlData.publicUrl,
            tamanho: dto.file.size,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });

  // Delete documento
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const documento = documentos.find((d) => d.id === id);
      if (!documento) throw new Error('Documento não encontrado');

      // Delete from storage
      const fileName = documento.url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('documentos').remove([fileName]);
      }

      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    },
  });

  return {
    documentos,
    isLoading,
    error,
    uploadDocumento: uploadMutation.mutate,
    deleteDocumento: deleteMutation.mutate,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
