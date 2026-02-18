import client from '../../../api/client';
import { Container, CargoSimulationRequest, CargoSimulationResponse } from '../types/logistics.types';

export const logisticsService = {
  getContainers: async (): Promise<Container[]> => {
    const response = await client.get<Container[]>('/logistics/containers/');
    return response.data;
  },

  simulate: async (data: CargoSimulationRequest): Promise<CargoSimulationResponse> => {
    const response = await client.post<CargoSimulationResponse>('/logistics/simulations/', {
      container: data.container_id,
      box_length: data.box_length,
      box_width: data.box_width,
      box_height: data.box_height,
      quantity: data.quantity
    });
    return response.data;
  }
};