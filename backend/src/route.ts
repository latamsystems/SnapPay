import 'module-alias/register';
import fs from 'fs';
import path from "path";
import { logRouteLoaded } from "@/src/monitor";
import { Application } from 'express';

// Escanear rutas de la API en la carpeta `src/`
export function loadRoutes(app: Application, apiVersion: string): void {
    const srcPath = path.join(__dirname);

    const loadDirectoryRoutes = (basePath: string): void => {
        fs.readdirSync(basePath).forEach((file: string) => {
            
            const fullPath = path.join(basePath, file);

            if (fs.statSync(fullPath).isDirectory()) {
                loadDirectoryRoutes(fullPath); // Llamado recursivo a subdirectorios
            } else if (file.endsWith('.routes.ts')) {
                const routeName = file.replace('.routes.ts', '').replace('.routes.js', ''); // Obtiene el nombre del archivo sin extensión
                const routePath = `${apiVersion}/${routeName}`; // Define la URL de la API

                // Mensaje de carga de API en consola
                logRouteLoaded(routePath);

                // Import dinámico de rutas
                import(fullPath).then((routeModule: any) => {
                    app.use(routePath, routeModule.default);
                }).catch((err) => {
                    console.error(`Error al cargar la ruta ${fullPath}:`, err);
                });
            }
        });
    };

    // Detecta cualquier `.routes.ts` o `.routes.js`
    loadDirectoryRoutes(srcPath);
}