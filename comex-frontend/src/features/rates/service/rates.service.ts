import client from '../../../api/client';

export interface ExchangeRate {
    id: number;
    rate_type: 'observed' | 'customs';
    date: string;
    value: string;
}

export const ratesService = {
  getLatestRate: async (type: 'observed' | 'customs'): Promise<ExchangeRate> => {
    const response = await client.get<ExchangeRate>(`/rates/latest/${type}/`);
    return response.data;
  }
};