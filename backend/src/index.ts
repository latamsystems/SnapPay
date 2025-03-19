import 'module-alias/register';
import dotenv from 'dotenv';
import Server from '@/src/server';

// Configurar variables de entorno
dotenv.config();

// Crear instancia del servidor y escuchar
const server = new Server();
server.listen();
