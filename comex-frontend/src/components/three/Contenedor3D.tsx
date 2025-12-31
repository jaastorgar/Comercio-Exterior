import * as THREE from "three";

type Props = {
  length: number;
  width: number;
  height: number;
};

export default function Contenedor3D({ length, width, height }: Props) {
  const geom = new THREE.BoxGeometry(length, height, width);
  const edges = new THREE.EdgesGeometry(geom);

  return (
    <group position={[0, height / 2, 0]}>
      {/* Wireframe */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#e5e7eb" opacity={0.6} transparent />
      </lineSegments>

      {/* Piso */}
      <mesh position={[0, -height / 2 + 0.01, 0]} receiveShadow>
        <boxGeometry args={[length, 0.02, width]} />
        <meshStandardMaterial color="#3f2a14" />
      </mesh>
    </group>
  );
}