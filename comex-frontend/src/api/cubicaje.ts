import { apiFetch } from "./client";

/**
 * Tipos de datos que vienen del backend
 */
export type PosicionCaja = {
  x_cm: number;
  y_cm: number;
  z_cm: number;
};

export type RespuestaCubicaje = {
  container: {
    code: string;
    length_cm: number;
    width_cm: number;
    height_cm: number;
  };
  box: {
    length_cm: number;
    width_cm: number;
    height_cm: number;
    rotated_base: boolean;
  };
  fit_count: number;
  requested: number;
  positions: PosicionCaja[];
  note: string;
};

/**
 * Llamada al backend para calcular cubicaje
 */
export function obtenerCubicaje() {
  return apiFetch<RespuestaCubicaje>("/logistics/pack/", {
    method: "POST",
    body: JSON.stringify({
      container_code: "20DV",
      box: {
        length_cm: 40,
        width_cm: 30,
        height_cm: 25,
      },
      quantity: 50,
      allow_rotation: true,
    }),
  });
}