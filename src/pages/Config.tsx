
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const Config: React.FC = () => {
  const navigate = useNavigate();
  const [format, setFormat] = useState('PDF');
  const [compression, setCompression] = useState('Equilibrada');

  const files = [
    { name: 'contrato_venda_final.pdf', size: '1.2 MB', icon: 'picture_as_pdf', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
    { name: 'digitalizacao_rg.jpg', size: '4.5 MB', icon: 'image', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    { name: 'relatorio_anual_2023.docx', size: '2.8 MB', icon: 'description', color: 'text-primary bg-primary/10' },
  ];

  const handleProcess = () => {
    navigate(AppRoute.CONFIRMATION);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="flex-none sticky top-0 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center px-4 h-16 justify-between max-w-md mx-auto w-full">
          <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold">Configurar Arquivos</h2>
          <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar px-4 pt-6 pb-20">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-gray-900 dark:text-white text-xl font-bold">Arquivos ({files.length})</h3>
          <span className="text-xs font-medium text-primary cursor-pointer hover:underline">Limpar tudo</span>
        </div>

        <div className="flex flex-col gap-3">
          {files.map((file, idx) => (
            <div key={idx} className="group flex items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-soft border border-transparent dark:border-slate-700 transition-all">
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <div className={`flex items-center justify-center rounded-xl shrink-0 size-12 ${file.color}`}>
                  <span className="material-symbols-outlined">{file.icon}</span>
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <p className="text-gray-900 dark:text-white text-base font-semibold truncate leading-tight">{file.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-xs">{file.size}</span>
                    <span className="size-1 rounded-full bg-gray-300"></span>
                    <span className="text-green-600 dark:text-green-400 text-xs font-bold">Pronto</span>
                  </div>
                </div>
              </div>
              <button className="shrink-0 text-gray-300 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          ))}
        </div>

        {/* Configurations Drawer (Visible as part of scroll on mobile) */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl shadow-soft p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Formato de Saída</label>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {['PDF', 'DOCX', 'JPG'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 min-w-[100px] flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all relative ${
                    format === f ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-slate-700 text-gray-400'
                  }`}
                >
                  {format === f && <div className="absolute top-2 right-2 size-2 rounded-full bg-primary"></div>}
                  <span className="material-symbols-outlined text-3xl">
                    {f === 'PDF' ? 'picture_as_pdf' : f === 'DOCX' ? 'description' : 'image'}
                  </span>
                  <span className="text-xs font-bold">{f}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Compressão</label>
              <span className="text-xs text-primary font-medium">{compression}</span>
            </div>
            <div className="bg-gray-100 dark:bg-slate-700 p-1 rounded-xl flex gap-1">
              {['Alta', 'Equilibrada', 'Baixa'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCompression(c)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    compression === c ? 'bg-white dark:bg-slate-600 shadow-sm text-primary font-bold' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleProcess}
            className="w-full h-14 bg-primary hover:bg-primary-dark text-white rounded-xl text-base font-bold shadow-glow flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined">auto_fix_high</span>
            Processar Arquivos
          </button>
        </div>
      </main>
    </div>
  );
};

export default Config;
