import chalk from 'chalk';
import Console from '@/helpers/console';
import { DB_NAME, SHOW_APIS, SHOW_COMMANDS } from '@/src/enviroment';

import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { dbConnection } from '@/src/database';
import { setupWebSocket, getIo } from '@/src/websocket';

// Instancias de consola personalizadas
const consoleHelper = new Console('SERVER');

// ============================================================================

// Mensaje de servidor corriendo
export function listen(server: HttpServer | HttpsServer, port: string | number): void {
  server.listen(port, () => {
    consoleHelper.debug(`Servidor corriendo en el puerto: ${chalk.cyanBright.bold(port)}`, false);
  });

  if (SHOW_COMMANDS === 'true') {
    // consoleHelper.debug(`${chalk.blue('> npm run create')} → Agregar los datos quemados.`, false);
    // consoleHelper.debug(`${chalk.blue('> npm run delete')} → Eliminar datos en la base de datos.`, false);
    consoleHelper.debug(`${chalk.blue('> npm run model')} → Agregar modelos para su uso`, false);
    consoleHelper.debug(`${chalk.blue('> npm run entity')} → Generar cruds automaticos de entidades`, false);
  }
}

// ============================================================================

// Conectar a la base de datos
export function connectDB() {
  const connection = async () => {
    try {
      await dbConnection.sync({ alter: true });
      consoleHelper.debug(`Base de datos: ${chalk.cyanBright.bold(DB_NAME)}`, false);
    } catch (error) {
      consoleHelper.error('Error al iniciar la base de datos.', false);
      console.error(error);
    }
  }
  connection();
}

// ============================================================================

// Mensaje de WebSocket
export function webSocket(server: HttpServer | HttpsServer): void {
  const io = setupWebSocket(server);

  if (io) {
    consoleHelper.debug(`Servidor ${chalk.cyanBright.bold('WebSocket')} iniciado correctamente`, false);
  } else {
    consoleHelper.error('Error al iniciar el servidor WebSocket', false);
  }
}

// ============================================================================

// Mensaje de rutas cargadas
export function logRouteLoaded(routePath: string): void {
  if (SHOW_APIS === 'true') {
    consoleHelper.debug(`${chalk.gray('Ruta cargada:')} ${chalk.redBright.bold(routePath)}`, false);
  }
}

// ============================================================================

// Exportar 
export { getIo };
