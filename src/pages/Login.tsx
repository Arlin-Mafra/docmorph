
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        onLogin();
        navigate(AppRoute.DASHBOARD);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar">
      <div className="mb-8 text-center pt-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow text-white">
          <span className="material-symbols-outlined text-4xl">description</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Bem-vindo de volta</h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">Gerencie seus documentos em um só lugar.</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-gray-200">E-mail</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 material-symbols-outlined">mail</span>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full rounded-2xl border border-gray-200 bg-white dark:bg-slate-700 dark:border-slate-600 py-4 pl-12 pr-4 text-base text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              placeholder="seu@email.com"
              type="email"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-900 dark:text-gray-200">Senha</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-slate-500 material-symbols-outlined">lock</span>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full rounded-2xl border border-gray-200 bg-white dark:bg-slate-700 dark:border-slate-600 py-4 pl-12 pr-12 text-base text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
              placeholder="••••••••"
              type="password"
            />
            <button className="absolute right-4 text-slate-500 hover:text-primary transition-colors" type="button">
              <span className="material-symbols-outlined">visibility_off</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(AppRoute.FORGOT_PASSWORD)}
            className="text-sm font-medium text-slate-500 hover:text-primary transition-colors"
          >
            Esqueceu sua senha?
          </button>
        </div>

        <button
          className="mt-2 w-full rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-soft transition-transform active:scale-[0.98] hover:bg-primary-dark disabled:opacity-70 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-slate-800 px-2 text-slate-500">Ou continue com</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 border border-gray-200 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 transition-colors">
            <img alt="Google" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7jlf6a3_PbOsRhExAb6ZkUWWuFCro3d-ZjMgb1GaDzVZbZfMcPD1zBcAgmCVkuLCr_kS2pnFgAxSZbh-9bUeuAzmIRORow_yGosUh_L4Gfx8Dg-_dMiWQSGpaREdaFnEFSUvEDjctACf97ioIMhsDA57qfP9-Wu1o_Y1-dj4PMqNdfGicY3iGKLqykogEdvOq21npJA8C6tRcq-EYekyiW9mUpS1ZuTdtlj1AM4J5fTyLQES-WLwmSMZkr1HYLg61C6uury4Nbz8" />
            <span>Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-slate-700 dark:border-slate-600 border border-gray-200 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined text-[20px]">ios</span>
            <span>Apple</span>
          </button>
        </div>
      </div>

      <div className="mt-8 text-center pb-8">
        <p className="text-sm text-slate-500">
          Não tem uma conta?
          <button
            onClick={() => navigate(AppRoute.REGISTER)}
            className="ml-1 font-semibold text-primary hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
