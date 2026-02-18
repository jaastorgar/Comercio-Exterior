export interface RegulatoryBody {
    id: number;
    name: string;
    country: string;
    description: string;
}

export interface ProductCategory {
    id: number;
    name: string;
    description: string;
}

export interface Regulation {
    id: number;
    title: string;
    description: string;
    body: RegulatoryBody;          // El serializador anida el objeto completo
    categories: ProductCategory[]; // Lista de categorías
    is_international: boolean;
    created_at: string;
}