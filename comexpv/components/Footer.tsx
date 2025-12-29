
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} ComexPV. Todos los derechos reservados.</p>
        <p className="text-sm text-gray-400 mt-2">Una plataforma educativa para el futuro de la logística.</p>
      </div>
    </footer>
  );
};

export default Footer;