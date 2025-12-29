import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { supabase } from '../lib/supabase';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [fullname, setFullname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate(AppRoute.LOGIN);
          return;
        }

        setUser(user);

        let { data, error } = await supabase
          .from('profiles')
          .select(`full_name, avatar_url, is_pro`)
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn(error);
        }

        // If profile doesn't exist, use metadata or empty strings.
        // The handle_new_user trigger in SQL schema should have created it, but good to be safe.
        if (data) {
          setFullname(data.full_name || user.user_metadata?.full_name || '');
          setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || '');
        } else {
          setFullname(user.user_metadata?.full_name || '');
          setAvatarUrl(user.user_metadata?.avatar_url || '');
        }

      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from('profiles').upsert({
        id: user?.id,
        full_name: fullname,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      alert('Perfil atualizado com sucesso!');
    } catch (error: any) {
      alert('Erro ao atualizar perfil: ' + (error.message || 'Erro desconhecido'));
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(AppRoute.LOGIN);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Informações da Conta</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 px-5 pb-32 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center py-6">
          <div className="relative group cursor-pointer">
            <div
              className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-soft bg-slate-200 bg-center bg-cover"
              style={{ backgroundImage: `url("${avatarUrl || 'https://via.placeholder.com/150'}")` }}
            />
            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white dark:border-slate-800">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </div>
          </div>
          <button className="mt-3 text-primary font-bold text-sm">Alterar foto</button>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Nome Completo</label>
              <div className="relative">
                <input
                  className="w-full h-12 pl-4 pr-11 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-base font-semibold focus:ring-2 focus:ring-primary"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">E-mail</label>
              <div className="relative">
                <input
                  className="w-full h-12 pl-4 pr-11 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-base font-semibold text-slate-500 cursor-not-allowed"
                  value={user?.email || ''}
                  readOnly
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assinatura</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Plano Free</span>
                <span className="bg-gray-100 dark:bg-slate-700 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">BÁSICO</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Upgrade para Pro</p>
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 rounded-full p-2.5">
              <span className="material-symbols-outlined text-slate-400 text-[24px]">diamond</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft divide-y dark:divide-slate-700">
            <button onClick={() => navigate(AppRoute.CHANGE_PASSWORD)} className="w-full flex items-center justify-between p-5 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <span className="font-bold text-base">Alterar Senha</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between p-5 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">devices</span>
                </div>
                <span className="font-bold text-base">Dispositivos</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <span className="font-bold text-base text-red-600 dark:text-red-400">Sair da conta</span>
              </div>
              <span className="material-symbols-outlined text-red-300">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full max-w-md bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8 pb-8 px-5">
        <button
          onClick={handleSave}
          className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
          {!saving && <span className="material-symbols-outlined">check</span>}
        </button>
      </div>
    </div>
  );
};
export default Profile;
