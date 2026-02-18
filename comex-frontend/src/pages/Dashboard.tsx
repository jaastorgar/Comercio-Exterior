import React, { useEffect } from "react";
import { ViewType } from "../types";
import { DashboardService } from "../services/dashboard.service";
import { getUserProfile, getUserProgress } from "../api/accounts";
import ServicesOverlay from "../components/ServicesOverlay";
import { ChevronRight, Package, Sparkles, Users, Newspaper, Cpu } from "lucide-react";
import "../css/Dashboard.css";

interface DashboardProps {
  setCurrentView: (view: ViewType) => void;
  xp: number;
  completedCount: number;
  userName: string;
  isGuest?: boolean;
  onAuthClick?: () => void;
  setXp: (xp: number) => void;
  setCompletedCount: (count: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  setCurrentView,
  xp,
  completedCount,
  userName,
  isGuest = false,
  onAuthClick,
  setXp,
}) => {
  const [showServices, setShowServices] = React.useState(false);

  // Sincronización automática al entrar al Dashboard
  useEffect(() => {
    if (!isGuest) {
      const syncData = async () => {
        try {
          const profile = await getUserProfile();
          setXp(profile.points);
        } catch (e) {
          console.error("Sync error", e);
        }
      };
      syncData();
    }
  }, []);

  const stats = DashboardService.getStats(xp, completedCount);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <div className="academy-label">
            <Sparkles size={12} /> ACADEMY OS v2.5
          </div>
          <h2 className="dashboard-title">Hola, {userName.split('@')[0]}</h2>
          <p className="dashboard-subtitle">Tu progreso de certificación está al día.</p>
        </div>

        <div className="dashboard-actions">
          <button onClick={() => setShowServices(true)} className="services-btn">
            <Cpu size={20} />
          </button>
          <button onClick={() => setCurrentView("lessons")} className="continue-btn">
            Ir a Lecciones
          </button>
        </div>
      </header>

      {/* Métricas Principales */}
      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </section>

      <section className="dashboard-main-grid">
        {/* Sección Simulador */}
        <div className="simulator-card" onClick={() => setCurrentView("simulator")}>
          <div className="card-content">
            <h3 className="simulator-title">Cubicaje Inteligente</h3>
            <p className="simulator-description">Calcula la estiba óptima en contenedores de 20' y 40'.</p>
            <span className="launch-tag">Lanzar Simulador</span>
          </div>
          <Package className="simulator-bg-icon" size={240} />
        </div>

        {/* Sección Noticias y Red */}
        <div className="sidebar-section">
          <div className="news-card">
            <div className="news-header">
              <Newspaper size={16} /> <span>Terminal News</span>
            </div>
            <div className="news-item">Actualización de Incoterms 2026.</div>
            <div className="news-item">Nuevas rutas marítimas activas.</div>
          </div>

          <div className="network-card" onClick={() => alert("Próximamente: Ranking de Usuarios")}>
            <div className="network-info">
              <Users size={24} />
              <div>
                <div className="network-title">Ranking Global</div>
                <div className="network-sub">Ver tu posición</div>
              </div>
            </div>
            <ChevronRight size={18} />
          </div>
        </div>
      </section>

      <ServicesOverlay isOpen={showServices} onClose={() => setShowServices(false)} />
    </div>
  );
};

export default Dashboard;