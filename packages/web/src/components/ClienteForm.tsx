import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreateClienteDTO, Cliente } from '../hooks/useClientes';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: CreateClienteDTO) => void;
  isLoading?: boolean;
}

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PE', 'PI', 'RJ', 'RN', 'RS',
  'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function ClienteForm({ cliente, onSubmit, isLoading }: ClienteFormProps) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreateClienteDTO>({
    defaultValues: cliente || {
      razao_social: '',
      email: '',
      telefone: '',
      cidade: '',
      estado: '',
    },
  });

  const telefone = watch('telefone');
  
  // Validar telefone: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
  const validateTelefone = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length !== 11) return 'Telefone inválido (DDD + 8-9 dígitos)';
    const areaCode = clean.substring(0, 2);
    const firstDigit = clean.substring(2, 3);
    if (firstDigit !== '9' && clean.length === 11) return 'Número deve começar com 9';
    return true;
  };

  const formatTelefone = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 11) {
      return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
    }
    return value;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Razão Social */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Razão Social
        </label>
        <input
          {...register('razao_social', { required: 'Razão social obrigatória' })}
          type="text"
          placeholder="Nome da empresa"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
        />
        {errors.razao_social && (
          <p className="text-destructive text-sm mt-1">{errors.razao_social.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <input
          {...register('email', {
            required: 'Email obrigatório',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email inválido',
            },
          })}
          type="email"
          placeholder="empresa@email.com"
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
        />
        {errors.email && (
          <p className="text-destructive text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Telefone com validação */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Telefone (DDD + 8-9 dígitos)
        </label>
        <input
          {...register('telefone', {
            required: 'Telefone obrigatório',
            validate: validateTelefone,
          })}
          type="tel"
          placeholder="(85) 98765-4321"
          onChange={(e) => {
            e.target.value = formatTelefone(e.target.value);
          }}
          className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
        />
        {errors.telefone && (
          <p className="text-destructive text-sm mt-1">{errors.telefone.message}</p>
        )}
      </div>

      {/* Cidade e Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Cidade
          </label>
          <input
            {...register('cidade', { required: 'Cidade obrigatória' })}
            type="text"
            placeholder="Recife"
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          />
          {errors.cidade && (
            <p className="text-destructive text-sm mt-1">{errors.cidade.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Estado
          </label>
          <select
            {...register('estado', { required: 'Estado obrigatório' })}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            <option value="">Selecione</option>
            {ESTADOS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          {errors.estado && (
            <p className="text-destructive text-sm mt-1">{errors.estado.message}</p>
          )}
        </div>
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? 'Salvando...' : cliente ? 'Atualizar' : 'Criar'}
      </button>
    </form>
  );
}
