export interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
    searchFields?: string[]; // Lista de campos donde buscar
    filter?: Record<string, any>; // Clave-valor para filtrar
    sortBy?: string; // Campo por el que se ordena
    sortOrder?: 'ASC' | 'DESC'; // Orden
}

export interface NormalizedQueryParams {
    page: number;
    limit: number;
    search: string;
    searchFields: string[];
    filter: Record<string, any>;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
}