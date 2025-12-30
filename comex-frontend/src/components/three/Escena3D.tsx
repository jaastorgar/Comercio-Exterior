import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { AxesHelper, GridHelper } from "three";
import "./Escena3D.css";

import { obtenerCubicaje } from "../../api/cubicaje";
import type { RespuestaCubicaje } from "../../api/cubicaje";
import { Contenedor3D, Pallet3D } from "./index";

/**
 * Conversión cm → metros
 */
function cmAMetros(valor: number) {
  return valor / 100;
}

export default function Escena3D() {
  const [datos, setDatos] = useState<RespuestaCubicaje | null>(null);

  useEffect(() => {
    obtenerCubicaje()
      .then((respuesta) => setDatos(respuesta))
      .catch((error) => {
        console.error("Error al obtener cubicaje:", error);
      });
  }, []);

  if (!datos) {
    return <div className="escena-3d">Cargando cubicaje 3D…</div>;
  }

  /* ===============================
     Dimensiones del contenedor (m)
     =============================== */
  const contenedorLargo = cmAMetros(datos.container.length_cm);
  const contenedorAncho = cmAMetros(datos.container.width_cm);
  const contenedorAlto  = cmAMetros(datos.container.height_cm);

  /* ===============================
     Dimensiones de la caja (m)
     =============================== */
  const cajaLargo = cmAMetros(datos.box.length_cm);
  const cajaAncho = cmAMetros(datos.box.width_cm);
  const cajaAlto  = cmAMetros(datos.box.height_cm);

  /* ===============================
     Posición del pallet (centrado)
     =============================== */
  const palletX = contenedorLargo / 2;
  const palletZ = contenedorAncho / 2;

  return (
    <div className="escena-3d">
      <Canvas camera={{ position: [8, 5, 8], fov: 45 }}>
        {/* Luces */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 12, 5]} intensity={0.8} />

        {/* Ejes XYZ (X rojo, Y verde, Z azul) */}
        <primitive object={new AxesHelper(3)} />

        {/* Grilla base (referencia de escala) */}
        <primitive
          object={new GridHelper(10, 10, "#6b7280", "#374151")}
        />

        {/* Contenedor 3D (wireframe + piso) */}
        <Contenedor3D
          length_cm={datos.container.length_cm}
          width_cm={datos.container.width_cm}
          height_cm={datos.container.height_cm}
        />

        {/* Pallet base */}
        <Pallet3D
          x={palletX}
          y={0.01}   // evita z-fighting con el piso
          z={palletZ}
        />

        {/* ===============================
            Cajas con validación espacial
           =============================== */}
        {datos.positions.map((pos, index) => {
          // Posición de la caja en metros
          const x = cmAMetros(pos.x_cm);
          const y = cmAMetros(pos.z_cm); // eje vertical
          const z = cmAMetros(pos.y_cm);

          // ¿La caja se sale del contenedor?
          const fuera =
            x + cajaLargo > contenedorLargo ||
            z + cajaAncho > contenedorAncho ||
            y + cajaAlto  > contenedorAlto;

          return (
            <mesh key={index} position={[x, y, z]}>
              <boxGeometry
                args={[cajaLargo, cajaAlto, cajaAncho]}
              />
              <meshStandardMaterial
                color={fuera ? "#ef4444" : "#22c55e"}
              />
            </mesh>
          );
        })}

        {/* Controles de cámara */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}