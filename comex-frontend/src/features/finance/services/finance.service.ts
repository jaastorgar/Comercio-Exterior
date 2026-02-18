import client from '../../../api/client';
import { ImportSimulationRequest, ImportSimulationResponse } from '../types/finance.types';

export const financeService = {
  // Crear nueva simulación (Calcular)
  calculate: async (data: ImportSimulationRequest): Promise<ImportSimulationResponse> => {
    const response = await client.post<ImportSimulationResponse>('/finance/simulations/', data);
    return response.data;
  },

  // Obtener historial de cálculos guardados
  getHistory: async (): Promise<ImportSimulationResponse[]> => {
    const response = await client.get<ImportSimulationResponse[]>('/finance/simulations/');
    return response.data;
  }
};