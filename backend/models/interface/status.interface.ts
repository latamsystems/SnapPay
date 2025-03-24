import { Optional } from "sequelize";

// Status interface
export interface Status {
  id_status: number;
  name_status: string;
}

// Definir los atributos opcionales para la creación
export interface StatusCreationAttributes extends Optional<Status, 'id_status'> { }
