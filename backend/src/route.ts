import 'module-alias/register';
import fs from 'fs';
import path from 'path';
import { logRouteLoaded } from '@/src/monitor';
import { Application } from 'express';

// Escanear rutas de la API en la carpeta `src/`
export function loadRoutes(app: Application, apiVersion: string): void {
    const srcPath = path.join(__dirname);

    const isRouteFile = (file: string) =>
        file.endsWith('.routes.ts') || file.endsWith('.routes.js');

    const getRouteName = (file: string) =>
        file.replace('.routes.ts', '').replace('.routes.js', '');

    const loadDirectoryRoutes = (basePath: string): void => {
        fs.readdirSync(basePath).forEach((file: string) => {
            const fullPath = path.join(basePath, file);

            if (fs.statSync(fullPath).isDirectory()) {
                loadDirectoryRoutes(fullPath); // Llamado recursivo a subdirectorios
            } else if (isRouteFile(file)) {
                const routeName = getRouteName(file);
                const routePath = `${apiVersion}/${routeName}`;
                logRouteLoaded(routePath);

                // Import dinámico
                import(fullPath)
                    .then((routeModule: any) => {
                        app.use(routePath, routeModule.default);
                    })
                    .catch((err) => {
                        console.error(`Error al cargar la ruta ${fullPath}:`, err);
                    });
            }
        });
    };

    loadDirectoryRoutes(srcPath);
}
