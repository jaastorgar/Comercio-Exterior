import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Package,
  RotateCcw,
  Info,
  Cuboid,
  Layers,
} from "lucide-react";
import * as THREE from "three";

import "../styles/Simulator3D.css";
import {
  Container,
  createCargoSimulation,
  listCargoSimulations,
  listContainers,
  CargoSimulation,
} from "../api/logistics";

type BoxSettings = {
  length: number;
  width: number;
  height: number;
  quantity: number;
};

function toNumber(v: string | number) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return Number.isFinite(n) ? n : 0;
}

const Simulator3D: React.FC = () => {
  // Backend data
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(null);
  const [history, setHistory] = useState<CargoSimulation[]>([]);
  const [backendResult, setBackendResult] = useState<CargoSimulation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Inputs
  const [box, setBox] = useState<BoxSettings>({
    length: 0.40,
    width: 0.30,
    height: 0.30,
    quantity: 100,
  });

  // UI
  const [isLoading, setIsLoading] = useState(false);

  // Three.js refs
  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Selected container object
  const selectedContainer = useMemo(() => {
    if (!selectedContainerId) return null;
    return containers.find((c) => c.id === selectedContainerId) || null;
  }, [containers, selectedContainerId]);

  const containerDims = useMemo(() => {
    if (!selectedContainer) return { length: 0, width: 0, height: 0 };
    return {
      length: toNumber(selectedContainer.length),
      width: toNumber(selectedContainer.width),
      height: toNumber(selectedContainer.height),
    };
  }, [selectedContainer]);

  // Capacity calc (local): máximo teórico por encaje perfecto
  const capacity = useMemo(() => {
    if (!selectedContainer) return { fitX: 0, fitY: 0, fitZ: 0, maxBoxes: 0, efficiency: 0 };

    const fitX = Math.floor(containerDims.length / box.length);
    const fitY = Math.floor(containerDims.height / box.height);
    const fitZ = Math.floor(containerDims.width / box.width);

    const maxBoxes = Math.max(0, fitX * fitY * fitZ);

    const boxVol = box.length * box.width * box.height;
    const contVol = containerDims.length * containerDims.width * containerDims.height;
    const efficiency = contVol > 0 ? ((maxBoxes * boxVol) / contVol) * 100 : 0;

    return { fitX, fitY, fitZ, maxBoxes, efficiency };
  }, [box.height, box.length, box.width, containerDims.height, containerDims.length, containerDims.width, selectedContainer]);

  // Load containers (public) + load history (auth)
  async function refreshHistory() {
    try {
      const data = await listCargoSimulations();
      setHistory(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch {
      setHistory([]);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const data = await listContainers();
        setContainers(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedContainerId(data[0].id);
        }
      } catch {
        setErrorMsg("No se pudieron cargar los contenedores desde el backend.");
      }

      await refreshHistory();
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Three.js init
  useEffect(() => {
    if (!canvasRef.current) return;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const directionalLight = new THREE.DirectionalLight(0xff7a00, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x1a1a1a, 0x111111);
    scene.add(grid);

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (sceneRef.current && rendererRef.current && cameraRef.current) {
        sceneRef.current.rotation.y += 0.002;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (renderer.domElement && canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update 3D model when inputs/container change
  useEffect(() => {
    if (!sceneRef.current || !selectedContainer) return;

    // Remove previous meshes/lines (keep grid + lights)
    const keep = sceneRef.current.children.filter(
      (obj) => obj.type === "GridHelper" || obj.type.includes("Light")
    );
    sceneRef.current.children = keep;

    const contL = containerDims.length;
    const contW = containerDims.width;
    const contH = containerDims.height;

    // Container wireframe
    const containerGeom = new THREE.BoxGeometry(contL, contH, contW);
    const containerEdges = new THREE.EdgesGeometry(containerGeom);
    const containerMat = new THREE.LineBasicMaterial({ color: 0x333333 });
    const wireframe = new THREE.LineSegments(containerEdges, containerMat);
    wireframe.position.y = contH / 2;
    sceneRef.current.add(wireframe);

    // Boxes: render by quantity (no por máxima capacidad)
    const maxVisualBoxes = 5000;
    const qty = Math.max(0, Math.floor(box.quantity));
    const actualCount = Math.min(qty, maxVisualBoxes);

    const fitX = Math.max(0, Math.floor(contL / box.length));
    const fitY = Math.max(0, Math.floor(contH / box.height));
    const fitZ = Math.max(0, Math.floor(contW / box.width));

    const boxGeom = new THREE.BoxGeometry(box.length * 0.95, box.height * 0.95, box.width * 0.95);
    const boxMat = new THREE.MeshPhongMaterial({
      color: 0xff7a00,
      specular: 0x555555,
      shininess: 30,
      transparent: true,
      opacity: 0.9,
    });

    const instancedMesh = new THREE.InstancedMesh(boxGeom, boxMat, Math.max(1, actualCount));
    const dummy = new THREE.Object3D();

    let count = 0;
    outer: for (let x = 0; x < fitX; x++) {
      for (let y = 0; y < fitY; y++) {
        for (let z = 0; z < fitZ; z++) {
          if (count >= actualCount) break outer;

          const posX = x * box.length - contL / 2 + box.length / 2;
          const posY = y * box.height + box.height / 2;
          const posZ = z * box.width - contW / 2 + box.width / 2;

          dummy.position.set(posX, posY, posZ);
          dummy.updateMatrix();
          instancedMesh.setMatrixAt(count, dummy.matrix);
          count++;
        }
      }
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    sceneRef.current.add(instancedMesh);
  }, [box.height, box.length, box.quantity, box.width, containerDims.height, containerDims.length, containerDims.width, selectedContainer]);

  const handleReset = () => {
    setBackendResult(null);
    setErrorMsg(null);
    setBox({ length: 0.40, width: 0.30, height: 0.30, quantity: 100 });
  };

  const handleSimulateBackend = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setBackendResult(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setErrorMsg("No hay sesión activa. Inicia sesión para guardar simulaciones.");
        return;
      }
      if (!selectedContainerId) {
        setErrorMsg("Selecciona un contenedor.");
        return;
      }

      const payload = {
        container: selectedContainerId,
        box_length: box.length,
        box_width: box.width,
        box_height: box.height,
        quantity: Math.max(0, Math.floor(box.quantity)),
      };

      const created = await createCargoSimulation(payload);
      setBackendResult(created);
      await refreshHistory();
    } catch {
      setErrorMsg("No se pudo guardar la simulación. Revisa backend, CORS y la ruta del endpoint.");
    } finally {
      setIsLoading(false);
    }
  };

  const fitsLocal = box.quantity <= capacity.maxBoxes && capacity.maxBoxes > 0;

  return (
    <div className="s3d-container">
      <header className="s3d-header">
        <div className="s3d-title">
          <Cuboid size={26} />
          <div>
            <h2>Simulador de Cubicaje 3D</h2>
            <p>Conectado a backend (containers + simulations). Sin diseño complejo.</p>
          </div>
        </div>

        <div className="s3d-actions">
          <button className="s3d-btn" onClick={handleReset}>
            <RotateCcw size={16} /> Reset
          </button>
          <button className="s3d-btn s3d-btn-primary" onClick={handleSimulateBackend} disabled={isLoading}>
            <Package size={16} /> {isLoading ? "Guardando..." : "Simular (backend)"}
          </button>
        </div>
      </header>

      {errorMsg && <div className="s3d-error">{errorMsg}</div>}

      <div className="s3d-grid">
        <section className="s3d-panel">
          <h3>Inputs</h3>

          <div className="s3d-field">
            <label>Contenedor</label>
            <select
              value={selectedContainerId ?? ""}
              onChange={(e) => setSelectedContainerId(Number(e.target.value))}
            >
              {containers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.length} x {c.width} x {c.height} m)
                </option>
              ))}
            </select>
          </div>

          <div className="s3d-row">
            <div className="s3d-field">
              <label>Largo caja (m)</label>
              <input
                type="number"
                step="any"
                value={box.length}
                onChange={(e) => setBox((b) => ({ ...b, length: Number(e.target.value) || 0 }))}
              />
            </div>

            <div className="s3d-field">
              <label>Ancho caja (m)</label>
              <input
                type="number"
                step="any"
                value={box.width}
                onChange={(e) => setBox((b) => ({ ...b, width: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="s3d-row">
            <div className="s3d-field">
              <label>Alto caja (m)</label>
              <input
                type="number"
                step="any"
                value={box.height}
                onChange={(e) => setBox((b) => ({ ...b, height: Number(e.target.value) || 0 }))}
              />
            </div>

            <div className="s3d-field">
              <label>Cantidad</label>
              <input
                type="number"
                step="1"
                value={box.quantity}
                onChange={(e) => setBox((b) => ({ ...b, quantity: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="s3d-summary">
            <h4>
              Resumen local <Info size={16} />
            </h4>
            <div className="s3d-kv">
              <span>Capacidad máx. (encaje perfecto)</span>
              <strong>{capacity.maxBoxes}</strong>
            </div>
            <div className="s3d-kv">
              <span>Distribución (X/Y/Z)</span>
              <strong>
                {capacity.fitX}/{capacity.fitY}/{capacity.fitZ}
              </strong>
            </div>
            <div className="s3d-kv">
              <span>Eficiencia volumétrica aprox.</span>
              <strong>{capacity.efficiency.toFixed(2)}%</strong>
            </div>
            <div className={`s3d-pill ${fitsLocal ? "ok" : "bad"}`}>
              {fitsLocal ? "La cantidad cabe (local)" : "La cantidad NO cabe (local)"}
            </div>
          </div>

          <div className="s3d-summary">
            <h4>
              Resultado backend <Layers size={16} />
            </h4>

            {!backendResult ? (
              <p className="s3d-muted">Aún no hay simulación guardada en esta sesión.</p>
            ) : (
              <>
                <div className="s3d-kv">
                  <span>Uso (%)</span>
                  <strong>{Number(backendResult.usage_percentage).toFixed(2)}%</strong>
                </div>
                <div className="s3d-kv">
                  <span>¿Cabe?</span>
                  <strong>{backendResult.fits ? "Sí" : "No"}</strong>
                </div>
                <div className="s3d-kv">
                  <span>Volumen cajas</span>
                  <strong>{Number(backendResult.total_box_volume).toFixed(2)} m³</strong>
                </div>
                <div className="s3d-kv">
                  <span>Volumen contenedor</span>
                  <strong>{Number(backendResult.container_volume).toFixed(2)} m³</strong>
                </div>
              </>
            )}
          </div>

          <div className="s3d-summary">
            <h4>Historial</h4>
            {history.length === 0 ? (
              <p className="s3d-muted">Sin historial (o no hay sesión).</p>
            ) : (
              <ul className="s3d-history">
                {history.map((h) => (
                  <li key={h.id}>
                    <span>{new Date(h.created_at).toLocaleString("es-CL")}</span>
                    <strong>{Number(h.usage_percentage).toFixed(2)}%</strong>
                    <em>{h.fits ? "CABE" : "NO CABE"}</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="s3d-canvas-wrap">
          <div className="s3d-canvas" ref={canvasRef} />
          <p className="s3d-footnote">
            Render 3D: se dibuja por cantidad (máx. 5000 instancias).
          </p>
        </section>
      </div>
    </div>
  );
};

export default Simulator3D;