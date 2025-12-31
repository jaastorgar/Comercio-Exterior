type Props = {
  x: number;
  y: number;
  z: number;
};

export default function Pallet3D({ x, y, z }: Props) {
  return (
    <mesh position={[x, y, z]} receiveShadow>
      <boxGeometry args={[1.2, 0.14, 1]} />
      <meshStandardMaterial color="#7c3f1d" />
    </mesh>
  );
}