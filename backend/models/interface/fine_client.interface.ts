import { Optional } from "sequelize";
import { Fine } from "@/models/interface/fine.interface";
import { Client } from "@/models/interface/client.interface";

// Role interface
export interface Fine_Client {
  id_fine_client: number;
  id_fine: number;
  id_client: number;

  fine?: Fine;
  client?: Client;
}

// Definir los atributos opcionales para la creación
export interface Fine_ClientCreationAttributes extends Optional<Fine_Client, 'id_fine_client'> { }
