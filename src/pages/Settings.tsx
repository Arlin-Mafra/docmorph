
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import BottomNav from '../components/BottomNav';

interface SettingsProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onToggleTheme, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate(AppRoute.WELCOME);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-10">Configurações</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">
        {/* Profile Card */}
        <section onClick={() => navigate(AppRoute.PROFILE)} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-soft flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all">
          <div className="relative shrink-0">
            <div 
              className="size-16 rounded-full bg-cover bg-center border-2 border-primary/20" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAd5sT1flEESNrLWOKIgeTUMcGv0CcxpzYUzBEBCOan-lyM0MBKx9zN8ZcDGQ-qVxFMT72PMoLh90BoUkUYO2ZywuyN3xyP39dOU6yeHBA7dF5oAtvNZWCnjcLtzzNSZcKN2m-M45LsLM33o_KXNU7oThNlrk3SYdbwilUWpl3y-ajbdC78JrchiwxgY721Sz0WTlX1WtgcoNi_Occ0z4qqbjHbbsh8gh6msNDeWcvRo3yxxhk3B1_fmcFOeUt4G_ZYdmQaGK7hcoY")' }}
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-800">PRO</div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold leading-tight truncate">João Silva</h2>
            <p className="text-sm text-slate-500 truncate">joao.silva@exemplo.com</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">edit</span>
        </section>

        {/* Group: Account */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Conta</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden divide-y dark:divide-slate-700">
            {[
              { label: 'Informações Pessoais', icon: 'person', route: AppRoute.PROFILE },
              { label: 'Segurança e Senha', icon: 'lock', route: AppRoute.CHANGE_PASSWORD },
              { label: 'Sincronização', icon: 'cloud_sync', status: 'Ativo' }
            ].map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => item.route && navigate(item.route)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-9 rounded-full bg-blue-50 dark:bg-blue-900/20 text-primary">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.status && <span className="text-xs text-slate-500">{item.status}</span>}
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group: Plan */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Plano</h3>
          <div className="bg-gradient-to-r from-primary/10 to-transparent p-[1px] rounded-xl">
            <div onClick={() => navigate(AppRoute.PAYMENT)} className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">diamond</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-primary">Gerenciar Assinatura</span>
                  <span className="text-[10px] text-slate-500">Premium até Out 2024</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Group: Preferences */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Preferências</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden divide-y dark:divide-slate-700">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[20px]">language</span>
                </div>
                <span className="font-medium text-sm">Idioma</span>
              </div>
              <span className="text-xs text-slate-500">Português (BR)</span>
            </div>
            
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                </div>
                <span className="font-medium text-sm">Modo Escuro</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={onToggleTheme} 
                  className="peer sr-only" 
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Support */}
        <div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden divide-y dark:divide-slate-700">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-700">
                  <span className="material-symbols-outlined text-[20px]">help</span>
                </div>
                <span className="font-medium text-sm">Central de Ajuda</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">open_in_new</span>
            </div>
            <div onClick={handleLogout} className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <span className="font-bold text-sm text-red-500">Sair da Conta</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pb-4">
          <p className="text-xs text-slate-400">Versão 2.4.0 (Build 304)</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Settings;
