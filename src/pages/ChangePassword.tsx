
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col p-6 h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="flex items-center mb-6 pt-4">
        <button onClick={() => navigate(-1)} className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="flex-1 text-center pr-10 font-bold text-lg">Alterar Senha</h2>
      </header>

      <main className="flex-1 flex flex-col gap-8 no-scrollbar">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-[32px]">lock_reset</span>
          </div>
          <h2 className="font-bold text-lg">Defina uma nova senha</h2>
          <p className="text-slate-500 text-sm mt-1 max-w-[280px]">Sua nova senha deve ser diferente das anteriores.</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft space-y-5">
          {['Senha Atual', 'Nova Senha', 'Confirmar Nova Senha'].map((label) => (
            <div key={label} className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>
              <div className="relative">
                <input className="w-full h-12 pl-4 pr-12 rounded-lg bg-gray-50 dark:bg-slate-900 border-none font-medium" placeholder={`Digite sua ${label.toLowerCase()}`} type="password" />
                <button className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Requisitos de segurança</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
              Mínimo de 8 caracteres
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">check_circle</span>
              Pelo menos um número
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-300 text-[18px]">check_circle</span>
              Pelo menos um caractere especial
            </li>
          </ul>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full p-6 pb-8 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8">
        <button onClick={() => navigate(-1)} className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          <span>Salvar Nova Senha</span>
          <span className="material-symbols-outlined">check</span>
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
