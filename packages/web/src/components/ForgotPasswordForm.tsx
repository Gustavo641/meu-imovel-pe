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
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="text-5xl mb-4">📧</div>
          <h2 className="text-xl font-bold mb-2">Email Enviado!</h2>
          <p className="text-gray-600 mb-4">
            Verifique seu email para receber as instruções de redefinição de senha.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Não esquece de verificar a pasta de spam! 📨
          </p>
          <button
            onClick={onSwitchToLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">Recuperar Senha</h1>
      <p className="text-gray-600 text-sm mb-6">
        Digite seu email e você receberá um link para redefinir sua senha.
      </p>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 font-medium"
        >
          {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Voltar ao Login
        </button>
      </div>
    </div>
  );
}
