
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center bg-slate-50 dark:bg-slate-900 p-6 pt-12 text-center">
      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-32 h-32 bg-green-500/10 rounded-full animate-pulse"></div>
        <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 z-10">
          <span className="material-symbols-outlined text-white text-5xl font-bold">check</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight mb-3">Pagamento Confirmado!</h1>
      <p className="text-slate-500 dark:text-gray-400 text-sm max-w-[280px] mb-10">
        Sua assinatura Premium foi ativada com sucesso. Aproveite os novos recursos.
      </p>

      <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-gray-100 dark:border-slate-700 overflow-hidden mb-6">
        <div className="px-5 py-4 bg-gray-50 dark:bg-slate-700/50 border-b dark:border-slate-700 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Resumo do Pedido</span>
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
            <span className="size-1.5 rounded-full bg-green-500"></span>
            <span className="text-[10px] font-bold text-green-600 uppercase">Ativo</span>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-slate-400">Plano</span>
              <span className="text-sm font-bold">Premium Anual</span>
            </div>
          </div>
          <div className="h-px w-full bg-gray-100 dark:bg-slate-700 border-t border-dashed"></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Valor Pago</p>
              <p className="text-sm font-bold">R$ 199,90</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Método</p>
              <p className="text-sm font-bold">•••• 4242</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Data</p>
              <p className="text-sm font-bold">15 Out, 2023</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Renovação</p>
              <p className="text-sm font-bold">15 Out, 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl p-4 flex items-start gap-3 text-left">
        <span className="material-symbols-outlined text-primary">rocket_launch</span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold leading-tight">Acesso Ilimitado Liberado</p>
          <p className="text-[11px] text-slate-500 leading-tight">Você agora pode processar arquivos sem limites diários.</p>
        </div>
      </div>

      <div className="mt-auto w-full pb-8 flex flex-col gap-3">
        <button 
          onClick={() => navigate(AppRoute.DASHBOARD)}
          className="w-full h-14 bg-primary text-white font-bold rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">dashboard</span>
          Ir para o Dashboard
        </button>
        <button onClick={() => navigate(AppRoute.SETTINGS)} className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">
          Ver Detalhes da Assinatura
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
