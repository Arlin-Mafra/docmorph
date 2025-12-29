import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import BottomNav from '../components/BottomNav';
import { FileService } from '../services/files';
import { supabase } from '../lib/supabase';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const history = await FileService.getConversionHistory(user.id);

      // Map data to UI format
      const mapped = history?.map(h => {
        const date = new Date(h.created_at);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        let section = '';
        if (date.toDateString() === today.toDateString()) section = 'Hoje';
        else if (date.toDateString() === yesterday.toDateString()) section = 'Ontem';
        else section = date.toLocaleDateString();

        let icon = 'description';
        let color = 'blue';
        let type = 'doc';

        if (h.action_type.includes('pdf')) {
          icon = 'picture_as_pdf';
          color = 'red';
          type = 'pdf';
        } else if (h.action_type.includes('img')) {
          icon = 'image';
          color = 'purple';
          type = 'jpg';
        }

        // Map action name nicely
        const actionMap: any = {
          'merge_pdf': 'Juntar PDFs',
          'compress_pdf': 'Comprimir PDF',
          'compress_img': 'Otimizar IMG'
        };

        return {
          id: h.id,
          title: h.title,
          action: actionMap[h.action_type] || h.action_type,
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: h.status === 'completed' ? 'ready' : h.status,
          icon,
          type,
          section
        };
      }) || [];

      setItems(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Group items by section
  const sections = items.reduce((acc: any, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <header className="flex flex-col gap-2 bg-white dark:bg-slate-800 p-4 pb-2 sticky top-0 z-20 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center h-12 justify-between">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">Histórico</h1>
          <button className="flex items-center justify-center rounded-full size-10 text-slate-500 hover:bg-black/5 dark:hover:bg-white/5">
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24">
        {loading ? (
          <div className="text-center text-slate-400 mt-10">Carregando...</div>
        ) : (
          <div className="flex flex-col gap-6">
            {Object.keys(sections).map((sectionTitle) => (
              <section key={sectionTitle}>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 ml-1">{sectionTitle}</h3>
                <div className="flex flex-col gap-3">
                  {sections[sectionTitle].map((item: any) => (
                    <HistoryCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
            {items.length === 0 && <div className="text-center text-slate-400 mt-10">Nenhum histórico recente.</div>}
          </div>
        )}
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
      <div className={`absolute -bottom-1 -right-1 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center size-5 ${item.status === 'ready' || item.status === 'completed' ? 'bg-green-500' : 'bg-primary animate-pulse'}`}>
        <span className="material-symbols-outlined text-white text-[12px] font-bold">{item.status === 'ready' || item.status === 'completed' ? 'check' : 'sync'}</span>
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
