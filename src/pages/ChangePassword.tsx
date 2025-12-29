
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { supabase } from '../lib/supabase';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      } else {
        navigate(AppRoute.LOGIN);
      }
    };
    getUser();
  }, [navigate]);

  const handleChangePassword = async () => {
    setError(null);
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      // 1. Verify current password by re-authenticating
      if (userEmail) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: currentPassword
        });

        if (signInError) {
          throw new Error('Senha atual incorreta.');
        }
      }

      // 2. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      alert('Senha alterada com sucesso!');
      navigate(-1);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="flex items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center pr-10 font-bold text-lg">Alterar Senha</h2>
      </header>

      <main className="flex-1 flex flex-col gap-8 no-scrollbar overflow-y-auto pb-24">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-[32px]">lock_reset</span>
          </div>
          <h2 className="font-bold text-lg">Defina uma nova senha</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-[280px]">Sua nova senha deve ser diferente das anteriores.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Senha Atual</label>
            <div className="relative">
              <input
                className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-50 dark:bg-slate-900 border-none font-medium"
                placeholder="Digite sua senha atual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Nova Senha</label>
            <div className="relative">
              <input
                className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-50 dark:bg-slate-900 border-none font-medium"
                placeholder="Digite sua nova senha"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-50 dark:bg-slate-900 border-none font-medium"
                placeholder="Confirme sua nova senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Requisitos de segurança</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[18px] ${newPassword.length >= 6 ? 'text-green-500' : 'text-slate-300'}`}>check_circle</span>
              Mínimo de 6 caracteres
            </li>
            <li className="flex items-center gap-2">
              <span className={`material-symbols-outlined text-[18px] ${newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-500' : 'text-slate-300'}`}>check_circle</span>
              Senhas coincidem
            </li>
          </ul>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full p-6 pb-8 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8">
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span>{loading ? 'Salvando...' : 'Salvar Nova Senha'}</span>
          {!loading && <span className="material-symbols-outlined">check</span>}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

