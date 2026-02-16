
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, ShieldCheck, Globe, Zap, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (credentials: { email: string, pass: string }) => void;
  onRegister: (userData: { name: string, email: string, pass: string }) => void;
  initialMode?: 'login' | 'register';
  onCancel?: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, initialMode = 'login', onCancel }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setError(null);
    setSuccess(null);
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (isLogin) {
      // Simplemente enviamos los datos al padre para que use el AuthService
      onLogin({ email, pass: password });
    } else {
      if (password.length < 4) {
        setError("La clave debe tener al menos 4 caracteres.");
        return;
      }
      onRegister({ name, email, pass: password });
      // El éxito se maneja en el padre o mediante estados locales si el registro fue exitoso
    }
  };

  return (
    <div className="flex items-center justify-center animate-in fade-in zoom-in duration-500 py-10 relative h-full">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 relative">
          {onCancel && (
            <button 
              onClick={onCancel}
              className="absolute right-0 top-0 text-zinc-600 hover:text-white transition-colors p-2"
            >
              <X size={24} />
            </button>
          )}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ff7a00] to-orange-600 rounded-2xl shadow-2xl mb-4 transform -rotate-3">
            <Globe size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter italic uppercase text-white">
            {isLogin ? 'Acceso Académico' : 'Registro de Cadete'}
          </h1>
          <p className="text-zinc-500 font-medium mt-1 text-sm">Portal de Entrenamiento Logístico</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] p-8 md:p-10 shadow-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}
          
          <div className="flex gap-4 mb-8 p-1 bg-black/40 rounded-2xl border border-zinc-800">
            <button 
              type="button"
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isLogin ? 'bg-[#ff7a00] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              type="button"
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!isLogin ? 'bg-[#ff7a00] text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">Nombre de Operador</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#ff7a00] transition-all text-sm font-medium"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">Email de Empresa</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#ff7a00] transition-all text-sm font-medium"
                placeholder="usuario@comex.cl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">Clave de Seguridad</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#ff7a00] transition-all text-sm font-medium"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#ff7a00] hover:bg-orange-600 text-white font-black py-4 rounded-xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 mt-4 text-xs tracking-widest uppercase"
            >
              {isLogin ? (
                <><LogIn size={18} /> AUTORIZAR ACCESO</>
              ) : (
                <><UserPlus size={18} /> REGISTRAR EN SISTEMA</>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-center gap-6">
              <div className="flex items-center gap-2 text-zinc-600">
                <ShieldCheck size={16} />
                <span className="text-[8px] font-bold uppercase">Encriptado</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-600">
                <Zap size={16} />
                <span className="text-[8px] font-bold uppercase">SSL V3</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
