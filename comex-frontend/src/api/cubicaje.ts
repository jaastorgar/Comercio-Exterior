import axios from "axios";

/* =========================
   Tipos
========================= */
export type ContainerCode = "20DV" | "40HC";

export interface ParametrosCubicaje {
  container_code: ContainerCode;
  box: {
    length_cm: number;
    width_cm: number;
    height_cm: number;
  };
  quantity: number;
  allow_rotation: boolean;
}

export interface BoxPosition {
  x: number;
  y: number;
  z: number;
  rotation?: [number, number, number];
}

export interface RespuestaCubicaje {
  container: {
    length: number;
    width: number;
    height: number;
  };
  box: {
    length: number;
    width: number;
    height: number;
  };
  fit_count: number;
  requested: number;
  boxes: BoxPosition[];
}

/* =========================
   Axios instance
========================= */
const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   API call (RUTA CORRECTA)
========================= */
export async function obtenerCubicaje(
  payload: ParametrosCubicaje
): Promise<RespuestaCubicaje> {
  const res = await api.post(
    "/api/logistics/pack/",
    payload
  );
  return res.data;
}