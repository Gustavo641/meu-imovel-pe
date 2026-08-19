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

      setTimeout(() => {
        onSwitchToLogin?.();
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
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl shadow-elevated border border-border">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-display font-bold mb-2 text-foreground">Cadastro Realizado!</h2>
          <p className="text-muted-foreground mb-4">
            Verifique seu email para confirmar sua conta.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecionando em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl shadow-elevated border border-border">
      <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
        Criar Conta
      </h1>
      <p className="text-muted-foreground text-sm mb-6">Junte-se ao CRM DO CORRETOR</p>

      {error && (
        <div className="mb-4 p-4 bg-destructive bg-opacity-10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-base mb-2">Nome Completo</label>
          <input
            {...register('name', { required: 'Nome é obrigatório' })}
            type="text"
            className="input-base"
            placeholder="Seu nome"
            disabled={isLoading}
          />
          {errors.name && <span className="text-destructive text-sm mt-1 block">{errors.name.message}</span>}
        </div>

        <div>
          <label className="label-base mb-2">Email</label>
          <input
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email inválido'
              }
            })}
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
            {...register('password', {
              required: 'Senha é obrigatória',
              minLength: {
                value: 6,
                message: 'Mínimo 6 caracteres'
              }
            })}
            type="password"
            className="input-base"
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
          />
          {errors.password && <span className="text-destructive text-sm mt-1 block">{errors.password.message}</span>}
        </div>

        <div>
          <label className="label-base mb-2">Confirmar Senha</label>
          <input
            {...register('confirmPassword', {
              required: 'Confirmação é obrigatória',
              validate: (value) => value === password || 'As senhas não conferem'
            })}
            type="password"
            className="input-base"
            placeholder="Repita a senha"
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className="text-destructive text-sm mt-1 block">{errors.confirmPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Já tem conta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:text-primary-glow font-medium transition-colors"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
}
