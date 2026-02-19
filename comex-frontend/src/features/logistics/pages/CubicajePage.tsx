import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { logisticsService } from '../services/logistics.service';
import { Container, CargoSimulationResponse } from '../types/logistics.types';
import '../styles/Logistics.css';

const CubicajePage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [boxDims, setBoxDims] = useState({ length: 0.5, width: 0.4, height: 0.3, quantity: 10 });
  const [result, setResult] = useState<CargoSimulationResponse | null>(null);

  // Referencias de Three.js
  const sceneRef = useRef(new THREE.Scene());
  const boxesGroupRef = useRef(new THREE.Group());

  useEffect(() => {
    loadContainers();
    initThreeJS();
  }, []);

  const loadContainers = async () => {
    try {
      const data = await logisticsService.getContainers();
      setContainers(data);
    } catch (e) { console.error(e); }
  };

  const initThreeJS = () => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Escena y Cámara
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(10, 10, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Luces (Crucial para ver el modelo)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // 3. Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    scene.add(boxesGroupRef.current);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Limpieza al desmontar
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  };

  const handleSimulate = async () => {
    if (!selectedContainer) return;
    
    try {
      const res = await logisticsService.simulate({
        container_id: Number(selectedContainer),
        box_length: boxDims.length,
        box_width: boxDims.width,
        box_height: boxDims.height,
        quantity: boxDims.quantity
      });
      setResult(res);
      update3D(res);
    } catch (e) { alert("Error en la simulación"); }
  };

  const update3D = (data: CargoSimulationResponse) => {
    boxesGroupRef.current.clear();
    const container = containers.find(c => c.id === data.container);
    if (!container) return;

    // Dibujar Contenedor (Cian Neón para visibilidad)
    const contGeom = new THREE.BoxGeometry(container.length, container.height, container.width);
    const contMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    boxesGroupRef.current.add(new THREE.Mesh(contGeom, contMat));

    // Dibujar Cajas (Naranja brillante)
    const boxGeom = new THREE.BoxGeometry(data.box_length, data.box_height, data.box_width);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0xffa500 });

    for (let i = 0; i < data.quantity; i++) {
      const box = new THREE.Mesh(boxGeom, boxMat);
      // Posicionamiento simple para visualización
      box.position.set(
        (Math.random() - 0.5) * (container.length * 0.8),
        (Math.random() - 0.5) * (container.height * 0.8),
        (Math.random() - 0.5) * (container.width * 0.8)
      );
      boxesGroupRef.current.add(box);
    }
  };

  return (
    <div className="logistics-container">
      <div className="logistics-header">
        <h1>Simulador de Cubicaje 3D</h1>
        <p>Optimiza el espacio de tus contenedores en tiempo real.</p>
      </div>

      <div className="logistics-layout">
        <div className="controls-panel">
          <h3>Configuración de Carga</h3>
          <div className="form-group">
            <label>Contenedor</label>
            <select className="form-input" value={selectedContainer} onChange={e => setSelectedContainer(e.target.value)}>
              <option value="">Seleccione un tipo...</option>
              {containers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid-inputs">
            <div className="form-group">
              <label>Largo (m)</label>
              <input type="number" step="0.1" value={boxDims.length} onChange={e => setBoxDims({...boxDims, length: +e.target.value})} />
            </div>
            <div className="form-group">
              <label>Ancho (m)</label>
              <input type="number" step="0.1" value={boxDims.width} onChange={e => setBoxDims({...boxDims, width: +e.target.value})} />
            </div>
            <div className="form-group">
              <label>Alto (m)</label>
              <input type="number" step="0.1" value={boxDims.height} onChange={e => setBoxDims({...boxDims, height: +e.target.value})} />
            </div>
            <div className="form-group">
              <label>Cantidad</label>
              <input type="number" value={boxDims.quantity} onChange={e => setBoxDims({...boxDims, quantity: +e.target.value})} />
            </div>
          </div>

          <button className="btn-calculate" onClick={handleSimulate}>Actualizar Visualización</button>

          {result && (
            <div className="metrics-bar">
              <div className="metric-item">
                <span className="metric-label">Uso Vol.</span>
                <span className="metric-value">{result.usage_percentage}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Estado</span>
                <span className={`metric-value ${result.fits ? 'fit-success' : 'fit-error'}`}>
                  {result.fits ? 'CABE' : 'NO CABE'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="visualizer-panel">
          <div className="viewport" ref={mountRef}></div>
          <p className="hint">Usa el mouse para rotar y la rueda para hacer zoom</p>
        </div>
      </div>
    </div>
  );
};

export default CubicajePage;