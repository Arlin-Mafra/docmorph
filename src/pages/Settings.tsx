
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import BottomNav from '../components/BottomNav';
import { supabase } from '../lib/supabase';

interface SettingsProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ darkMode, onToggleTheme, onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data) setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching settings data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate(AppRoute.WELCOME);
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Usuário';
  const displayEmail = user?.email || '';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://via.placeholder.com/150';
  const isPro = profile?.is_pro || false;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-slate-700 dark:text-white">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1 text-center pr-10 text-slate-900 dark:text-white">Configurações</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">
        {/* Profile Card */}
        <section onClick={() => navigate(AppRoute.PROFILE)} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-soft flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all border border-transparent dark:border-slate-700">
          <div className="relative shrink-0">
            <div
              className="size-16 rounded-full bg-cover bg-center border-2 border-primary/20 bg-slate-200"
              style={{ backgroundImage: `url("${avatarUrl}")` }}
            />
            {isPro && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-800">PRO</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold leading-tight truncate text-slate-900 dark:text-white">{loading ? 'Carregando...' : displayName}</h2>
            <p className="text-sm text-slate-500 truncate">{loading ? '...' : displayEmail}</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">edit</span>
        </section>

        {/* Group: Account */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Conta</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden divide-y dark:divide-slate-700 border border-transparent dark:border-slate-700">
            {[
              { label: 'Informações Pessoais', icon: 'person', route: AppRoute.PROFILE },
              { label: 'Segurança e Senha', icon: 'lock', route: AppRoute.CHANGE_PASSWORD },
              //{ label: 'Sincronização', icon: 'cloud_sync', status: 'Ativo' } // Removing this mock for now as it doesn't exist
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
                  <span className="font-medium text-sm text-slate-900 dark:text-white">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* {item.status && <span className="text-xs text-slate-500">{item.status}</span>} */}
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group: Plan */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Plano</h3>
          <div className="space-y-3">
            <div className={`rounded-xl p-[1px] ${isPro ? 'bg-gradient-to-r from-green-500/50 to-emerald-500/50' : 'bg-gradient-to-r from-primary/50 to-blue-500/50'}`}>
              <div onClick={() => navigate(AppRoute.PAYMENT)} className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between h-full">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center size-9 rounded-full text-white shadow-sm ${isPro ? 'bg-green-500' : 'bg-gradient-to-br from-primary to-blue-600'}`}>
                    <span className="material-symbols-outlined text-[20px]">{isPro ? 'verified' : 'diamond'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${isPro ? 'text-green-600 dark:text-green-400' : 'text-primary'}`}>
                      {isPro ? 'Assinatura Premium' : 'Fazer Upgrade'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {isPro ? 'Sua conta é PRO' : 'Desbloqueie todos os recursos'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </div>
            </div>

            <div onClick={() => navigate(AppRoute.PAYMENT_HISTORY)} className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between border border-transparent dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500">
                  <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                </div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">Histórico de Pagamentos</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Group: Preferences */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-2">Preferências</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden divide-y dark:divide-slate-700 border border-transparent dark:border-slate-700">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[20px]">language</span>
                </div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">Idioma</span>
              </div>
              <span className="text-xs text-slate-500">Português (BR)</span>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[20px]">dark_mode</span>
                </div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">Modo Escuro</span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={onToggleTheme}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 dark:bg-slate-600 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Support */}
        <div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft overflow-hidden divide-y dark:divide-slate-700 border border-transparent dark:border-slate-700">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-9 rounded-full bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[20px]">help</span>
                </div>
                <span className="font-medium text-sm text-slate-900 dark:text-white">Central de Ajuda</span>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-[20px]">open_in_new</span>
            </div>
            <div onClick={handleLogout} className="flex items-center justify-between p-4 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
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
