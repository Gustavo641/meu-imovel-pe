import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateDocumentoDTO } from '../hooks/useDocumentos';

interface DocumentoFormProps {
  onSubmit: (data: CreateDocumentoDTO) => void;
  isLoading?: boolean;
}

const TIPOS = [
  { value: 'contrato', label: '📋 Contrato' },
  { value: 'proposta', label: '📊 Proposta' },
  { value: 'briefing', label: '📝 Briefing' },
  { value: 'marketing', label: '🎯 Marketing' },
  { value: 'financeiro', label: '💰 Financeiro' },
];

export function DocumentoForm({ onSubmit, isLoading }: DocumentoFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CreateDocumentoDTO>({
    defaultValues: {
      nome: '',
      tipo: 'contrato',
      file: null,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValue('file', file);
    }
  };

  const handleSubmitForm = (data: any) => {
    if (!data.file) {
      alert('Selecione um arquivo');
      return;
    }
    onSubmit({
      nome: data.nome,
      tipo: data.tipo,
      file: data.file,
    });
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const file = watch('file');

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Nome do Documento
        </label>
        <input
          {...register('nome', { required: 'Nome obrigatório' })}
          type="text"
          placeholder="Ex: Contrato de Venda"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
        />
        {errors.nome && (
          <p className="text-destructive text-sm mt-1">{errors.nome.message}</p>
        )}
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Tipo de Documento
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

      {/* Upload File */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Arquivo (PDF, DOC, XLS, JPG, PNG)
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-all">
          <input
            ref={fileInputRef}
            {...register('file')}
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
          >
            <p className="text-3xl mb-2">📁</p>
            {fileName ? (
              <>
                <p className="text-foreground font-semibold">{fileName}</p>
                <p className="text-muted-foreground text-sm">Clique para trocar</p>
              </>
            ) : (
              <>
                <p className="text-foreground font-semibold">Clique ou arraste o arquivo</p>
                <p className="text-muted-foreground text-sm">Máximo 50MB</p>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={isLoading || !fileName}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Enviando...' : '📤 Enviar Documento'}
      </button>
    </form>
  );
}
