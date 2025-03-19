import 'module-alias/register';
import { Sequelize } from 'sequelize';
import { DB_NAME, DB_USER, DB_PASSW, HOST, DIALECT, TIMEZONE } from '@/src/enviroment';

// Conexión a la base de datos
export const dbConnection: Sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSW,
  {
    host: HOST,
    dialect: DIALECT,
    logging: false,
    timezone: TIMEZONE,
  }
);

