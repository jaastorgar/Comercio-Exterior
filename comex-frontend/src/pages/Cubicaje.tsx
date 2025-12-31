import { useEffect, useMemo, useState } from "react";
import { Escena3D } from "../components/three";
import {
  obtenerCubicaje,
  type ContainerCode,
  type ParametrosCubicaje,
  type RespuestaCubicaje,
} from "../api/cubicaje";

/* =========================
   Helpers
========================= */
function clamp(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

/* =========================
   Page
========================= */
export default function Cubicaje() {
  const [containerCode, setContainerCode] =
    useState<ContainerCode>("20DV");

  // caja (cm)
  const [lengthCm, setLengthCm] = useState(20);
  const [widthCm, setWidthCm] = useState(20);
  const [heightCm, setHeightCm] = useState(20);

  // backend limit
  const [quantity, setQuantity] = useState(20000);

  // visual only
  const [pallets, setPallets] = useState(5);
  const [allowRotation, setAllowRotation] = useState(true);

  const [resultado, setResultado] =
    useState<RespuestaCubicaje | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     PAYLOAD (SERIALIZER-ALIGNED)
  ========================= */
  const payload: ParametrosCubicaje = useMemo(
    () => ({
      container_code: containerCode,
      box: {
        length_cm: clamp(lengthCm, 0.1, 300),
        width_cm: clamp(widthCm, 0.1, 300),
        height_cm: clamp(heightCm, 0.1, 300),
      },
      quantity: clamp(quantity, 1, 20000),
      allow_rotation: allowRotation,
    }),
    [
      containerCode,
      lengthCm,
      widthCm,
      heightCm,
      quantity,
      allowRotation,
    ]
  );

  /* =========================
     Backend call
  ========================= */
  useEffect(() => {
    let cancel = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        const data = await obtenerCubicaje(payload);
        if (!cancel) setResultado(data);
      } catch (e: any) {
        if (!cancel) {
          setResultado(null);
          setError(e.message ?? "Error backend");
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => {
      cancel = true;
    };
  }, [payload]);

  /* =========================
     UI
  ========================= */
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 28,
        background:
          "radial-gradient(1200px 800px at 10% 10%, #0b1b35 0%, #040814 60%, #02040b 100%)",
        color: "#e5e7eb",
      }}
    >
      <h1 style={{ fontSize: 44, marginBottom: 6 }}>
        Cubicaje 3D
      </h1>
      <p style={{ opacity: 0.8 }}>
        Visualización logística basada en backend real
      </p>

      <section style={panelStyle}>
        <label>
          Contenedor
          <select
            value={containerCode}
            onChange={(e) =>
              setContainerCode(e.target.value as ContainerCode)
            }
          >
            <option value="20DV">20 DV</option>
            <option value="40DV">40 DV</option>
            <option value="40HC">40 HC</option>
          </select>
        </label>

        <div style={row}>
          <input
            type="number"
            value={lengthCm}
            onChange={(e) => setLengthCm(Number(e.target.value))}
            placeholder="Largo caja (cm)"
          />
          <input
            type="number"
            value={widthCm}
            onChange={(e) => setWidthCm(Number(e.target.value))}
            placeholder="Ancho caja (cm)"
          />
          <input
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            placeholder="Alto caja (cm)"
          />
        </div>

        <input
          type="number"
          value={quantity}
          max={20000}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Cantidad de cajas (máx 20.000)"
        />

        <input
          type="number"
          value={pallets}
          onChange={(e) => setPallets(Number(e.target.value))}
          placeholder="Pallets (solo visual)"
        />

        <label style={{ display: "flex", gap: 8 }}>
          <input
            type="checkbox"
            checked={allowRotation}
            onChange={(e) => setAllowRotation(e.target.checked)}
          />
          Permitir rotación
        </label>

        {loading && <p>Calculando…</p>}
        {error && <p style={{ color: "#fca5a5" }}>{error}</p>}
        {resultado && (
          <p>
            Caben <b>{resultado.fit_count}</b> cajas de{" "}
            <b>{resultado.requested}</b>
          </p>
        )}
      </section>

      {resultado && (
        <Escena3D datos={resultado} pallets={pallets} />
      )}
    </main>
  );
}

/* =========================
   Styles
========================= */
const panelStyle: React.CSSProperties = {
  marginTop: 20,
  maxWidth: 980,
  padding: 18,
  borderRadius: 16,
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  display: "grid",
  gap: 12,
};

const row: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
};