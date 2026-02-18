import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- IMPORTS DE TUS PÁGINAS ---
import LoginPage from './features/accounts/pages/LoginPage';
import RegisterPage from './features/accounts/pages/RegisterPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import ImportCalculatorPage from './features/finance/pages/ImportCalculatorPage';
import CubicajePage from './features/logistics/pages/CubicajePage';
import SocialFeedPage from './features/networking/pages/SocialFeedPage';
import StudentsPage from './features/networking/pages/StudentsPage';
import RegulatoryPage from './features/regulatory/pages/RegulatoryPage';

// --- COMPONENTE DE RUTA PROTEGIDA ---
// CORRECCIÓN: Usamos React.ReactNode en lugar de JSX.Element para evitar el error de tipos
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // React.ReactNode satisface el requerimiento de retorno
  return <>{children}</>;
};

// --- APP PRINCIPAL CON RUTAS ---
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas (Requieren Login) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Finanzas */}
        <Route 
          path="/finance/calculator" 
          element={
            <ProtectedRoute>
              <ImportCalculatorPage />
            </ProtectedRoute>
          } 
        />

        {/* Logística (3D) */}
        <Route 
          path="/logistics/cubicaje" 
          element={
            <ProtectedRoute>
              <CubicajePage />
            </ProtectedRoute>
          } 
        />

        {/* Networking (Muro Social) */}
        <Route 
          path="/networking" 
          element={
            <ProtectedRoute>
              <SocialFeedPage />
            </ProtectedRoute>
          } 
        />

        {/* Networking (Buscador Estudiantes) */}
        <Route 
          path="/networking/students" 
          element={
            <ProtectedRoute>
              <StudentsPage />
            </ProtectedRoute>
          } 
        />

        {/* Normativa (Biblioteca) */}
        <Route 
          path="/regulatory" 
          element={
            <ProtectedRoute>
              <RegulatoryPage />
            </ProtectedRoute>
          } 
        />

        {/* Ruta por defecto: Redirigir al Dashboard si entra a la raíz "/" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Ruta 404: Cualquier cosa rara va al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;