
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col p-6 h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="flex items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center pr-10 font-bold text-lg">Esqueceu a Senha?</h2>
      </header>

      <main className="flex-1 flex flex-col gap-8 no-scrollbar">
        <div className="flex flex-col items-center py-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
            <span className="material-symbols-outlined text-[40px]">mark_email_unread</span>
          </div>
          <h2 className="font-bold text-xl mb-2">Recupere sua conta</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[280px]">Digite o e-mail cadastrado e enviaremos as instruções para redefinir sua senha.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft">
            <label className="text-sm font-bold text-slate-700 dark:text-gray-300 block mb-2 px-1">E-mail</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined">mail</span>
              <input className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none font-medium" placeholder="exemplo@email.com" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4 flex gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">info</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              Verifique sua caixa de entrada e spam. O link expira em 24 horas.
            </p>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full p-6 pb-8 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8">
        <button onClick={() => navigate(AppRoute.LOGIN)} className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          <span>Enviar Instruções</span>
          <span className="material-symbols-outlined text-[20px]">send</span>
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
