import { StatusResult } from "src/app/core/interfaces/entities/status.interface";
import { UserResult } from "./user.interface";
import { ModelResult } from "./model.interface";

export interface DeviceResult {
    id_device: number;
    price_device: number;
    id_model: number;
    id_user: number;
    id_status: number;
  
    model?: ModelResult;
    user?: UserResult;
    status?: StatusResult;
}
