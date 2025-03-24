import { Optional } from "sequelize";
import { Role } from "@/models/interface/role.interface";
import { Status } from "@/models/interface/status.interface";

// Solo los atributos que existen en la tabla
export interface User {
  id_user: number;
  firstname_user: string;
  lastname_user: string;
  identification_user: string;
  email_user: string;
  password_user: string;
  id_role: number;
  id_status: number;
  resetPasswordToken_user?: string | null;
  resetPasswordExpires_user?: Date | null;
  created_at_user: Date;
  inactive_in_user?: Date | null;

  role?: Role;
  status?: Status;
}

// Atributos opcionales para crear
export interface UserCreationAttributes extends Optional<User, 'id_user' | 'resetPasswordToken_user' | 'resetPasswordExpires_user' | 'inactive_in_user'> {}
