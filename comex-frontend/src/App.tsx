import { useEffect, useState } from "react";
// Importaciones corregidas según explorador de archivos
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import LessonModule from "./pages/LessonModule";
import { getUserProfile, getUserProgress } from "./api/accounts";
import { ViewType } from "./types";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  const [xp, setXp] = useState(0);
  const [lives, setLives] = useState(5);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const profile = await getUserProfile();
        setUserName(profile.email);
        setXp(profile.points);
        
        const progress = await getUserProgress();
        setCompletedLessonIds(progress.map((p: any) => p.lesson));
        
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [isAuthenticated]);

  const handleLessonComplete = (lessonId: string, earnedXp: number) => {
    setXp(prev => prev + earnedXp);
    setCompletedLessonIds(prev => [...prev, lessonId]);
    setCurrentView("dashboard");
  };

  const handleLoseLife = () => setLives(prev => Math.max(0, prev - 1));
  const handleResetLives = () => setLives(5);

  if (isAuthenticated === null) return <div className="loading">Cargando Sistema...</div>;

  if (!isAuthenticated) {
    return authMode === "login" ? (
      <Login 
        onSuccess={() => setIsAuthenticated(true)} 
        onRegisterClick={() => setAuthMode("register")} 
      />
    ) : (
      <Register 
        onRegistered={() => setAuthMode("login")} 
        onLoginClick={() => setAuthMode("login")} 
      />
    );
  }

  return (
    <main className="app-main">
      {currentView === "dashboard" && (
        <Dashboard 
          setCurrentView={setCurrentView}
          xp={xp}
          completedCount={completedLessonIds.length}
          userName={userName}
          setXp={setXp}
          setCompletedCount={() => {}} 
          isGuest={false}
        />
      )}

      {currentView === "lessons" && (
        <LessonModule 
          xp={xp}
          lives={lives}
          completedLessonIds={completedLessonIds}
          onComplete={handleLessonComplete}
          onLoseLife={handleLoseLife}
          onResetLives={handleResetLives}
        />
      )}

      {currentView === "simulator" && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-white font-black italic">MOTOR DE CUBICAJE 3D</h2>
            <button 
              onClick={() => setCurrentView("dashboard")}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg"
            >
              VOLVER AL PANEL
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Cargando entorno de simulación...
          </div>
        </div>
      )}
    </main>
  );
}

export default App;