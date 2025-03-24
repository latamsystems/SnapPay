import { Optional } from 'sequelize';
import { Client } from '@/models/interface/client.interface';
import { Device } from '@/models/interface/device.interface';
import { User } from '@/models/interface/user.interface';
import { Status } from '@/models/interface/status.interface';

// Sale interface
export interface Sale {
  id_sale: number;
  imei_sale: string;
  fees_sale: number;
  isFine_sale: boolean;
  id_client: number;
  id_device: number;
  id_user: number;
  id_status: number;
  activation_at_sale?: Date | null;
  finish_at_sale?: Date | null;
  created_at_sale: Date;

  client?: Client;
  device?: Device;
  user?: User;
  status?: Status;
};

// Definir los atributos opcionales para la creación
export interface SaleCreationAttributes extends Optional<Sale, 'id_sale' | 'activation_at_sale' | 'finish_at_sale'> { }
