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
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl shadow-elevated border border-border">
      <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
        CRM DO CORRETOR
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Gestão de Vendas Profissional</p>

      {error && (
        <div className="mb-4 p-4 bg-destructive bg-opacity-10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-base mb-2">Email</label>
          <input
            {...register('email', { required: 'Email é obrigatório' })}
            type="email"
            className="input-base"
            placeholder="seu@email.com"
            disabled={isLoading}
          />
          {errors.email && <span className="text-destructive text-sm mt-1 block">{errors.email.message}</span>}
        </div>

        <div>
          <label className="label-base mb-2">Senha</label>
          <input
            {...register('password', { required: 'Senha é obrigatória' })}
            type="password"
            className="input-base"
            placeholder="Sua senha"
            disabled={isLoading}
          />
          {errors.password && <span className="text-destructive text-sm mt-1 block">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {/* Links de Ação */}
      <div className="mt-6 space-y-4 text-center">
        <button
          onClick={onSwitchToForgotPassword}
          className="block w-full text-sm text-primary hover:text-primary-glow font-medium py-2 transition-colors"
        >
          Esqueci minha senha
        </button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">ou</span>
          </div>
        </div>
        <button
          onClick={onSwitchToSignup}
          className="block w-full text-sm text-primary hover:text-primary-glow font-medium py-2 transition-colors"
        >
          Criar nova conta
        </button>
      </div>
    </div>
  );
}
