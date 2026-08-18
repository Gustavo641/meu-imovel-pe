import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from '../services/supabase';
import { useAuthStore } from '../hooks/useAuth';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSwitchToSignup?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export function LoginForm({ onSwitchToSignup, onSwitchToForgotPassword }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initAuth = useAuthStore((state) => state.initAuth);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn(data.email, data.password);
      await initAuth();
    } catch (err) {
      setError(String(err).includes('Invalid login credentials')
        ? 'Email ou senha inválidos'
        : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <h1 className="text-2xl font-bold mb-2 text-white">Meu Imóvel.PE</h1>
      <p className="text-gray-400 text-sm mb-6">CRM Imobiliário Profissional</p>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-600 text-red-100 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Email</label>
          <input
            {...register('email', { required: 'Email é obrigatório' })}
            type="email"
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="seu@email.com"
            disabled={isLoading}
          />
          {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Senha</label>
          <input
            {...register('password', { required: 'Senha é obrigatória' })}
            type="password"
            className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="Sua senha"
            disabled={isLoading}
          />
          {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Links de Ação */}
      <div className="mt-6 space-y-2 text-center">
        <button
          onClick={onSwitchToForgotPassword}
          className="block w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
        >
          Esqueci minha senha
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>
        <button
          onClick={onSwitchToSignup}
          className="block w-full text-sm text-blue-600 hover:text-blue-700 font-medium py-2"
        >
          Criar nova conta
        </button>
      </div>
    </div>
  );
}
