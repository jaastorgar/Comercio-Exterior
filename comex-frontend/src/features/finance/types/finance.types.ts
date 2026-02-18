export interface ImportSimulationRequest {
    fob_value: number;       // Valor de la mercancía
    freight_value: number;   // Flete
    insurance_value: number; // Seguro
    exchange_rate: number;   // Tipo de cambio (Dólar) a usar
    name?: string;           // Nombre opcional para guardar la simulación
}

export interface ImportSimulationResponse {
    id: number;
    created_at: string;
    // Entradas
    fob_value: number;
    freight_value: number;
    insurance_value: number;
    exchange_rate: number;
    // Cálculos del Backend
    cif_value: number;       // Valor CIF en USD
    cif_clp: number;         // Valor CIF en Pesos
    ad_valorem: number;      // 6% (Generalmente)
    iva: number;             // 19%
    total_cost: number;      // Costo final importación
}