import { Request } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { LIMIT_FILE } from '@/src/enviroment';
import Console from '@/helpers/console';

const uploadDirectory = './data/uploads'; // Directorio de destino general

// Nombre consola
const consoleHelper = new Console('MULTER CONFIG');

// Función para crear directorio si no existe
const createDirectory = (directory: string): void => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Expresión regular para validar el nombre del archivo
const fileNameRegex = /^[a-zA-Z0-9_.-]+$/;

// Middleware de multer para validar y manejar la carga de archivos
const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: any, cb: any) => {
    // Obtenemos el último segmento de la URL del endpoint
    const endpointPath = req.path.split('/').pop(); // Obtenemos el último segmento de la URL
    const destinationPath = path.join(uploadDirectory, endpointPath as string); // Combinamos la ruta de destino general con el último segmento de la URL
    createDirectory(destinationPath); // Creamos el directorio si no existe
    cb(null, destinationPath); // Configuramos la ruta de destino
  },
  filename: (req: Request, file: any, cb: any) => {
    // Validamos el nombre del archivo
    const fileName = file.originalname.trim(); // Eliminamos espacios en blanco al principio y al final

    if (!fileNameRegex.test(fileName)) {
      const errorMessage = 'El nombre del archivo contiene caracteres no válidos';
      consoleHelper.error(errorMessage);
      return cb(new Error(errorMessage));
    }

    cb(null, fileName);
  }
});

// Lee el límite de tamaño de archivo desde las variables de entorno
const fileSizeLimit = parseInt(LIMIT_FILE || '10', 10) * 1024 * 1024; // Convierte el límite de MB a bytes

// Middleware de multer para manejar la carga de archivos
const upload = multer({
  storage: storage,
  limits: { fileSize: fileSizeLimit } // Limite de subida
});

export default upload;
