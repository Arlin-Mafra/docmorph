
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // User is logged in automatically (email confirmation disabled or not required)
        navigate(AppRoute.DASHBOARD);
      } else if (data.user) {
        // User created but needs to confirm email
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl">mark_email_read</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Verifique seu e-mail</h2>
        <p className="text-slate-500 mb-8">Enviamos um link de confirmação para <b>{email}</b>. Por favor, verifique sua caixa de entrada para ativar sua conta.</p>
        <button
          onClick={() => navigate(AppRoute.LOGIN)}
          className="w-full max-w-sm h-14 bg-primary text-white font-bold rounded-xl"
        >
          Voltar para o Login
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar">
      <header className="flex items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center pr-10 font-bold text-lg">Criar Conta</h2>
      </header>

      <div className="pt-6 pb-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Vamos começar</h1>
        <p className="text-slate-500 text-base">Gerencie seus documentos com facilidade e segurança.</p>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-5 mt-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">E-mail</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined">mail</span>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
              placeholder="exemplo@email.com"
              type="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Senha</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined">lock</span>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
              placeholder="Digite sua senha"
              type="password"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" type="button">
              <span className="material-symbols-outlined">visibility_off</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Confirmar Senha</label>
          <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 material-symbols-outlined">verified_user</span>
            <input
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
              placeholder="Repita sua senha"
              type="password"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" type="button">
              <span className="material-symbols-outlined">visibility_off</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Cadastrar'}
        </button>
      </form>

      <div className="relative my-10 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="mx-4 text-sm font-medium text-slate-500">Ou continue com</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm">
          <img alt="Google" className="h-5 w-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMNEepVVFjYMiR1oFQqRRZNBDeEeCKqM3vysQl0QiDBL2Cn1Ojuf_0gtr7WRtdyZ8Ip8OfZ-S0JSC8QRZ8JBOdgVgYr7vJazEs9MJtIsNYC9z6Kjo1c-uO7QcjXA5XfTOiOH7Yast7IKVRVxxHbfbsLaZ6dMhZci8jMRCHUCp1EIzVUrQmFpKX2BHoBhSBby9kbdPXEI4SABiGXRPVptJqjBeYj4PZUj3XjreNlej6guRoPwnzxydl8SJ59E5rE6PdbOpACyGwVK4" />
          <span className="text-sm font-semibold">Google</span>
        </button>
        <button className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[24px]">ios</span>
          <span className="text-sm font-semibold">Apple</span>
        </button>
      </div>

      <div className="mt-auto pt-10 text-center pb-8">
        <p className="text-sm font-medium text-slate-500">
          Já tem uma conta?
          <button onClick={() => navigate(AppRoute.LOGIN)} className="ml-1 font-bold text-primary">Entrar</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
