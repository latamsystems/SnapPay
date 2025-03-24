import { Optional } from "sequelize";

// Brand interface
export interface Brand {
  id_brand: number;
  name_brand: string;
}

// Definir los atributos opcionales para la creación
export interface BrandCreationAttributes extends Optional<Brand, 'id_brand'> { }
