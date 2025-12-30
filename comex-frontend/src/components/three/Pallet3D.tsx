/**
 * Pallet3D
 * --------
 * Representa un pallet estándar (americano).
 */

type Props = {
  x: number;
  y: number;
  z: number;
};

export default function Pallet3D({ x, y, z }: Props) {
  return (
    <mesh position={[x, y + 0.075, z]}>
      <boxGeometry args={[1.2, 0.15, 1]} />
      <meshStandardMaterial color="#a16207" />
    </mesh>
  );
}