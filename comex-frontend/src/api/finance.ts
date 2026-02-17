// src/api/finance.ts
import { apiRequest } from "./client";

export interface ImportSimulationCreateData {
  fob_value: number;
  freight: number;
  insurance: number;
  exchange_rate: number;
}

export interface ImportSimulation {
  id: number;
  user: number | string;
  fob_value: string;
  freight: string;
  insurance: string;
  exchange_rate: string;
  cif: string;        // CLP (según tu serializer.create)
  ad_valorem: string; // CLP
  iva: string;        // CLP
  total_cost: string; // CLP
  created_at: string;
}

const ENDPOINT = "/finance/import-simulations/";

export async function createImportSimulation(data: ImportSimulationCreateData) {
  return apiRequest(ENDPOINT, "POST", data, true) as Promise<ImportSimulation>;
}

export async function listImportSimulations() {
  return apiRequest(ENDPOINT, "GET", undefined, true) as Promise<ImportSimulation[]>;
}