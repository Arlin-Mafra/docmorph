
import React from 'react';
import { NavLink } from 'react-router-dom';
import { AppRoute } from '../types';

const BottomNav: React.FC = () => {
  return (
    <nav className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40">
      <div className="flex items-center justify-between max-w-md mx-auto h-16">
        <NavLink 
          to={AppRoute.DASHBOARD} 
          className={({ isActive }) => `group flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
          {/* Use children as function to access isActive state */}
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined transition-transform ${isActive ? 'filled scale-110' : ''}`}>grid_view</span>
              <span className="text-[10px] font-medium">Tools</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to={AppRoute.HISTORY} 
          className={({ isActive }) => `group flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
          {/* Use children as function to access isActive state */}
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined transition-transform ${isActive ? 'filled scale-110' : ''}`}>history</span>
              <span className="text-[10px] font-medium">Histórico</span>
            </>
          )}
        </NavLink>

        <div className="relative -top-5">
          <NavLink to={AppRoute.UPLOAD} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </NavLink>
        </div>

        <NavLink 
          to={AppRoute.PROFILE} 
          className={({ isActive }) => `group flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
          {/* Use children as function to access isActive state */}
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined transition-transform ${isActive ? 'filled scale-110' : ''}`}>person</span>
              <span className="text-[10px] font-medium">Perfil</span>
            </>
          )}
        </NavLink>

        <NavLink 
          to={AppRoute.SETTINGS} 
          className={({ isActive }) => `group flex flex-col items-center gap-1 w-16 transition-colors ${isActive ? 'text-primary' : 'text-gray-400'}`}
        >
          {/* Use children as function to access isActive state */}
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined transition-transform ${isActive ? 'filled scale-110' : ''}`}>settings</span>
              <span className="text-[10px] font-medium">Ajustes</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
