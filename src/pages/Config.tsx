
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { FileService } from '../services/files';
import { supabase } from '../lib/supabase';

const Config: React.FC = () => {
  const navigate = useNavigate();
  const [format, setFormat] = useState('PDF');
  const [compression, setCompression] = useState('Equilibrada');
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userFiles = await FileService.getUserFiles(user.id);
      setFiles(userFiles || []);
      // Auto-select the most recent file if none selected
      if (userFiles && userFiles.length > 0 && selectedIds.length === 0) {
        setSelectedIds([userFiles[0].id]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleProcess = async () => {
    const selectedFiles = files.filter(f => selectedIds.includes(f.id));

    if (selectedFiles.length === 0) {
      alert('Selecione pelo menos um arquivo para processar.');
      return;
    }

    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Determine action automatically
      let action = 'compress_pdf';

      // If output is JPG, we treat as image compression (or PDF to JPG if implemented)
      if (format === 'JPG') {
        action = 'compress_img';
      }
      // If output is PDF
      else {
        if (selectedFiles.length > 1) {
          action = 'merge_pdf';
        } else {
          action = 'compress_pdf';
        }
      }

      // Job Title
      const title = selectedFiles.length > 1
        ? `Merged ${selectedFiles.length} files`
        : `Processed ${selectedFiles[0].name}`;

      // 1. Create Job in DB
      const job = await FileService.createConversionJob(
        user.id,
        title,
        action,
        selectedFiles[0].mime_type, // Input format (approx)
        format
      );

      // 2. Get Public URLs for ALL selected files
      const fileUrls = selectedFiles.map(file => {
        const { data } = supabase.storage.from('files').getPublicUrl(file.storage_path);
        return data.publicUrl;
      });

      // 3. Call Django API
      const response = await fetch('http://localhost:8000/api/convert/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          conversion_id: job.id,
          action: action,
          file_urls: fileUrls
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro na conversão');
      }

      // 3. Handle Result (Blob)
      const blob = await response.blob();

      // Download it directly to browser for user feedback
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `result_${new Date().getTime()}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Ideally we would also upload this result back to Supabase and update the job status.

      alert('Arquivo processado com sucesso!');
      navigate(AppRoute.HISTORY);

    } catch (error: any) {
      console.error(error);
      alert('Falha no processamento: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRemove = async (fileId: string, storagePath: string) => {
    if (!confirm('Deseja realmente remover este arquivo?')) return;

    try {
      await FileService.deleteFile(fileId, storagePath);
      setFiles(files.filter(f => f.id !== fileId));
    } catch (error) {
      console.error(error);
      alert('Erro ao remover arquivo.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="flex-none sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center px-4 h-16 justify-between max-w-md mx-auto w-full">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold">Configurar Arquivos</h2>
          <button
            onClick={() => navigate(AppRoute.UPLOAD)}
            className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-6 pb-20">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-gray-900 dark:text-white text-xl font-bold">Arquivos Recentes ({files.length})</h3>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-400">Carregando arquivos...</div>
        ) : (
          <div className="flex flex-col gap-3">
            {files.map((file, idx) => {
              const isSelected = selectedIds.includes(file.id);
              return (
                <div
                  key={idx}
                  onClick={() => toggleSelection(file.id)}
                  className={`group cursor-pointer flex items-center justify-between gap-4 p-4 rounded-xl shadow-soft border transition-all ${isSelected
                    ? 'bg-primary/5 border-primary shadow-md'
                    : 'bg-white dark:bg-slate-800 border-transparent dark:border-slate-700 hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className={`relative flex items-center justify-center rounded-xl shrink-0 size-12 ${isSelected ? 'bg-primary text-white' : 'bg-blue-50 text-blue-600'}`}>
                      {isSelected ? (
                        <span className="material-symbols-outlined">check</span>
                      ) : (
                        <span className="material-symbols-outlined">description</span>
                      )}
                    </div>
                    <div className="flex flex-col justify-center overflow-hidden">
                      <p className={`text-base font-semibold truncate leading-tight ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-500 text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                        <span className="size-1 rounded-full bg-gray-300"></span>
                        <span className="text-green-600 dark:text-green-400 text-xs font-bold">Recebido</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(file.id, file.storage_path);
                    }}
                    className="shrink-0 text-gray-300 hover:text-red-500 transition-colors size-10 flex items-center justify-center rounded-full hover:bg-red-50"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              );
            })}
            {files.length === 0 && (
              <div className="text-center py-10 text-slate-400">Nenhum arquivo encontrado. Faça upload primeiro.</div>
            )}
          </div>
        )}

        <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Ação / Formato</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {['PDF', 'JPG'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 min-w-[100px] flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all relative ${format === f ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-slate-700 text-gray-400'
                    }`}
                >
                  {format === f && <div className="absolute top-2 right-2 size-2 rounded-full bg-primary"></div>}
                  <span className="material-symbols-outlined text-3xl">
                    {f === 'PDF' ? 'picture_as_pdf' : 'image'}
                  </span>
                  <span className="text-xs font-bold">{f}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={processing || files.length === 0}
            className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-xl text-base font-bold shadow-glow flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">{processing ? 'hourglass_top' : 'auto_fix_high'}</span>
            {processing ? 'Processando Remotamente...' : 'Processar Arquivo (API)'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Config;
