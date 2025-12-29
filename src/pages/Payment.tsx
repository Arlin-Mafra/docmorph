
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const Payment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Premium</div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-[180px]">
        <div className="flex flex-col items-center pt-8 px-6 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full scale-125"></div>
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg">
              <span className="material-symbols-outlined text-[40px] filled">workspace_premium</span>
            </div>
            <div className="absolute -top-2 -right-2 text-yellow-400">
              <span className="material-symbols-outlined filled text-[24px]">star</span>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-3">Desbloqueie o <span className="text-primary">Premium</span></h1>
          <p className="text-slate-500 dark:text-gray-400 text-base font-medium max-w-[280px]">Remova limites e libere o poder máximo de suas ferramentas.</p>
        </div>

        <div className="px-5 py-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Processamento em Lote', icon: 'folder_copy', color: 'text-primary bg-blue-50 dark:bg-blue-900/20' },
            { label: 'OCR Avançado', icon: 'document_scanner', color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
            { label: 'Compressão Máxima', icon: 'compress', color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
            { label: 'Sem Publicidade', icon: 'block', color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-start gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-soft border border-transparent dark:border-slate-700">
              <div className={`p-2 rounded-lg ${item.color}`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <h3 className="font-bold text-[12px] leading-tight">{item.label}</h3>
            </div>
          ))}
        </div>

        <div className="px-5 space-y-4">
          <div className="relative group cursor-pointer border-2 border-primary bg-white dark:bg-slate-800 rounded-xl p-4 shadow-glow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="size-6 flex items-center justify-center bg-primary text-white rounded-full">
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Anual</h4>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">ECONOMIZE 50%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">R$ 199,90</p>
                <p className="text-[10px] text-slate-500">/ano</p>
              </div>
            </div>
            <div className="bg-primary/5 dark:bg-primary/10 py-2 px-3 rounded-lg text-xs font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              7 dias grátis, depois R$ 16,65/mês
            </div>
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">MELHOR VALOR</div>
          </div>
        </div>

        <div className="px-5 mt-10 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pagamento</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-5 space-y-5">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">credit_card</span>
              </span>
              <input className="w-full h-12 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold placeholder:font-normal focus:ring-2 focus:ring-primary transition-all" placeholder="Número do Cartão" />
            </div>
            <div className="flex gap-3">
              <input className="flex-1 h-12 px-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-primary transition-all" placeholder="MM/AA" />
              <input className="flex-1 h-12 px-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-primary transition-all" placeholder="CVC" />
            </div>
            <input className="w-full h-12 px-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-primary transition-all" placeholder="Nome no cartão" />
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-[10px] text-slate-400">Assinatura renovada automaticamente. Cancele a qualquer momento.</p>
        </div>
      </main>

      <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-slate-50 dark:from-slate-900 via-white dark:via-slate-800 pt-8">
        <button 
          onClick={() => navigate(AppRoute.CONFIRMATION)}
          className="w-full h-14 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          Assinar e Pagar
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <button>Restaurar</button>
          <span>•</span>
          <button>Termos</button>
          <span>•</span>
          <button>Privacidade</button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
