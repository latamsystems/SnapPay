import { Optional } from "sequelize";

// Role interface
export interface RoleModel {
  id_role: number;
  name_role: string;
}

// Definir los atributos opcionales para la creación
export interface RoleCreationAttributes extends Optional<RoleModel, 'id_role'> { }
