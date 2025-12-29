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
          section,
          output_url: h.output_document?.storage_path ? supabase.storage.from('files').getPublicUrl(h.output_document.storage_path).data.publicUrl : null
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

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja apagar este histórico?')) return;
    try {
      await FileService.deleteConversion(id);
      setItems(items.filter(i => i.id !== id));
    } catch (e: any) {
      console.error(e);
      alert('Erro ao apagar: ' + e.message);
    }
  };

  const handleDownload = (item: any) => {
    if (item.output_url) {
      window.open(item.output_url, '_blank');
    } else {
      alert('Arquivo não disponível para download.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
      <header className="flex flex-col gap-2 bg-white dark:bg-slate-800 p-4 pb-2 sticky top-0 z-20 backdrop-blur-xl border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center h-12 justify-between">
          <h1 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">Histórico</h1>
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
                    <HistoryCard
                      key={item.id}
                      item={item}
                      onDelete={() => handleDelete(item.id)}
                      onDownload={() => handleDownload(item)}
                    />
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
const HistoryCard: React.FC<{ item: any, onDelete: () => void, onDownload: () => void }> = ({ item, onDelete, onDownload }) => (
  <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-soft transition-all group">
    <div className="relative shrink-0" onClick={onDownload}>
      <div className={`cursor-pointer flex items-center justify-center rounded-lg shrink-0 size-14 ${item.type === 'pdf' ? 'bg-red-50 text-red-500' : item.type === 'doc' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
        <span className="material-symbols-outlined text-[32px] filled">{item.icon}</span>
      </div>
      <div className={`absolute -bottom-1 -right-1 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center size-5 ${item.status === 'ready' || item.status === 'completed' ? 'bg-green-500' : 'bg-primary animate-pulse'}`}>
        <span className="material-symbols-outlined text-white text-[12px] font-bold">{item.status === 'ready' || item.status === 'completed' ? 'check' : 'sync'}</span>
      </div>
    </div>
    <div className="flex flex-col justify-center flex-1 min-w-0 cursor-pointer" onClick={onDownload}>
      <p className="text-slate-900 dark:text-white text-base font-semibold truncate leading-tight hover:text-primary transition-colors">{item.title}</p>
      <div className="flex items-center gap-2 mt-1">
        <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
          {item.action}
        </div>
        <span className="text-slate-400 text-xs">{item.time}</span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      {item.output_url && (
        <button onClick={onDownload} className="flex items-center justify-center size-10 rounded-full text-green-600 bg-green-50 hover:bg-green-100 transition-colors" title="Baixar">
          <span className="material-symbols-outlined text-[20px]">download</span>
        </button>
      )}
      <button onClick={onDelete} className="flex items-center justify-center size-10 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Apagar">
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  </div>
);

export default History;
