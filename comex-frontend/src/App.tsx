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
import AcademyPage from './features/academy/pages/AcademyPage';
import LessonPlayerPage from './features/academy/pages/LessonPlayerPage';
import ProfilePage from './features/accounts/pages/ProfilePage';

// --- COMPONENTE DE RUTA PROTEGIDA ---
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
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

        {/* --- RUTAS PRIVADAS --- */}
        
        {/* Dashboard Principal */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* ACADEMIA (NUEVO) */}
        {/* Menú Principal de Cursos */}
        <Route 
          path="/academy" 
          element={
            <ProtectedRoute>
              <AcademyPage />
            </ProtectedRoute>
          } 
        />
        {/* Reproductor de Lecciones */}
        <Route 
          path="/academy/play/:courseId" 
          element={
            <ProtectedRoute>
              <LessonPlayerPage />
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

        {/* Perfil de Usuario */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;