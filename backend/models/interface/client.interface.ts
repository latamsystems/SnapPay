import { Optional } from "sequelize";
import { User } from "@/models/interface/user.interface";
import { Status } from "@/models/interface/status.interface";

// Client interface
export interface Client {
    id_client: number;
    firstname_client: string;
    lastname_client: string;
    identification_client: string;
    phone_client: string;
    email_client: string;
    id_user: number;
    id_status: number;
    created_at_client?: Date;
    inactive_in_client?: Date | null;

    user?: User;
    status?: Status;
}

// Definir los atributos opcionales para la creación
export interface ClientCreationAttributes extends Optional
    <Client, 'id_client' | 'inactive_in_client'> { }
