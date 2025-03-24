import { Optional } from "sequelize";
import { User } from "@/models/interface/user.interface";
import { Status } from "@/models/interface/status.interface";

// Fine interface
export interface Fine {
  id_fine: number;
  value_fine: number;
  id_user: number;
  id_status: number;
  payment_in_fine?: Date | null;
  created_at_fine: Date;

  user?: User;
  status?: Status;
}

// Definir los atributos opcionales para la creación
export interface FineCreationAttributes extends Optional<Fine, 'id_fine' | 'payment_in_fine'> { }
