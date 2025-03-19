import chalk from 'chalk';
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';

import Console from '@/helpers/console';

// Instancia de consola personalizada
const consoleHelper = new Console('WebSocket');

// =============================================================================

// Declaración de variables globales
let io: Server;
let connectedUsers: Record<string, { socketId: string; firstname: string; lastname: string }> = {};

/**
 * Configuración del WebSocket
 * @param server 
 * @returns 
 */
export function setupWebSocket(server: HttpServer | HttpsServer): Server {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    consoleHelper.debug(`Cliente conectado: ${chalk.blueBright(socket.id)}`);

    // Manejar autenticación de usuario
    socket.on('user_connected', (userId: string, firstname: string, lastname: string) => {
      connectedUsers[userId] = { socketId: socket.id, firstname, lastname };
      consoleHelper.debug(`Usuario conectado: ${chalk.green(userId)} → ${chalk.green.bold(firstname)} ${chalk.green.bold(lastname)} con socket id: ${chalk.blueBright(socket.id)}`);
    });

    // Manejar desconexión de usuario
    socket.on('disconnect', () => {
      consoleHelper.debug(`Cliente desconectado: ${chalk.blueBright(socket.id)}`);

      // Eliminar usuario de la lista de conectados
      for (const userId in connectedUsers) {
        if (connectedUsers[userId].socketId === socket.id) {
          consoleHelper.debug(`Usuario desconectado: ${chalk.green(userId)} → ${chalk.green.bold(connectedUsers[userId].firstname)} ${chalk.green.bold(connectedUsers[userId].lastname)}`);
          delete connectedUsers[userId];
          break;
        }
      }
    });

    // Manejar errores en la conexión
    socket.on('error', (error: Error) => {
      consoleHelper.error('Error en la conexión del cliente: ' + error.message);
    });
  });

  return io;
}

// =============================================================================

/**
 * Obtener instancia de Socket.IO
 * @returns 
 */
export function getIo(): Server {
  if (!io) {
    throw new Error('Socket.io no está inicializado');
  }
  return io;
}

// =============================================================================

/**
 * Obtener usuarios conectados
 * @returns 
 */
export function getConnectedUsers(): Array<{ id_user: number; id_socket: string }> {
  return Object.entries(connectedUsers).map(([userId, userInfo]) => ({
    id_user: Number(userId),
    id_socket: userInfo.socketId
  }));
}
