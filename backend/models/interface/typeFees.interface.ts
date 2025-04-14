import { Optional } from "sequelize";

// Type Fees interface
export interface TypeFees {
  id_typeFees: number;
  name_typeFees: string;
}

// Definir los atributos opcionales para la creación
export interface TypeFeesCreationAttributes extends Optional<TypeFees, 'id_typeFees'> { }
