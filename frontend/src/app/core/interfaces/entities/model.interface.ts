import { BrandResult } from "./brand.interface";

export interface ModelResult {
  id_model: number;
  name_model: string;
  id_brand: number;

  brand?: BrandResult;
}
