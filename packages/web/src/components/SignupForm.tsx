import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signUp } from '../services/supabase';
import { useAuthStore } from '../hooks/useAuth';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  onSignupSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSignupSuccess, onSwitchToLogin }: SignupFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const initAuth = useAuthStore((state) => state.initAuth);

  const password = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await signUp(data.email, data.password, data.name);

      setSuccess(true);
      await initAuth();

      setTimeout(() => {
        onSignupSuccess?.();
      }, 2000);
    } catch (err) {
      setError(String(err).includes('already registered')
        ? 'Este email já está registrado'
        : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">Cadastro Realizado!</h2>
          <p className="text-gray-600 mb-4">
            Verifique seu email para confirmar sua conta.
          </p>
          <p className="text-sm text-gray-500">
            Redirecionando em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Criar Conta</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome Completo</label>
          <input
            {...register('name', { required: 'Nome é obrigatório' })}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Seu nome"
            disabled={isLoading}
          />
          {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido'
              }
            })}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="seu@email.com"
            disabled={isLoading}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            {...register('password', {
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres'
              }
            })}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
          <input
            {...register('confirmPassword', {
              required: 'Confirmação é obrigatória',
              validate: (value) => value === password || 'As senhas não conferem'
            })}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Repita a senha"
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Já tem conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
