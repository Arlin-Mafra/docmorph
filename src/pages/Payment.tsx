import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';
import { PaymentService } from '../services/payment';
import { supabase } from '../lib/supabase';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAlreadyPro, setIsAlreadyPro] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('is_pro').eq('id', user.id).single();
        if (data?.is_pro) {
          setIsAlreadyPro(true);
        }
      }
    } finally {
      setChecking(false);
    }
  };

  const handlePayment = async () => {
    if (isAlreadyPro) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Faça login para assinar.');
        navigate(AppRoute.LOGIN);
        return;
      }

      const amount = selectedPlan === 'annual' ? 199.90 : 29.90;

      await PaymentService.processFakePayment(user.id, selectedPlan, amount);

      navigate(AppRoute.CONFIRMATION);

    } catch (e: any) {
      console.error(e);
      alert('Erro no pagamento: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="flex h-full items-center justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }


  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-gray-100 dark:border-slate-700">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Premium</div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-[180px]">
        {/* ... Header Content ... */}
        <div className="flex flex-col items-center pt-8 px-6 text-center">
          {/* ... Same as before ... */}
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

        {/* ... Benefits Grid ... */}
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

        {/* ... Plan Selection ... */}
        <div className="px-5 space-y-4">
          <div onClick={() => setSelectedPlan('annual')} className={`relative group cursor-pointer border-2 transition-all rounded-xl p-4 shadow-glow ${selectedPlan === 'annual' ? 'border-primary bg-white dark:bg-slate-800' : 'border-transparent bg-white/50 dark:bg-slate-800/50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`size-6 flex items-center justify-center rounded-full ${selectedPlan === 'annual' ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'}`}>
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Anual</h4>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2">ECONOMIZE 50%</span>
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
            {selectedPlan === 'annual' && <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">MELHOR VALOR</div>}
          </div>

          <div onClick={() => setSelectedPlan('monthly')} className={`relative group cursor-pointer border-2 transition-all rounded-xl p-4 ${selectedPlan === 'monthly' ? 'border-primary bg-white dark:bg-slate-800 shadow-glow' : 'border-transparent bg-white dark:bg-slate-800'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`size-6 flex items-center justify-center rounded-full ${selectedPlan === 'monthly' ? 'bg-primary text-white' : 'bg-gray-200 text-transparent'}`}>
                  <span className="material-symbols-outlined text-sm font-bold">check</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Mensal</h4>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black">R$ 29,90</p>
                <p className="text-[10px] text-slate-500">/mês</p>
              </div>
            </div>
          </div>
        </div>

        {/* ... Payment Form (Visual) ... */}
        <div className="px-5 mt-10 space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pagamento (Seguro)</h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-5 space-y-5">
            <div className="relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">credit_card</span>
              </span>
              <input className="w-full h-12 pl-11 pr-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold placeholder:font-normal focus:ring-2 focus:ring-primary transition-all" placeholder="Número do Cartão" defaultValue="4242 4242 4242 4242" />
            </div>
            <div className="flex gap-3">
              <input className="flex-1 h-12 px-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-primary transition-all" placeholder="MM/AA" defaultValue="12/28" />
              <input className="flex-1 h-12 px-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-primary transition-all" placeholder="CVC" defaultValue="123" />
            </div>
            <input className="w-full h-12 px-4 rounded-lg bg-gray-50 dark:bg-slate-900 border-none text-sm font-bold focus:ring-2 focus:ring-primary transition-all" placeholder="Nome no cartão" defaultValue="Seu Nome" />
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-[10px] text-slate-400">Assinatura renovada automaticamente. Cancele a qualquer momento.</p>
        </div>
      </main>

      <div className="absolute bottom-0 w-full p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-t border-gray-100 dark:border-slate-700 z-30">
        <div className="max-w-md mx-auto">
          {isAlreadyPro ? (
            <div className="w-full h-14 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-lg rounded-xl flex items-center justify-center gap-2 border border-green-200 dark:border-green-800">
              <span className="material-symbols-outlined filled">verified</span>
              Assinatura Ativa
            </div>
          ) : (
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full h-14 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : (
                <>
                  Assinar e Pagar
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          )}
          {!isAlreadyPro && (
            <div className="mt-3 flex justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <button>Restaurar</button>
              <span>•</span>
              <button>Termos</button>
              <span>•</span>
              <button>Privacidade</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
