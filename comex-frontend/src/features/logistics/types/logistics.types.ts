export interface Container {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight: number;
}

export interface Pallet {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
}

export interface CargoSimulationRequest {
  container_id: number;
  box_length: number;
  box_width: number;
  box_height: number;
  quantity: number;
}

export interface CargoSimulationResponse {
  id: number;
  container: number;
  box_length: number;
  box_width: number;
  box_height: number;
  quantity: number;
  total_box_volume: number;
  container_volume: number;
  usage_percentage: number;
  fits: boolean;
  created_at: string;
}