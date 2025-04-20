import { StatusResult } from "src/app/core/interfaces/entities/status.interface";

export interface ControlResult {
    id_control?: number;
    name_control: string;
    id_status: 1 | 2;
    creationDate_control?: Date;
    deactivationDate_control?: Date | null;

    status?: StatusResult;
}