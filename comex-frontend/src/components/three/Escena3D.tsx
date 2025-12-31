import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { useMemo } from "react";

import Caja3D from "./Caja3D";
import Pallet3D from "./Pallet3D";
import Contenedor3D from "./Contenedor3D";

type BoxBackend = {
  length: number;
  width: number;
  height: number;
};

type PositionBackend = {
  x: number;
  y: number;
  z: number;
};

type DatosCubicaje = {
  container: {
    length: number;
    width: number;
    height: number;
  };
  box: BoxBackend;
  positions: PositionBackend[];
};

type Props = {
  datos: DatosCubicaje;
  pallets?: number;
};

const cmToM = (cm: number) => cm / 100;
const safe = (n: number, fallback = 0) =>
  Number.isFinite(n) ? n : fallback;

export default function Escena3D({ datos, pallets = 0 }: Props) {
  const L = safe(datos.container.length, 5.9);
  const W = safe(datos.container.width, 2.35);
  const H = safe(datos.container.height, 2.39);

  const bl = cmToM(safe(datos.box.length, 20));
  const bw = cmToM(safe(datos.box.width, 20));
  const bh = cmToM(safe(datos.box.height, 20));

  const offsetX = -L / 2;
  const offsetZ = -W / 2;

  const MAX_RENDER = 1200;

  const cajas = useMemo(
    () =>
      datos.positions.slice(0, MAX_RENDER).map((p, i) => (
        <Caja3D
          key={i}
          x={offsetX + cmToM(p.x) + bl / 2}
          y={cmToM(p.y) + bh / 2}
          z={offsetZ + cmToM(p.z) + bw / 2}
          length={bl}
          width={bw}
          height={bh}
        />
      )),
    [datos.positions, bl, bw, bh, offsetX, offsetZ]
  );

  const palletsMeshes = useMemo(() => {
    const out = [];
    const gap = 0.1;
    const pl = 1.2;
    const pw = 1.0;

    const cols = Math.max(1, Math.floor(W / (pw + gap)));
    const rows = Math.max(1, Math.floor(L / (pl + gap)));

    let placed = 0;

    for (let r = 0; r < rows && placed < pallets; r++) {
      for (let c = 0; c < cols && placed < pallets; c++) {
        out.push(
          <Pallet3D
            key={`p-${placed}`}
            x={offsetX + pl / 2 + r * (pl + gap)}
            y={0.02}
            z={offsetZ + pw / 2 + c * (pw + gap)}
          />
        );
        placed++;
      }
    }
    return out;
  }, [pallets, L, W, offsetX, offsetZ]);

  return (
    <Canvas
      shadows
      camera={{ position: [L, H * 1.2, W], fov: 45 }}
      style={{ height: 520, marginTop: 24 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />

      <OrbitControls makeDefault />
      <Grid
        args={[Math.max(L, W) * 2, Math.max(L, W) * 2]}
        cellSize={0.5}
        sectionSize={2}
        fadeDistance={40}
      />

      <Contenedor3D length={L} width={W} height={H} />
      {palletsMeshes}
      {cajas}
    </Canvas>
  );
}