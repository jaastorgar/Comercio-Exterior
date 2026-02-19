export interface ImportSimulationRequest {
  name: string;
  fob_value: number;
  freight: number;
  insurance: number;
  exchange_rate: number;
}

export interface ImportSimulationResponse extends ImportSimulationRequest {
  id: number;
  cif_usd: number;
  cif_clp: number;
  ad_valorem: number;
  iva: number;
  total_cost: number;
  created_at: string;
}