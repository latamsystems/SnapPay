export interface Params {
    page?: number;
    limit?: number;
    search?: string;
    searchFields?: string[];
    filter?: any;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
}
