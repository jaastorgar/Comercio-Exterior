
import React from 'react';
import { 
  ShieldCheck, 
  UserCircle, 
  GraduationCap, 
  Box, 
  ClipboardCheck, 
  BarChart3, 
  Bell, 
  X,
  Cpu,
  Fingerprint,
  ChevronRight
} from 'lucide-react';

interface ServicesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  { id: 'auth', title: 'SECURITY', description: 'Acceso biométrico militar.', icon: <Fingerprint size={32} />, grid: 'col-span-2 row-span-2', color: 'orange' },
  { id: 'sim', title: '3D ENGINE', description: 'Cubicaje físico real.', icon: <Box size={28} />, grid: 'col-span-2 md:col-span-1 row-span-2', color: 'purple' },
  { id: 'dash', title: 'DATA', description: 'Neural analytics.', icon: <BarChart3 size={28} />, grid: 'col-span-2 md:col-span-3', color: 'rose' },
  { id: 'users', title: 'ROLES', description: 'Ranks.', icon: <UserCircle size={20} />, grid: 'col-span-1', color: 'blue' },
  { id: 'courses', title: 'CORE', description: 'Elite training.', icon: <GraduationCap size={20} />, grid: 'col-span-1', color: 'emerald' },
  { id: 'eval', title: 'QUIZ', description: 'Certify.', icon: <ClipboardCheck size={20} />, grid: 'col-span-1', color: 'yellow' },
  { id: 'notif', title: 'HUB', description: 'Alerts.', icon: <Bell size={20} />, grid: 'col-span-1', color: 'sky' }
];

const ServicesOverlay: React.FC<ServicesOverlayProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl p-4 md:p-10 flex items-center justify-center animate-in fade-in duration-500 overflow-hidden">
      <div className="w-full h-full max-w-7xl flex flex-col">
        <div className="flex justify-between items-center mb-6 md:mb-12">
          <div>
            <span className="text-[10px] font-black text-[#ff7a00] uppercase tracking-[0.5em] mb-2 block animate-pulse">SYSTEM_STACK_V2.4</span>
            <h2 className="text-4xl md:text-7xl font-black italic uppercase text-white tracking-tighter leading-none">SERVICES <span className="text-zinc-800">HUB</span></h2>
          </div>
          <button onClick={onClose} className="p-4 md:p-6 bg-white rounded-full text-black hover:scale-110 active:scale-90 transition-all shadow-2xl">
            {/* // Fix: Use className for responsive sizing instead of invalid md:size prop */}
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5">
            {SERVICES.map((s) => (
              <div key={s.id} className={`${s.grid} group relative bg-zinc-900/40 border border-zinc-800/50 rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-8 hover:border-[#ff7a00]/50 transition-all duration-500 flex flex-col justify-between overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-${s.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                   <div className="p-3 md:p-4 bg-black/50 rounded-2xl border border-zinc-800 w-fit mb-4 group-hover:scale-110 transition-transform text-[#ff7a00]">
                      {s.icon}
                   </div>
                   <h3 className="text-sm md:text-xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{s.title}</h3>
                   <p className="text-zinc-500 text-[10px] md:text-xs font-medium leading-tight">{s.description}</p>
                </div>
                <div className="relative z-10 mt-4 h-1 w-8 bg-zinc-800 rounded-full group-hover:bg-[#ff7a00] group-hover:w-full transition-all" />
              </div>
            ))}

            <div className="col-span-2 group relative bg-[#ff7a00] rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-all cursor-pointer shadow-2xl overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-transparent opacity-50" />
               <h3 className="relative text-xl md:text-3xl font-black text-white uppercase italic leading-none mb-2 tracking-tighter">OMNI-SYNC</h3>
               <p className="relative text-orange-200 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-6">Full Platform Integration</p>
               <button onClick={onClose} className="relative bg-white text-[#ff7a00] px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:px-10 transition-all">ENTER SYSTEM</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesOverlay;
