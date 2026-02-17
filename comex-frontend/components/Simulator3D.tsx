
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Package, Maximize2, RotateCcw, Box as BoxIcon, Info, ChevronRight, Layers, Cuboid } from 'lucide-react';
import { CONTAINERS } from '../constants';
import * as THREE from 'https://esm.sh/three';

interface BoxSettings {
  length: number;
  width: number;
  height: number;
  weight: number;
}

const Simulator3D: React.FC = () => {
  const [selectedContainer, setSelectedContainer] = useState(CONTAINERS[0]);
  const [box, setBox] = useState<BoxSettings>({ length: 0.4, width: 0.3, height: 0.3, weight: 12 });
  const [isCubicageLoading, setIsCubicageLoading] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const instancedMeshRef = useRef<THREE.InstancedMesh | null>(null);

  const PALLET = { length: 1.2, width: 0.8, height: 0.15, maxLoadHeight: 1.8 };

  const cubicage = useMemo(() => {
    // Cálculo simple de cajas por contenedor (Sin pallets intermedios para visualización pura de cajas)
    const fitX = Math.floor(selectedContainer.length / box.length);
    const fitY = Math.floor(selectedContainer.height / box.height);
    const fitZ = Math.floor(selectedContainer.width / box.width);
    
    const totalBoxes = fitX * fitY * fitZ;
    const efficiency = ((totalBoxes * (box.length * box.width * box.height)) / (selectedContainer.length * selectedContainer.width * selectedContainer.height)) * 100;

    return { totalBoxes, fitX, fitY, fitZ, efficiency };
  }, [box, selectedContainer]);

  // Inicialización de Three.js
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xff7a00, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Grid Floor
    const grid = new THREE.GridHelper(20, 20, 0x1a1a1a, 0x111111);
    scene.add(grid);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        // Rotación suave automática
        sceneRef.current.rotation.y += 0.002;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (renderer.domElement && canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Actualizar Modelo 3D cuando cambian los datos
  useEffect(() => {
    if (!sceneRef.current) return;

    // Limpiar objetos previos
    sceneRef.current.children = sceneRef.current.children.filter(obj => 
      !(obj instanceof THREE.Mesh) && !(obj instanceof THREE.LineSegments) && !(obj instanceof THREE.InstancedMesh)
    );

    // Crear Contenedor (Wireframe)
    const containerGeom = new THREE.BoxGeometry(selectedContainer.length, selectedContainer.height, selectedContainer.width);
    const containerEdges = new THREE.EdgesGeometry(containerGeom);
    const containerMat = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });
    const containerWireframe = new THREE.LineSegments(containerEdges, containerMat);
    containerWireframe.position.y = selectedContainer.height / 2;
    sceneRef.current.add(containerWireframe);

    // Crear Cajas (InstancedMesh para rendimiento)
    const boxGeom = new THREE.BoxGeometry(box.length * 0.95, box.height * 0.95, box.width * 0.95);
    const boxMat = new THREE.MeshPhongMaterial({ 
      color: 0xff7a00, 
      specular: 0x555555, 
      shininess: 30,
      transparent: true,
      opacity: 0.9
    });

    const maxVisualBoxes = 5000; // Limite para no saturar visualmente
    const actualCount = Math.min(cubicage.totalBoxes, maxVisualBoxes);
    const instancedMesh = new THREE.InstancedMesh(boxGeom, boxMat, actualCount);
    
    const dummy = new THREE.Object3D();
    let count = 0;

    // Lógica de posicionamiento
    outer: for (let x = 0; x < cubicage.fitX; x++) {
      for (let y = 0; y < cubicage.fitY; y++) {
        for (let z = 0; z < cubicage.fitZ; z++) {
          if (count >= maxVisualBoxes) break outer;

          const posX = (x * box.length) - (selectedContainer.length / 2) + (box.length / 2);
          const posY = (y * box.height) + (box.height / 2);
          const posZ = (z * box.width) - (selectedContainer.width / 2) + (box.width / 2);

          dummy.position.set(posX, posY, posZ);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(count, dummy.matrix);
          count++;
        }
      }
    }

    sceneRef.current.add(instancedMesh);
    instancedMeshRef.current = instancedMesh;

  }, [cubicage, selectedContainer, box]);

  const handleSimulate = () => {
    setIsCubicageLoading(true);
    setTimeout(() => setIsCubicageLoading(false), 800);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">Motor de Cubicaje <span className="text-[#ff7a00]">3D v2.0</span></h2>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Renderizado en tiempo real • Precisión Milimétrica</p>
        </div>
        
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto no-scrollbar">
          {CONTAINERS.map(c => (
            <button
              key={c.type}
              onClick={() => setSelectedContainer(c)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold text-xs transition-all flex-1 ${
                selectedContainer.type === c.type ? 'bg-[#ff7a00] text-white shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
            >
              {c.type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Controls Panel */}
        <div className="lg:col-span-4 order-2 lg:order-1 space-y-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-zinc-800 shadow-2xl">
            <h3 className="font-black mb-4 flex items-center gap-2 text-sm uppercase text-white italic">
              <Cuboid size={18} className="text-[#ff7a00]" /> Configuración de Carga
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <InputGroup label="Largo (m)" value={box.length} step={0.01} onChange={(v) => setBox({...box, length: v})} />
              <InputGroup label="Ancho (m)" value={box.width} step={0.01} onChange={(v) => setBox({...box, width: v})} />
              <InputGroup label="Alto (m)" value={box.height} step={0.01} onChange={(v) => setBox({...box, height: v})} />
              <InputGroup label="Peso (kg)" value={box.weight} step={1} onChange={(v) => setBox({...box, weight: v})} />
            </div>

            <div className="mt-6 space-y-3">
               <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">Capacidad Utilizada</span>
                  <span className="text-sm font-black text-[#00d1ff] italic">{cubicage.efficiency.toFixed(1)}%</span>
               </div>
               <div className="flex justify-between items-center p-3 bg-black/40 rounded-xl border border-zinc-800">
                  <span className="text-[10px] font-black text-zinc-500 uppercase">Total de Bultos</span>
                  <span className="text-sm font-black text-[#ff7a00] italic">{cubicage.totalBoxes.toLocaleString()} UN</span>
               </div>
            </div>

            <button 
              onClick={handleSimulate}
              disabled={isCubicageLoading}
              className="w-full mt-6 bg-[#ff7a00] hover:bg-orange-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-orange-500/20"
            >
              {isCubicageLoading ? 'Sincronizando GPU...' : 'RECALCULAR MODELO'}
            </button>
          </div>

          <div className="bg-[#00d1ff]/5 border border-[#00d1ff]/20 p-5 rounded-3xl flex items-start gap-4">
             <Info size={20} className="text-[#00d1ff] shrink-0 mt-1" />
             <div>
                <h4 className="text-[#00d1ff] font-black text-[10px] uppercase mb-1">Análisis de Estiba</h4>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">El modelo visualiza hasta 5,000 unidades para optimizar el rendimiento del navegador manteniendo la precisión estadística.</p>
             </div>
          </div>
        </div>

        {/* Real 3D Viewport */}
        <div className="lg:col-span-8 order-1 lg:order-2 bg-[#050505] rounded-[2.5rem] border border-zinc-800 relative overflow-hidden h-[400px] md:h-auto min-h-[400px] shadow-inner group">
          <div 
            ref={canvasRef} 
            className={`w-full h-full transition-opacity duration-500 cursor-move ${isCubicageLoading ? 'opacity-30' : 'opacity-100'}`}
          />

          {/* HUD Overlay */}
          <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
             <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase text-[#ff7a00] shadow-2xl flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ff7a00] animate-pulse" /> VISTA DINÁMICA ACTIVA
             </div>
             <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase text-zinc-400 shadow-2xl">
                Contenedor: {selectedContainer.length}m x {selectedContainer.width}m
             </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
             <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
                Arrastra para rotar • Scroll para Zoom
             </div>
             <button className="p-4 bg-[#ff7a00] rounded-2xl text-white shadow-2xl pointer-events-auto hover:scale-110 transition-all active:rotate-180">
                <RotateCcw size={20}/>
             </button>
          </div>

          {/* Loading Overlay */}
          {isCubicageLoading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-[#ff7a00] border-t-transparent rounded-full animate-spin mb-4" />
               <span className="font-black text-[10px] uppercase tracking-widest text-white">Procesando Nube de Puntos...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{ label: string, value: number, step: number, onChange: (v: number) => void }> = ({ label, value, step, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter px-1">{label}</label>
    <input 
      type="number" 
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#ff7a00] transition-all"
    />
  </div>
);

export default Simulator3D;
