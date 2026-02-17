
import React from 'react';
import { User } from '../types';
import { DashboardService } from '../services';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Shield, 
  Award, 
  TrendingUp, 
  LogOut, 
  ArrowLeft,
  Settings,
  CreditCard,
  Target
} from 'lucide-react';

interface ProfileModuleProps {
  user: User | null;
  xp: number;
  completedCount: number;
  onLogout: () => void;
  onClose: () => void;
}

const ProfileModule: React.FC<ProfileModuleProps> = ({ user, xp, completedCount, onLogout, onClose }) => {
  if (!user) return null;

  const stats = DashboardService.getStats(xp, completedCount);
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={onClose}
          className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Perfil de <span className="text-[#ff7a00]">Operador</span></h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: ID Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 text-center relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-500/20 to-transparent" />
            
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ff7a00] to-orange-700 rounded-3xl mx-auto mb-6 flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-[#0a0a0a] group-hover:rotate-3 transition-transform">
                {initials}
              </div>
              
              <h3 className="text-2xl font-black text-white italic uppercase mb-1">{user.name}</h3>
              <div className="inline-flex px-3 py-1 bg-zinc-800 rounded-full text-[10px] font-black text-[#00d1ff] uppercase tracking-widest mb-6">
                ID: {user.id.toUpperCase()}
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3 text-zinc-400 p-3 bg-black/40 rounded-2xl border border-zinc-800/50">
                  <Mail size={16} className="text-[#ff7a00]" />
                  <span className="text-xs font-bold truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 p-3 bg-black/40 rounded-2xl border border-zinc-800/50">
                  <Shield size={16} className="text-[#ff7a00]" />
                  <span className="text-xs font-bold">{user.role} Academy</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 p-3 bg-black/40 rounded-2xl border border-zinc-800/50">
                  <Calendar size={16} className="text-[#ff7a00]" />
                  <span className="text-xs font-bold">Ingreso: {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>

              <button 
                onClick={onLogout}
                className="w-full mt-8 bg-zinc-800 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              >
                <LogOut size={16} /> Cerrar Sesión Segura
              </button>
            </div>
          </div>

          <div className="bg-[#ff7a00]/5 border border-[#ff7a00]/20 rounded-3xl p-6 flex items-start gap-4">
            <Award size={24} className="text-[#ff7a00] shrink-0" />
            <div>
              <h4 className="text-[#ff7a00] font-black text-[10px] uppercase mb-1">Rango Operativo</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">Sube de nivel completando unidades para desbloquear funciones de inteligencia de mercado.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Progress */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {stats.map((s, idx) => (
               <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-1">{s.label}</span>
                    <span className="text-2xl font-black italic text-white" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="p-3 bg-zinc-800 rounded-2xl" style={{ color: s.color }}>
                     <TrendingUp size={20} />
                  </div>
               </div>
             ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 md:p-10 relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <h4 className="text-xl font-black italic uppercase tracking-tighter">Desglose de <span className="text-[#00d1ff]">Habilidades</span></h4>
                <Target size={24} className="text-[#00d1ff]" />
             </div>

             <div className="space-y-8">
                <SkillBar label="Incoterms 2020" progress={completedCount > 0 ? 100 : 0} />
                <SkillBar label="Valoración Aduanera" progress={completedCount > 1 ? 100 : 0} />
                <SkillBar label="Cubicaje 3D" progress={completedCount > 7 ? 100 : 0} />
                <SkillBar label="Documentación (DIN/DUS)" progress={completedCount > 2 ? 100 : 0} />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:border-[#ff7a00]/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-[#ff7a00] transition-colors">
                      <Settings size={20} />
                   </div>
                   <span className="font-black text-xs uppercase italic">Ajustes de Cuenta</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Configura tus notificaciones y preferencias de visualización.</p>
             </div>
             
             <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:border-[#00d1ff]/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-[#00d1ff] transition-colors">
                      <CreditCard size={20} />
                   </div>
                   <span className="font-black text-xs uppercase italic">Certificados</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Descarga tus diplomas oficiales en formato PDF firmado.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillBar: React.FC<{ label: string, progress: number }> = ({ label, progress }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">{label}</span>
      <span className="text-xs font-black text-white italic">{progress}%</span>
    </div>
    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/5">
       <div 
        className="h-full bg-gradient-to-r from-[#00d1ff] to-blue-600 rounded-full transition-all duration-1000" 
        style={{ width: `${progress}%` }}
       />
    </div>
  </div>
);

export default ProfileModule;
