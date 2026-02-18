import React from "react";
import "../styles/Dashboard.css";

interface ServicesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServicesOverlay: React.FC<ServicesOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Servicios Disponibles</h2>
        <p>Próximamente más herramientas avanzadas.</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ServicesOverlay;