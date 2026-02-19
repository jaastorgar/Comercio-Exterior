import client from '../../../api/client';
import { Container, Pallet, CargoSimulationRequest, CargoSimulationResponse } from '../types/logistics.types';

export const logisticsService = {
  // Obtener contenedores disponibles
  getContainers: async (): Promise<Container[]> => {
    const response = await client.get<Container[]>('/logistics/containers/');
    return response.data;
  },

  // NUEVO: Obtener tipos de pallets
  getPallets: async (): Promise<Pallet[]> => {
    const response = await client.get<Pallet[]>('/logistics/pallets/');
    return response.data;
  },

  // Ejecutar simulación
  simulate: async (data: CargoSimulationRequest): Promise<CargoSimulationResponse> => {
    const response = await client.post<CargoSimulationResponse>('/logistics/simulations/', {
      container: data.container_id, // El backend espera la ID del contenedor
      box_length: data.box_length,
      box_width: data.box_width,
      box_height: data.box_height,
      quantity: data.quantity
    });
    return response.data;
  },

  // NUEVO: Obtener historial del usuario
  getHistory: async (): Promise<CargoSimulationResponse[]> => {
    const response = await client.get<CargoSimulationResponse[]>('/logistics/simulations/');
    return response.data;
  }
};