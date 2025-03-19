import { Optional } from "sequelize";

// User interface
export interface UserModel {
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
}

// Definir los atributos opcionales para la creación
export interface UserCreationAttributes extends Optional
    <UserModel, 'id_user' | 'resetPasswordToken_user' | 'resetPasswordExpires_user' | 'inactive_in_user'> { }
