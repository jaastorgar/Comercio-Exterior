import { apiRequest } from "./client";

export interface Container {
  id: number;
  name: string;
  length: string;     // viene como string (DecimalField)
  width: string;
  height: string;
  max_weight: string;
}

export interface Pallet {
  id: number;
  name: string;
  length: string;
  width: string;
  height: string;
}

export interface CargoSimulationCreateData {
  container: number;      // FK id
  box_length: number;
  box_width: number;
  box_height: number;
  quantity: number;
}

export interface CargoSimulation {
  id: number;
  user: number | string;
  container: number;
  box_length: string;
  box_width: string;
  box_height: string;
  quantity: number;

  total_box_volume: string;
  container_volume: string;
  usage_percentage: string;
  fits: boolean;

  created_at: string;
}

const BASE = "/logistics";

export async function listContainers() {
  return apiRequest(`${BASE}/containers/`, "GET") as Promise<Container[]>;
}

export async function listPallets() {
  return apiRequest(`${BASE}/pallets/`, "GET") as Promise<Pallet[]>;
}

export async function createCargoSimulation(data: CargoSimulationCreateData) {
  return apiRequest(`${BASE}/simulations/`, "POST", data, true) as Promise<CargoSimulation>;
}

export async function listCargoSimulations() {
  return apiRequest(`${BASE}/simulations/`, "GET", undefined, true) as Promise<CargoSimulation[]>;
}