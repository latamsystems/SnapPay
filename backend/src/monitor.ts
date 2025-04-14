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
    consoleHelper.debug({message: `Servidor corriendo en el puerto: ${chalk.cyanBright.bold(port)}`, showCallerDetails: false});
  });

  if (SHOW_COMMANDS === 'true') {
    consoleHelper.debug({message: `${chalk.blue('> npm run init_model')} → Agregar modelos para la inicialización`, showCallerDetails: false});
    consoleHelper.debug({message: `${chalk.blue('> npm run model')} → Agregar modelo en base a la interface`, showCallerDetails: false});
    consoleHelper.debug({message: `${chalk.blue('> npm run entity')} → Generar cruds automaticos de entidades`, showCallerDetails: false});
  }
}

// ============================================================================

// Conectar a la base de datos
export function connectDB() {
  const connection = async () => {
    try {
      await dbConnection.sync({ alter: true });
      await dbConnection.sync({ force: false });

      consoleHelper.debug({message: `Base de datos: ${chalk.cyanBright.bold(DB_NAME)}`, showCallerDetails: false});
    } catch (error) {
      consoleHelper.error({message: 'Error al iniciar la base de datos.', showCallerDetails: false});
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
    consoleHelper.debug({message: `Servidor ${chalk.cyanBright.bold('WebSocket')} iniciado correctamente`, showCallerDetails: false});
  } else {
    consoleHelper.error({message: 'Error al iniciar el servidor WebSocket', showCallerDetails: false});
  }
}

// ============================================================================

// Mensaje de rutas cargadas
export function logRouteLoaded(routePath: string): void {
  if (SHOW_APIS === 'true') {
    consoleHelper.debug({message: `${chalk.gray('Ruta cargada:')} ${chalk.redBright.bold(routePath)}`, showCallerDetails: false});
  }
}

// ============================================================================

// Exportar 
export { getIo };
