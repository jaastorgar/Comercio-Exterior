
import React, { useState, useEffect } from 'react';
import { ViewType, User, Notification } from './types';
import { NAV_ITEMS } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './src/pages/Dashboard';
import LessonModule from './src/pages/LessonModule';
import Simulator3D from './components/Simulator3D';
import CostCalculator from './src/pages/CostCalculator';
import MapModule from './components/MapModule';
import ProfileModule from './components/ProfileModule';
import IncotermsSimulator from './components/IncotermsSimulator';
import NormativeLibrary from './components/NormativeLibrary';
import { AuthService, NotificationService } from './services';
import { LogIn, Bell } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [xp, setXp] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [lives, setLives] = useState(5);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    NotificationService.subscribe(setNotifications);
    const saved = localStorage.getItem('active_session');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('active_session');
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (showAuth) return <Auth onLogin={(c) => { 
      const res = AuthService.login(c.email, c.pass);
      if(res.success) { setUser(res.user!); setShowAuth(false); }
    }} onRegister={(d) => {
      AuthService.register(d.name, d.email, d.pass);
      setAuthMode('login');
    }} initialMode={authMode} onCancel={() => setShowAuth(false)} />;

    switch (currentView) {
      case 'dashboard': return <Dashboard setCurrentView={setCurrentView} xp={xp} completedCount={completedLessonIds.length} userName={user?.name || 'Invitado'} isGuest={!user} onAuthClick={() => { setAuthMode('register'); setShowAuth(true); }} />;
      case 'lessons': return <LessonModule xp={xp} lives={lives} completedLessonIds={completedLessonIds} onComplete={(id, earned) => { setCompletedLessonIds(p => [...p, id]); setXp(p => p + earned); setCurrentView('dashboard'); }} onLoseLife={() => setLives(l => Math.max(0, l - 1))} onResetLives={() => setLives(5)} />;
      case 'simulator': return <Simulator3D />;
      case 'calculator': return <CostCalculator />;
      case 'map': return <MapModule />;
      case 'incoterms': return <IncotermsSimulator />;
      case 'library': return <NormativeLibrary />;
      case 'profile': return <ProfileModule user={user} xp={xp} completedCount={completedLessonIds.length} onLogout={handleLogout} onClose={() => setCurrentView('dashboard')} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} isGuest={!user} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 md:h-20 border-b border-zinc-900 flex items-center justify-between px-4 md:px-10 bg-[#0a0a0a]/80 backdrop-blur-xl z-40 shrink-0">
          <div className="flex items-center gap-3">
             <div className="md:hidden w-8 h-8 rounded-lg bg-[#ff7a00] flex items-center justify-center font-black italic">C</div>
             <h1 className="text-[10px] md:text-xl font-black tracking-widest text-white uppercase italic">
                COMEX <span className="text-[#ff7a00]">ACADEMY</span>
             </h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-500">
              <Bell size={18} />
              {notifications.some(n => !n.read) && <div className="absolute top-1 right-1 w-2 h-2 bg-[#ff7a00] rounded-full" />}
            </button>
            {!user ? (
              <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="bg-[#ff7a00] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">INGRESAR</button>
            ) : (
              <div onClick={() => setCurrentView('profile')} className="w-10 h-10 rounded-xl bg-[#ff7a00] flex items-center justify-center font-black cursor-pointer hover:rotate-6 transition-transform shadow-lg">{user.name[0]}</div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;