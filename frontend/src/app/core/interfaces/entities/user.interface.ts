import { RoleResult } from "src/app/core/interfaces/entities/role.interface";
import { StatusResult } from "src/app/core/interfaces/entities/status.interface";

export interface UserResult {
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
  
    role?: RoleResult;
    status?: StatusResult;
}

// Cambiar contraseña
export interface PasswdChangeResults {
    password_user: string;
    new_password: string;
}
