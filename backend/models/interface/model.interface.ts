import { Optional } from "sequelize";
import { Brand } from "@/models/interface/brand.interface";

// Model interface
export interface Model {
  id_model: number;
  name_model: string;
  id_brand: number;

  brand?: Brand;
}

// Definir los atributos opcionales para la creación
export interface ModelCreationAttributes extends Optional<Model, 'id_model'> { }
