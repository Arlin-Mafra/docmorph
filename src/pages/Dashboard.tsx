
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import BottomNav from '../components/BottomNav';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const tools = [
    { id: 'merge', title: 'Juntar PDFs', desc: 'Combine múltiplos arquivos em um único documento.', icon: 'layers', color: 'blue' },
    { id: 'compress', title: 'Comprimir PDF', desc: 'Reduza o tamanho do arquivo mantendo a qualidade.', icon: 'compress', color: 'orange' },
    { id: 'jpg', title: 'Otimizar Imagem', desc: 'Reduza o tamanho da imagem (JPG/PNG).', icon: 'image', color: 'pink' },
  ];

  const getColorClass = (color: string) => {
    const map: any = {
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
      orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-500',
      indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500',
      pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-500',
      teal: 'bg-teal-50 dark:bg-teal-900/30 text-teal-500',
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    };
    return map[color] || map.blue;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-glow">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">DocMorph</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(AppRoute.PAYMENT)} className="relative overflow-hidden group bg-gradient-to-r from-primary to-blue-500 text-white text-xs font-bold py-2 px-3 rounded-xl shadow-glow transition-all active:scale-95 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] filled text-yellow-300">workspace_premium</span>
              <span className="relative z-10">Premium</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 pb-24 overflow-y-auto no-scrollbar">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-3 mb-6 shadow-soft border border-gray-100 dark:border-slate-700 flex items-start gap-3">
          <div className="text-green-500 shrink-0 mt-0.5">
            <span className="material-symbols-outlined filled">verified_user</span>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-0.5">Privacidade Garantida</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Seus arquivos são processados localmente e deletados em 1h.</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-6 px-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Ferramentas Populares</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Selecione uma ferramenta para começar.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => navigate(AppRoute.UPLOAD, { state: { tool: tool.id, title: tool.title } })}
              className="group relative flex flex-col items-start p-5 bg-white dark:bg-slate-800 rounded-xl shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20 text-left"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${getColorClass(tool.color)}`}>
                <span className="material-symbols-outlined">{tool.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{tool.title}</h3>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{tool.desc}</p>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
