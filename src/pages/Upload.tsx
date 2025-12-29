
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import BottomNav from '../components/BottomNav';

const Upload: React.FC = () => {
  const navigate = useNavigate();

  const handleFileSelect = () => {
    // Determine input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Check auth
        const { data: { user } } = await import('../lib/supabase').then(m => m.supabase.auth.getUser());
        if (!user) {
          alert('Faça login para fazer upload.');
          navigate(AppRoute.LOGIN);
          return;
        }

        // Show loading or something (simplified for now)
        alert('Enviando arquivo...');

        const { FileService } = await import('../services/files');
        await FileService.uploadFile(file, user.id);

        alert('Arquivo enviado com sucesso!');
        navigate(AppRoute.CONFIG);

      } catch (error: any) {
        console.error(error);
        alert('Erro no upload: ' + error.message);
      }
    };
    input.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <header className="flex items-center bg-white dark:bg-slate-800 p-4 justify-between border-b border-gray-100 dark:border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-900 dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">Converter PDF</h2>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-24">
        <div className="flex flex-col flex-1 justify-center min-h-[400px]">
          <div
            onClick={handleFileSelect}
            className="relative group cursor-pointer flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-6 py-12 shadow-soft transition-all duration-300 hover:border-primary hover:shadow-lg"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <span className="material-symbols-outlined text-[200px]">description</span>
            </div>
            <div className="relative z-10 flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[40px]">cloud_upload</span>
            </div>
            <div className="relative z-10 text-center">
              <p className="text-slate-900 dark:text-white text-xl font-bold">Arraste e solte seus arquivos</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Suporta PDF, DOCX, JPG e PNG até 20MB</p>
            </div>
            <button className="relative z-10 flex min-w-[180px] items-center justify-center gap-2 rounded-xl h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold shadow-md active:scale-95 transition-transform">
              <span className="material-symbols-outlined">add</span>
              <span>Selecionar Arquivos</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Ou importe da nuvem</p>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Drive', icon: 'add_to_drive' },
            { label: 'Dropbox', icon: 'folder_open' },
            { label: 'iCloud', icon: 'cloud' }
          ].map((cloud) => (
            <button
              key={cloud.label}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 group"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors text-[28px]">{cloud.icon}</span>
              <span className="text-slate-700 dark:text-slate-200 text-xs font-semibold">{cloud.label}</span>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Upload;
