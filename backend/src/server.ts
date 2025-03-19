import 'module-alias/register';
import express, { Application } from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { loadRoutes } from '@/src/route';

import setGatewayMiddlewares from '@/middlewares/gateway.middleware';
import { PORT, SSL_KEY, SSL_CERT, PRODUCTION } from '@/src/enviroment';
import { connectDB, listen, webSocket } from '@/src/monitor';

const apiVersion = '/api/v1';

class Server {
  public app: Application;
  public port: string | number;
  public server: http.Server | https.Server;

  constructor() {
    this.app = express();
    this.port = PORT || 3000;

    // Config
    setGatewayMiddlewares(this.app);

    // Crear servidor HTTP o HTTPS según el entorno
    if (PRODUCTION === 'true') {
      const sslOptions = {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT),
      };
      this.server = https.createServer(sslOptions, this.app);
    } else {
      this.server = http.createServer(this.app);
    }

    // Conectar a base de datos
    connectDB();

    // Configurar WebSockets
    webSocket(this.server);

    // Cargar las rutas de la aplicación
    loadRoutes(this.app, apiVersion);
  }

  // Escuchar el servidor en el puerto definido
  public listen(): void {
    listen(this.server, this.port);
  }
}

export default Server;
