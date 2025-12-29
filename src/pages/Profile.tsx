
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();

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
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD8l7goEDW-YhcN_EnSduJCz4Yio9aucIYso5Gcg_vF0q5JhVCLTy1HfudT1-zPo9ic2luXt_lR7a-ZIdY8bdPgC0WWgu5cIaW0FgC9Klnz5LJ4a9jcP53AmmyLpWrYU2R5LSFMKXHXRz-FF2JUhdyJgr2WayPoOhL5-EIPY2yomB-PTT4yKdBhhTWnTu3FCSpoBL2jJjctFYrr5kFT79sYX-UJ6BE5sBZY4K7kjFErSQC8OwvRuGduX-VU7ebfDWoE2td_1-zdidE")' }}
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
                <input className="w-full h-12 pl-4 pr-11 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-base font-semibold" value="Maria Silva" readOnly />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">E-mail</label>
              <div className="relative">
                <input className="w-full h-12 pl-4 pr-11 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-base font-semibold" value="maria.silva@exemplo.com" readOnly />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-soft flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assinatura</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Plano Pro</span>
                <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold border border-primary/20">ATIVO</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Renova em 12 Ago, 2024</p>
            </div>
            <div className="bg-gradient-to-br from-primary to-blue-400 rounded-full p-2.5 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-[24px]">diamond</span>
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
          </div>

          <button className="text-red-500 font-bold text-sm mx-auto mt-4 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Excluir minha conta
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 w-full max-w-md bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8 pb-8 px-5">
        <button onClick={() => navigate(-1)} className="w-full h-14 bg-primary text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
          Salvar Alterações
          <span className="material-symbols-outlined">check</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
