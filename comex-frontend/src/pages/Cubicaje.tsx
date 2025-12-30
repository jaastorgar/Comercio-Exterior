import { Escena3D } from "../components/three";

export default function Cubicaje() {
  return (
    <section style={{ padding: 40 }}>
      <h1>Cubicaje 3D</h1>

      <p>
        Visualización tridimensional de carga.
        Próximamente se mostrarán contenedores, pallets y cajas.
      </p>

      <Escena3D />
    </section>
  );
}