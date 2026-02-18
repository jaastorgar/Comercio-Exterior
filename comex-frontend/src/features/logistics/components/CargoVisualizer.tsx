import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  containerDims: { l: number; w: number; h: number }; // Dimensiones Contenedor
  boxDims: { l: number; w: number; h: number };       // Dimensiones Caja
  quantity: number;
}

const CargoVisualizer: React.FC<Props> = ({ containerDims, boxDims, quantity }) => {
  
  // Algoritmo simple para calcular posiciones de las cajas (Estiba básica)
  const boxes = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    if (quantity <= 0 || boxDims.l <= 0) return positions;

    // Cuántas caben por eje
    const countX = Math.floor(containerDims.l / boxDims.l); // Largo
    const countZ = Math.floor(containerDims.w / boxDims.w); // Ancho
    const countY = Math.floor(containerDims.h / boxDims.h); // Alto

    let placed = 0;

    // Loop de estiba (llenar piso por piso)
    for (let y = 0; y < countY; y++) {
      for (let x = 0; x < countX; x++) {
        for (let z = 0; z < countZ; z++) {
          if (placed >= quantity) return positions;
          
          // Calcular centro de la caja en el espacio 3D
          // Ajustamos para que empiece desde la esquina del contenedor
          const posX = (x * boxDims.l) + (boxDims.l / 2) - (containerDims.l / 2);
          const posY = (y * boxDims.h) + (boxDims.h / 2) - (containerDims.h / 2);
          const posZ = (z * boxDims.w) + (boxDims.w / 2) - (containerDims.w / 2);

          positions.push(new THREE.Vector3(posX, posY, posZ));
          placed++;
        }
      }
    }
    return positions;
  }, [containerDims, boxDims, quantity]);

  return (
    <div style={{ width: '100%', height: '500px', background: '#111', borderRadius: '16px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <OrbitControls makeDefault />
        <Grid infiniteGrid fadeDistance={20} sectionColor="#4A6CFF" cellColor="#333" />

        {/* 1. EL CONTENEDOR (Representación Alámbrica) */}
        <mesh>
          <boxGeometry args={[containerDims.l, containerDims.h, containerDims.w]} />
          <meshBasicMaterial color="#4A6CFF" wireframe transparent opacity={0.3} />
        </mesh>

        {/* 2. LAS CAJAS (InstancedMesh para rendimiento) */}
        {boxes.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <boxGeometry args={[boxDims.l * 0.98, boxDims.h * 0.98, boxDims.w * 0.98]} /> 
            {/* *0.98 para dejar un pequeño borde visual entre cajas */}
            <meshStandardMaterial color="#F57C00" />
          </mesh>
        ))}
      </Canvas>
    </div>
  );
};

export default CargoVisualizer;