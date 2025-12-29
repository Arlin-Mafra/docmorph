
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../types';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-12 w-full"></div>
      
      <div className="px-6 pt-4 pb-2">
        <div className="group relative flex aspect-[4/3] w-full flex-col justify-end overflow-hidden rounded-2xl bg-primary/10 shadow-sm transition-all hover:shadow-md">
          <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-cover" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoESF2g1WqJvcn9mR203HMbxYSoTZuue7FrMvRDEJcy43UlaH2gTaO6LsBl6iFotVmOPiPVWUZypVpBYgV-I_D3ycca1CV-WONuGGYgdZWKAi2gzmj4h29V5guVCAZr5LELLlORgwZqmuJd2HGsv29qwqn-jiqLNLg2FsUfaCfnlPvaBoIt3d0GlJbnRy34IIlfIqH7Ufg5yo7EKXMcIE5P3wxhkz_PHcTpUDt_bRHOYacUDGjsm7Gm_dKtcwk7zoSFneXqlPlcNA")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      </div>

      <div className="flex flex-col items-center px-6 pt-6 pb-2 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-[32px]">auto_fix</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">DocMorph</h1>
        <p className="mt-3 text-base font-normal leading-relaxed text-gray-500 dark:text-gray-400">
          A ferramenta definitiva para gerenciar seus documentos. Converta, mescle e comprima com facilidade.
        </p>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'transform', label: 'Converter' },
            { icon: 'call_merge', label: 'Mesclar' },
            { icon: 'compress', label: 'Comprimir' }
          ].map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 dark:bg-slate-700/50 dark:border-slate-700 p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-800 text-primary shadow-sm">
                <span className="material-symbols-outlined text-[24px]">{feature.icon}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-gray-200">{feature.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 px-6 pb-8 pt-4">
        <button 
          onClick={() => navigate(AppRoute.LOGIN)}
          className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary h-14 px-5 text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] hover:bg-blue-600"
        >
          <span className="text-base font-bold tracking-wide">Começar Agora</span>
          <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
        <button 
          onClick={() => navigate(AppRoute.LOGIN)}
          className="text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400 transition-colors"
        >
          Já tem uma conta? <span className="text-primary font-semibold">Entrar</span>
        </button>
      </div>

      <div className="flex h-5 w-full justify-center pb-2">
        <div className="h-1 w-32 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};

export default Welcome;
