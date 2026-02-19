import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UserProfileWidget from '../../accounts/components/UserProfileWidget';
import { ratesService, ExchangeRate } from '../../rates/service/rates.service';
import '../styles/Dashboard.css';

const DashboardPage: React.FC = () => {
  const [dolarObs, setDolarObs] = useState<ExchangeRate | null>(null);
  const [dolarAduana, setDolarAduana] = useState<ExchangeRate | null>(null);

  // Cargar indicadores económicos al inicio
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const obs = await ratesService.getLatestRate('observed');
        const customs = await ratesService.getLatestRate('customs');
        setDolarObs(obs);
        setDolarAduana(customs);
      } catch (error) {
        console.error("Error cargando indicadores", error);
      }
    };
    fetchRates();
  }, []);

  return (
    <div className="dashboard-container">
      {/* 1. Header: Saludo y Datos en Vivo */}
      <header className="dashboard-header">
        <div className="welcome-text">
          <h1>Panel de Control</h1>
          <UserProfileWidget /> 
        </div>

        <div className="rates-ticker">
          <div className="rate-card">
            <span className="rate-label">USD Observado</span>
            <span className="rate-value">
              {dolarObs ? `$${dolarObs.value}` : 'Cargando...'}
            </span>
          </div>
          <div className="rate-card">
            <span className="rate-label">USD Aduana</span>
            <span className="rate-value">
              {dolarAduana ? `$${dolarAduana.value}` : 'Cargando...'}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Grid de Herramientas Principales */}
      <div className="dashboard-grid">
        
        {/* NUEVA OPCIÓN: MI PERFIL */}
        <Link to="/profile" className="action-card highlight-card">
          <div className="card-icon">👤</div>
          <div>
            <h3 className="card-title">Mi Perfil</h3>
            <p className="card-desc">Gestiona tu biografía, avatar y revisa tu nivel actual.</p>
          </div>
        </Link>

        {/* LOGÍSTICA */}
        <Link to="/logistics/cubicaje" className="action-card">
          <div className="card-icon">📦</div>
          <div>
            <h3 className="card-title">Cubicaje 3D</h3>
            <p className="card-desc">Optimiza la carga de contenedores y pallets.</p>
          </div>
        </Link>

        {/* FINANZAS */}
        <Link to="/finance/calculator" className="action-card">
          <div className="card-icon">💰</div>
          <div>
            <h3 className="card-title">Calculadora Import</h3>
            <p className="card-desc">Estima costos, impuestos y derechos.</p>
          </div>
        </Link>

        {/* ACADEMIA (Cursos) */}
        <Link to="/academy" className="action-card">
          <div className="card-icon">🎓</div>
          <div>
            <h3 className="card-title">Mi Academia</h3>
            <p className="card-desc">Continúa tus lecciones y gana puntos.</p>
          </div>
        </Link>

        {/* NORMATIVA */}
        <Link to="/regulatory" className="action-card">
          <div className="card-icon">⚖️</div>
          <div>
            <h3 className="card-title">Biblioteca Legal</h3>
            <p className="card-desc">Buscador de normas ISO, SAG y Aduanas.</p>
          </div>
        </Link>
      </div>

      {/* 3. Sección Social (Resumen) */}
      <div className="networking-section">
        <h3 style={{ marginBottom: '1rem' }}>📡 Red de Estudiantes</h3>
        <p style={{ color: '#aaa' }}>
          Conecta con compañeros de tu institución. 
          <Link to="/networking" style={{ color: '#4A008B', marginLeft: '5px', fontWeight: 'bold' }}>
            Ir al muro social →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;