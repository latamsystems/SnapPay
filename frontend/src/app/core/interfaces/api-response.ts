import { RoleResult } from "src/app/core/interfaces/entities/role.interface";
import { StatusResult } from "src/app/core/interfaces/entities/status.interface";
import { UserResult } from "src/app/core/interfaces/entities/user.interface";
import { LoginUserResoult } from "src/app/core/interfaces/auth";
import { BrandResult } from "./entities/brand.interface";
import { ModelResult } from "./entities/model.interface";
import { ClientResult } from "./entities/client.interface";
import { DeviceResult } from "./entities/device.interface";

// Respuesta del servidor
export interface ApiResponse<T> {
  ok: boolean;
  msg: string;
  data: T;
  meta?: MetaResponse;
}

export interface MetaResponse {
  page: PageResponse;
  sort: SortResponse;
}

export interface PageResponse {
  currentPage: number,
  totalPages: number,
  totalRecords: number,
  limit: number
}

export interface SortResponse {
  by: string;
  order: "ASC" | "DESC";
}


// ===========================================================================

// Respuesta para estados
export interface AuthData {
  auth: LoginUserResoult[];
}

// Respuesta para estados
export interface StatusData {
  status: StatusResult[];
}

// Respuesta para roles
export interface RoleData {
  role: RoleResult[];
}

// Respuesta para usuarios
export interface UserData {
  user: UserResult[];
}

// Respuesta para marcas
export interface BrandData {
  brand: BrandResult[];
}

// Respuesta para modelos
export interface ModelData {
  model: ModelResult[];
}

// Respuesta para clientes
export interface ClientData {
  client: ClientResult[];
}

// Respuesta para dispositivos
export interface DeviceData {
  device: DeviceResult[];
}