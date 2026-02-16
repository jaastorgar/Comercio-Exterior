
import React, { useState } from 'react';
import { LESSONS } from '../constants';
import { ViewType } from '../types';
import { DashboardService } from '../services';
import ServicesOverlay from './ServicesOverlay';
import { TrendingUp, Clock, Target, ChevronRight, Award, Zap, Package, Sparkles, Lock, BarChart3, Users, Newspaper, Cpu } from 'lucide-react';

interface DashboardProps {
  setCurrentView: (view: ViewType) => void;
  xp: number;
  completedCount: number;
  userName: string;
  isGuest?: boolean;
  onAuthClick?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentView, xp, completedCount, userName, isGuest, onAuthClick }) => {
  const [showServices, setShowServices] = useState(false);
  const stats = DashboardService.getStats(xp, completedCount);
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-20 md:pb-0">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#00d1ff] font-bold text-[9px] md:text-sm uppercase tracking-widest mb-2">
            <Sparkles size={12} fill="currentColor" /> ACADEMY OS v2.5
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white italic tracking-tighter leading-none uppercase">
            Hola, {userName.split(' ')[0]}
          </h2>
          <p className="text-zinc-500 mt-2 text-xs md:text-xl font-medium">Gestiona tu ruta de certificación profesional.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowServices(true)} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl hover:border-[#ff7a00] transition-all"><Cpu size={20} className="text-[#ff7a00]" /></button>
           <button onClick={isGuest ? onAuthClick : () => setCurrentView('lessons')} className="flex-1 bg-[#ff7a00] text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-orange-500/10">Continuar Training</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-[2rem] group hover:border-zinc-600 transition-all">
            <span className="text-[8px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">{stat.label}</span>
            <div className="text-lg md:text-2xl font-black italic" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Main Simulator Access */}
        <div className="lg:col-span-8 bg-white text-black p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden group shadow-2xl min-h-[400px] flex flex-col justify-between">
           <div className="relative z-10">
              <h3 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">Cubicaje <br/><span className="text-zinc-300">Inteligente</span></h3>
              <p className="text-zinc-500 text-sm md:text-lg mt-6 font-medium max-w-sm">Simulador volumétrico de contenedores con motor de física real.</p>
           </div>
           <button onClick={() => setCurrentView('simulator')} className="relative z-10 w-fit bg-black text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:px-14 transition-all">Abrir Motor 3D</button>
           <Package className="absolute right-[-10%] top-[-10%] opacity-[0.05] text-black rotate-12" size={500} />
        </div>

        {/* Dynamic Sidebar widgets (Networking & News) */}
        <div className="lg:col-span-4 space-y-6">
           {/* Service 11: News */}
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                 <h4 className="text-xs font-black uppercase tracking-widest italic text-white flex items-center gap-2"><Newspaper size={16} className="text-[#00d1ff]" /> Terminal News</h4>
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00d1ff] animate-pulse" />
              </div>
              <div className="space-y-6 flex-1">
                 <div className="group cursor-pointer">
                    <div className="text-[8px] font-black text-[#ff7a00] uppercase mb-1">Puerto San Antonio</div>
                    <div className="text-xs font-bold text-white group-hover:text-[#ff7a00] transition-colors leading-tight italic uppercase">Nuevo record de TEUs movilizados en Q1.</div>
                 </div>
                 <div className="group cursor-pointer">
                    <div className="text-[8px] font-black text-[#ff7a00] uppercase mb-1">Aduana Chile</div>
                    <div className="text-xs font-bold text-white group-hover:text-[#ff7a00] transition-colors leading-tight italic uppercase">Actualización de aranceles para electrónicos.</div>
                 </div>
              </div>
           </div>

           {/* Service 10: Networking */}
           <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:bg-zinc-800/50 cursor-pointer transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-[#ff7a00] group-hover:scale-110 transition-transform">
                    <Users size={24} />
                 </div>
                 <div>
                    <div className="text-[10px] font-black uppercase text-white tracking-widest italic leading-none">Red de Operadores</div>
                    <div className="text-[8px] font-bold text-zinc-500 uppercase mt-1">124 Activos ahora</div>
                 </div>
              </div>
              <ChevronRight size={20} className="text-zinc-700" />
           </div>
        </div>
      </div>

      <ServicesOverlay isOpen={showServices} onClose={() => setShowServices(false)} />
    </div>
  );
};

export default Dashboard;
