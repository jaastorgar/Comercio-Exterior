import React, { useEffect, useState } from 'react';
import { logisticsService } from '../services/logistics.service';
import { Container, CargoSimulationResponse } from '../types/logistics.types';
import CargoVisualizer from '../components/CargoVisualizer';
import '../styles/Logistics.css';

const CubicajePage: React.FC = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<number>(0);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    length: 0.5, // Metros por defecto
    width: 0.4,
    height: 0.3,
    quantity: 50
  });

  const [simulationResult, setSimulationResult] = useState<CargoSimulationResponse | null>(null);

  // Cargar contenedores al inicio
  useEffect(() => {
    const loadContainers = async () => {
      try {
        const data = await logisticsService.getContainers();
        setContainers(data);
        if (data.length > 0) setSelectedContainerId(data[0].id);
      } catch (error) {
        console.error("Error cargando contenedores", error);
      }
    };
    loadContainers();
  }, []);

  // Obtener objeto del contenedor seleccionado para pasarlo al 3D
  const activeContainer = containers.find(c => c.id === Number(selectedContainerId));

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContainer) return;

    try {
      const result = await logisticsService.simulate({
        container_id: activeContainer.id,
        box_length: formData.length,
        box_width: formData.width,
        box_height: formData.height,
        quantity: formData.quantity
      });
      setSimulationResult(result);
    } catch (error) {
      console.error("Error en simulación", error);
    }
  };

  return (
    <div className="logistics-container">
      <div className="logistics-header">
        <h1>Simulador de Cubicaje 3D</h1>
        <p>Visualiza cómo se distribuye tu carga dentro del contenedor.</p>
      </div>

      <div className="logistics-layout">
        
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div className="controls-panel">
          <form onSubmit={handleSimulate}>
            <div className="form-group">
              <label className="form-label">Tipo de Contenedor</label>
              <select 
                className="form-input"
                value={selectedContainerId}
                onChange={(e) => setSelectedContainerId(Number(e.target.value))}
              >
                {containers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Largo Caja (m)</label>
              <input type="number" step="0.01" className="form-input" 
                value={formData.length} 
                onChange={e => setFormData({...formData, length: Number(e.target.value)})} 
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Ancho Caja (m)</label>
              <input type="number" step="0.01" className="form-input" 
                value={formData.width} 
                onChange={e => setFormData({...formData, width: Number(e.target.value)})} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alto Caja (m)</label>
              <input type="number" step="0.01" className="form-input" 
                value={formData.height} 
                onChange={e => setFormData({...formData, height: Number(e.target.value)})} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad de Cajas</label>
              <input type="number" className="form-input" 
                value={formData.quantity} 
                onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} 
              />
            </div>

            <button type="submit" className="btn-primary">Actualizar 3D</button>
          </form>
        </div>

        {/* PANEL DERECHO: VISUALIZADOR 3D */}
        <div className="visualizer-panel">
          
          {activeContainer && (
            <CargoVisualizer 
              containerDims={{ l: parseFloat(activeContainer.length.toString()), w: parseFloat(activeContainer.width.toString()), h: parseFloat(activeContainer.height.toString()) }}
              boxDims={{ l: formData.length, w: formData.width, h: formData.height }}
              quantity={formData.quantity}
            />
          )}

          {simulationResult && (
            <div className="metrics-bar">
              <div className="metric-item">
                <span className="form-label">Ocupación</span>
                <span className="metric-value">{simulationResult.usage_percentage.toFixed(1)}%</span>
              </div>
              <div className="metric-item">
                <span className="form-label">Estado</span>
                <span className={`metric-value ${simulationResult.fits ? 'fit-success' : 'fit-error'}`}>
                  {simulationResult.fits ? 'CABE ✅' : 'NO CABE ❌'}
                </span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CubicajePage;