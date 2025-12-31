type Props = {
  x: number;
  y: number;
  z: number;
  length: number;
  width: number;
  height: number;
};

export default function Caja3D({
  x,
  y,
  z,
  length,
  width,
  height,
}: Props) {
  return (
    <mesh
      position={[x, y + 0.001, z]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, height, width]} />
      <meshStandardMaterial color="#2563eb" />
    </mesh>
  );
}