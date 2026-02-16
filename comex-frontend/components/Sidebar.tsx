
import React from 'react';
import { ViewType } from '../types';
import { NAV_ITEMS } from '../constants';
import { LogOut, Settings, Lock, User } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isGuest?: boolean;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isGuest, onLogout }) => {
  return (
    <>
      {/* Desktop Sidebar - Se adapta de 20 a 64 unidades de ancho */}
      <aside className="hidden md:flex h-full w-20 lg:w-64 border-r border-zinc-800 flex-col bg-[#0a0a0a] z-50 transition-all duration-500 ease-in-out">
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3 text-[#ff7a00] group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff7a00] to-orange-700 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,122,0,0.3)] group-hover:scale-110 transition-transform">
              <span className="font-black italic text-lg tracking-tighter">C</span>
            </div>
            <div className="hidden lg:block overflow-hidden transition-all">
              <span className="font-black text-xl tracking-tighter uppercase italic text-white block leading-none">Logistic</span>
              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Academy OS</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 p-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                currentView === item.id 
                  ? 'bg-gradient-to-r from-[#ff7a00] to-orange-600 text-white shadow-xl translate-x-1' 
                  : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-white'
              }`}
            >
              <div className={`${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform shrink-0`}>
                {item.icon}
              </div>
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest italic">{item.label}</span>
              {isGuest && item.id === 'lessons' && (
                <Lock size={12} className="absolute right-4 hidden lg:block text-orange-200/50" />
              )}
              {currentView === item.id && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-full -translate-x-1" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-900 space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:bg-zinc-900 transition-all group">
            <Settings size={20} className="group-hover:rotate-45 transition-transform" />
            <span className="hidden lg:block font-bold text-[10px] italic uppercase tracking-widest">Configuración</span>
          </button>
          {!isGuest && (
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut size={20} />
              <span className="hidden lg:block font-bold text-[10px] italic uppercase tracking-widest">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Optimized Bottom Bar - Ergonomía Táctil */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md h-16 bg-zinc-900/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] flex items-center justify-around px-4 z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as ViewType)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${
              currentView === item.id 
                ? 'text-[#ff7a00] bg-white/5 scale-110' 
                : 'text-zinc-600 active:scale-90'
            }`}
          >
            {/* // Fix: Use type assertion to allow 'size' prop in cloneElement which Lucide icons accept */}
            {React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 20 })}
            <span className="text-[7px] font-black uppercase mt-1 tracking-tighter opacity-80">{item.label}</span>
            {currentView === item.id && (
               <div className="absolute -bottom-1 w-1 h-1 bg-[#ff7a00] rounded-full shadow-[0_0_10px_#ff7a00]" />
            )}
          </button>
        ))}
        <button 
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${
            currentView === 'profile' ? 'text-[#ff7a00] bg-white/5' : 'text-zinc-600'
          }`}
        >
          <User size={20} />
          <span className="text-[7px] font-black uppercase mt-1 tracking-tighter opacity-80">Perfil</span>
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
