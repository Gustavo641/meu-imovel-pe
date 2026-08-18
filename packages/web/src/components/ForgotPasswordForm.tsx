import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../services/supabase';

interface ForgotPasswordFormProps {
  onSwitchToLogin?: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin }: ForgotPasswordFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl shadow-elevated border border-border">
        <div className="text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-2xl font-display font-bold mb-2 text-foreground">Email Enviado!</h2>
          <p className="text-muted-foreground mb-4">
            Verifique seu email para receber as instruções de redefinição de senha.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Não esqueca de verificar a pasta de spam! 📨
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full btn-primary py-2 rounded-lg font-medium"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-2xl shadow-elevated border border-border">
      <h1 className="text-3xl font-display font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
        Recuperar Senha
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        Digite seu email e você receberá um link para redefinir sua senha.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-destructive bg-opacity-10 border border-destructive rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-primary hover:text-primary-glow font-medium transition-colors"
        >
          ← Voltar ao Login
        </button>
      </div>
    </div>
  );
}
