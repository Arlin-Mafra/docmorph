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
  const [profileData, setProfileData] = useState<any>(null); // Store full profile data including is_pro

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

        if (data) {
          setProfileData(data);
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

  const handleAvatarClick = () => {
    document.getElementById('avatar-input')?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      // Use a fixed name or timestamp to avoid collisions if we were using a shared folder, 
      // but inside user folder it's fine.
      const fileName = `${user.id}/avatar_${new Date().getTime()}.${fileExt}`;
      const filePath = `${fileName}`;

      setSaving(true);

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(`avatars/${filePath}`, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(`avatars/${filePath}`);

      setAvatarUrl(publicUrl);

      // 3. Update Profile immediately in DB
      if (user) {
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
      }

    } catch (error: any) {
      console.error(error);
      alert('Erro ao carregar imagem: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full text-slate-900 dark:text-white hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
        </button>
        <h1 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Informações da Conta</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 px-5 pb-32 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center py-8">
          <input
            type="file"
            id="avatar-input"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-soft bg-slate-200 bg-center bg-cover transition-transform hover:scale-105"
              style={{ backgroundImage: `url("${avatarUrl || 'https://via.placeholder.com/150'}")` }}
            />
            <div className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center hover:bg-primary-dark transition-colors">
              <span className="material-symbols-outlined text-[20px]">photo_camera</span>
            </div>
          </div>
          <button className="mt-4 text-primary font-bold text-sm hover:underline" onClick={handleAvatarClick}>Alterar foto de perfil</button>
        </div>

        <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Nome Completo</label>
              <div className="relative">
                <input
                  className="w-full h-12 pl-4 pr-11 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-base font-semibold focus:ring-2 focus:ring-primary transition-all text-slate-900 dark:text-white"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Seu nome"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">person</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">E-mail</label>
              <div className="relative">
                <input
                  className="w-full h-12 pl-4 pr-11 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-base font-semibold text-slate-500 cursor-not-allowed"
                  value={user?.email || ''}
                  readOnly
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">mail</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assinatura Atual</p>
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-xl text-slate-900 dark:text-white">
                  {profileData?.is_pro ? 'Plano Premium' : 'Plano Gratuito'}
                </span>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${profileData?.is_pro ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-slate-700 text-slate-500'}`}>
                  {profileData?.is_pro ? 'PRO' : 'BÁSICO'}
                </span>
              </div>
              {!profileData?.is_pro && (
                <button
                  onClick={() => navigate(AppRoute.PAYMENT)}
                  className="text-xs font-bold text-primary mt-2 hover:underline flex items-center gap-1"
                >
                  Fazer upgrade agora
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              )}
            </div>
            <div className={`rounded-full p-3 ${profileData?.is_pro ? 'bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg shadow-primary/30' : 'bg-gray-100 dark:bg-slate-700 text-slate-400'}`}>
              <span className="material-symbols-outlined text-[28px] filled">diamond</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 divide-y dark:divide-slate-700 overflow-hidden">
            <button onClick={() => navigate(AppRoute.CHANGE_PASSWORD)} className="w-full flex items-center justify-between p-5 group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">Alterar Senha</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button className="w-full flex items-center justify-between p-5 group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">devices</span>
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">Dispositivos</span>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center justify-between p-5 group hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <span className="font-bold text-base text-red-600 dark:text-red-400">Sair da conta</span>
              </div>
              <span className="material-symbols-outlined text-red-300">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8 pb-8 px-5 z-20">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Salvando...
              </>
            ) : (
              <>
                Salvar Alterações
                <span className="material-symbols-outlined">check</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;
