
import React, { useState } from 'react';

type Page = 'Inicio' | 'Cubicaje' | 'Logística' | 'Comercio Exterior' | 'Noticias' | 'Recursos' | 'Normativas' | 'Creadores';

interface HeaderProps {
  currentPage: Page;
  onNavClick: (page: Page) => void;
}

const navLinks: Page[] = ['Inicio', 'Cubicaje', 'Logística', 'Comercio Exterior', 'Noticias', 'Recursos', 'Normativas', 'Creadores'];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-primary shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavClick('Inicio')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l8 4" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Comex<span className="text-accent">PV</span></h1>
          </div>
          <nav className="hidden lg:flex space-x-7">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                onClick={(e) => { e.preventDefault(); onNavClick(link); }}
                className={`text-lg text-white hover:text-accent transition duration-300 ${currentPage === link ? 'text-accent font-semibold border-b-2 border-accent' : ''}`}
              >
                {link}
              </a>
            ))}
          </nav>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavClick(link); setIsOpen(false); }}
                  className={`block px-4 py-2 rounded text-white hover:bg-secondary ${currentPage === link ? 'bg-secondary font-semibold' : ''}`}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;