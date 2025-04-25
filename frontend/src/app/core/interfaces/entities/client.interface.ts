import { StatusResult } from "src/app/core/interfaces/entities/status.interface";
import { UserResult } from "./user.interface";

export interface ClientResult {
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

    user?: UserResult;
    status?: StatusResult;
}
