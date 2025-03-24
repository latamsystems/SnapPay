import { Optional } from "sequelize";
import { Model } from "@/models/interface/model.interface";
import { User } from "@/models/interface/user.interface";
import { Status } from "@/models/interface/status.interface";

// Device interface
export interface Device {
  id_device: number;
  price_device: number;
  id_model: number;
  id_user: number;
  id_status: number;

  model?: Model;
  user?: User;
  status?: Status;
}

// Definir los atributos opcionales para la creación
export interface DeviceCreationAttributes extends Optional<Device, 'id_device'> { }
