
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import BottomNav from '../components/BottomNav';

const History: React.FC = () => {
  const navigate = useNavigate();

  const historyItems = [
    { title: 'Relatório_Financeiro_Q4.pdf', action: 'Comprimir PDF', time: '14:30', status: 'ready', icon: 'picture_as_pdf', type: 'pdf' },
    { title: 'Contrato_Social_Final.docx', action: 'PDF para Word', time: '10:15', status: 'ready', icon: 'description', type: 'doc' },
    { title: 'Docs_Viagem_2024_Mesclado.pdf', action: 'Juntar PDFs', time: 'Agora', status: 'sync', icon: 'picture_as_pdf', type: 'pdf' },
    { title: 'Foto_Identidade_Scan.jpg', action: 'Comprimir IMG', time: '18:45', status: 'ready', icon: 'image', type: 'jpg', section: 'Ontem' },
    { title: 'Fatura_Cloud_Services_Mai.pdf', action: 'Juntar PDFs', time: '09:12', status: 'ready', icon: 'picture_as_pdf', type: 'pdf', section: 'Ontem' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <header className="flex flex-col gap-2 bg-white dark:bg-slate-800 p-4 pb-2 sticky top-0 z-20 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center h-12 justify-between">
          <h1 className="text-3xl font-bold leading-tight">Histórico</h1>
          <button className="flex items-center justify-center rounded-full size-10 text-slate-500 hover:bg-black/5">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
        <div className="mt-2">
          <div className="flex w-full items-stretch rounded-lg h-12 shadow-sm bg-gray-100 dark:bg-slate-700 overflow-hidden">
            <div className="text-slate-500 flex items-center justify-center pl-4 pr-2">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="flex-1 bg-transparent border-none focus:ring-0 text-base" placeholder="Buscar arquivos..." />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24">
        <div className="flex flex-col gap-6">
          <section>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Hoje</h3>
            <div className="flex flex-col gap-3">
              {historyItems.filter(i => !i.section).map((item, idx) => (
                <HistoryCard key={idx} item={item} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">Ontem</h3>
            <div className="flex flex-col gap-3">
              {historyItems.filter(i => i.section === 'Ontem').map((item, idx) => (
                <HistoryCard key={idx} item={item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

// Properly type the component using React.FC to handle special props like 'key'
const HistoryCard: React.FC<{ item: any }> = ({ item }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-soft active:scale-[0.98] transition-all">
    <div className="relative shrink-0">
      <div className={`flex items-center justify-center rounded-lg shrink-0 size-14 ${item.type === 'pdf' ? 'bg-red-50 text-red-500' : item.type === 'doc' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
        <span className="material-symbols-outlined text-[32px] filled">{item.icon}</span>
      </div>
      <div className={`absolute -bottom-1 -right-1 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center size-5 ${item.status === 'ready' ? 'bg-green-500' : 'bg-primary animate-pulse'}`}>
        <span className="material-symbols-outlined text-white text-[12px] font-bold">{item.status === 'ready' ? 'check' : 'sync'}</span>
      </div>
    </div>
    <div className="flex flex-col justify-center flex-1 min-w-0">
      <p className="text-slate-900 dark:text-white text-base font-semibold truncate leading-tight">{item.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
          {item.action}
        </div>
        <span className="text-slate-400 text-xs">{item.time}</span>
      </div>
    </div>
    <button className="flex items-center justify-center size-10 rounded-full text-primary bg-primary/5">
      <span className="material-symbols-outlined text-[20px]">ios_share</span>
    </button>
  </div>
);

export default History;
