import { useMemo } from "react";

/**
 * Props del contenedor 3D
 */
type Props = {
  length_cm: number;
  width_cm: number;
  height_cm: number;
};

function cmAMetros(valor: number) {
  return valor / 100;
}

export default function Contenedor3D({
  length_cm,
  width_cm,
  height_cm,
}: Props) {
  const dimensiones = useMemo(
    () => [
      cmAMetros(length_cm),
      cmAMetros(height_cm),
      cmAMetros(width_cm),
    ] as [number, number, number],
    [length_cm, width_cm, height_cm]
  );

  const posicion: [number, number, number] = [
    dimensiones[0] / 2,
    dimensiones[1] / 2,
    dimensiones[2] / 2,
  ];

  return (
    <>
      {/* Piso del contenedor */}
      <mesh
        position={[
          dimensiones[0] / 2,
          0,
          dimensiones[2] / 2,
        ]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry
          args={[dimensiones[0], dimensiones[2]]}
        />
        <meshStandardMaterial
          color="#374151"
          side={2}
        />
      </mesh>

      {/* Contenedor wireframe */}
      <mesh position={posicion}>
        <boxGeometry args={dimensiones} />
        <meshBasicMaterial
          color="#e5e7eb"
          wireframe
        />
      </mesh>
    </>
  );
}