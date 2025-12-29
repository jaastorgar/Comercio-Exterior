
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Cubicaje from './pages/Cubicaje';
import Logistica from './pages/Logistica';
import ComercioExterior from './pages/ComercioExterior';
import Noticias from './pages/Noticias';
import Recursos from './pages/Recursos';
import Normativas from './pages/Normativas';
import Creadores from './pages/Creadores';

type Page = 'Inicio' | 'Cubicaje' | 'Logística' | 'Comercio Exterior' | 'Noticias' | 'Recursos' | 'Normativas' | 'Creadores';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('Inicio');

  const handleNavClick = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'Inicio':
        return <Inicio onNavigate={handleNavClick} />;
      case 'Cubicaje':
        return <Cubicaje />;
      case 'Logística':
        return <Logistica />;
      case 'Comercio Exterior':
        return <ComercioExterior />;
      case 'Noticias':
        return <Noticias />;
      case 'Recursos':
        return <Recursos />;
      case 'Normativas':
        return <Normativas />;
      case 'Creadores':
        return <Creadores />;
      default:
        return <Inicio onNavigate={handleNavClick} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-light text-dark">
      <Header currentPage={currentPage} onNavClick={handleNavClick} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
