import client from '../../../api/client';
import { Regulation, RegulatoryBody, ProductCategory } from '../types/regulatory.types';

export const regulatoryService = {
  // Obtener todas las regulaciones (soporta filtros)
  getRegulations: async (bodyId?: number, categoryId?: number): Promise<Regulation[]> => {
    const params: any = {};
    if (bodyId) params.body = bodyId;
    if (categoryId) params.category = categoryId;
    
    const response = await client.get<Regulation[]>('/regulatory/regulations/', { params });
    return response.data;
  },

  // Obtener lista de organismos (para el filtro)
  getBodies: async (): Promise<RegulatoryBody[]> => {
    const response = await client.get<RegulatoryBody[]>('/regulatory/bodies/');
    return response.data;
  },

  // Obtener lista de categorías (para el filtro)
  getCategories: async (): Promise<ProductCategory[]> => {
    const response = await client.get<ProductCategory[]>('/regulatory/categories/');
    return response.data;
  }
};