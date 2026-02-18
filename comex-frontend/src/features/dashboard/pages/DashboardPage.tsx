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
            <span className="rate-label">Dólar Observado</span>
            <span className="rate-value">
              {dolarObs ? `$${dolarObs.value}` : 'Cargando...'}
            </span>
          </div>
          <div className="rate-card">
            <span className="rate-label">Dólar Aduanero</span>
            <span className="rate-value">
              {dolarAduana ? `$${dolarAduana.value}` : 'Cargando...'}
            </span>
          </div>
        </div>
      </header>

      <hr style={{ borderColor: '#333', marginBottom: '2rem' }} />

      {/* 2. Grid de Servicios Principales */}
      <div className="dashboard-grid">
        
        {/* LOGÍSTICA */}
        <Link to="/logistics/cubicaje" className="action-card">
          <div className="card-icon">📦</div>
          <div>
            <h3 className="card-title">Cubicar Carga</h3>
            <p className="card-desc">Simula contenedores y pallets en 3D.</p>
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
          <Link to="/networking" style={{ color: '#4A6CFF', marginLeft: '10px' }}>
            Ir al muro social &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;