import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AppRoute } from '../types';

interface PaymentRecord {
    id: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
}

const PaymentHistory: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isPro, setIsPro] = useState(false);
    const [planType, setPlanType] = useState<'monthly' | 'annual' | null>(null);

    const [nextBillingDate, setNextBillingDate] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate(AppRoute.LOGIN);
                return;
            }

            // 1. Fetch Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_pro')
                .eq('id', user.id)
                .single();

            setIsPro(!!profile?.is_pro);

            // 2. Fetch Payments
            const { data: paymentsData, error } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) console.error('Error loading payments:', error);

            if (paymentsData && paymentsData.length > 0) {
                setPayments(paymentsData);

                // Infer plan type and next billing from latest successful Premium payment
                // Status could be 'completed' or 'paid'. Check both or check for 'failed' negation if appropriate.
                // The screenshot shows 'paid', so let's include that.
                const latestSuccess = paymentsData.find(p =>
                    (p.status === 'completed' || p.status === 'paid') &&
                    p.description.toLowerCase().includes('premium')
                );

                if (latestSuccess) {
                    // Check for "anual" (pt) or "annual" (en)
                    const desc = latestSuccess.description.toLowerCase();
                    const isAnnual = desc.includes('anual') || desc.includes('annual');

                    setPlanType(isAnnual ? 'annual' : 'monthly');

                    // Calculate next billing date
                    const lastPaymentDate = new Date(latestSuccess.created_at);
                    const nextDate = new Date(lastPaymentDate);

                    if (isAnnual) {
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                    } else {
                        nextDate.setMonth(nextDate.getMonth() + 1);
                    }
                    setNextBillingDate(nextDate.toISOString());
                } else {
                    // If no successful payment found but user is pro, maybe manual grant?
                    // Default to month from now or null
                }
            }

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date); // Ex: 15 de outubro de 2024
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date).replace(' de ', ' ').replace(',', ' •');
    };

    const getStatusStyle = (status: string) => {
        if (status === 'completed' || status === 'paid') return {
            icon: 'check_circle',
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-600 dark:text-green-400',
            label: 'Pago com sucesso'
        };
        if (status === 'failed') return {
            icon: 'error',
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400',
            label: 'Pagamento falhou'
        };
        if (status === 'pending') return {
            icon: 'pending',
            bg: 'bg-orange-100 dark:bg-orange-900/30',
            text: 'text-orange-600 dark:text-orange-400',
            label: 'Processando...'
        };
        return {
            icon: 'help',
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            label: status
        };
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-slate-700 dark:text-white">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold flex-1 text-center pr-10 text-slate-900 dark:text-white">Histórico de Pagamentos</h1>
                    <button className="flex size-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-white">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 no-scrollbar">

                {/* Current Plan Card */}
                {isPro && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined filled">diamond</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PLANO ATUAL</p>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {planType === 'annual' ? 'Premium Anual' : 'Premium Mensal'}
                                    </h2>
                                </div>
                            </div>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded-full">
                                Ativo
                            </span>
                        </div>

                        <div className="flex items-end justify-between border-t border-gray-100 dark:border-slate-700 pt-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Próxima cobrança</p>
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    {nextBillingDate ? formatDate(nextBillingDate) : 'N/A'}
                                </p>
                            </div>
                            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                                Gerenciar <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Transactions List */}
                <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">Transações Recentes</h3>

                    {loading ? (
                        <div className="text-center py-10 text-slate-400">Carregando...</div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                            Nenhuma transação encontrada.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {payments.map(item => {
                                const style = getStatusStyle(item.status);
                                return (
                                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-slate-700 flex items-start gap-3">
                                        <div className={`size-10 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                                            <span className={`material-symbols-outlined ${style.text} text-[20px]`}>{style.icon}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate pr-2">{item.description}</h4>
                                                <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.amount)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 mb-1.5">{formatDate(item.created_at)}</p>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-[10px] font-bold ${style.text}`}>{style.label}</span>
                                                {item.status === 'failed' ? (
                                                    <button className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold px-3 py-1 rounded-full">
                                                        Tentar Novamente
                                                    </button>
                                                ) : (
                                                    <button className="text-slate-300 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined text-[20px]">receipt</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PaymentHistory;
