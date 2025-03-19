import 'module-alias/register';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import Console from '@/helpers/console';

// Nombre de servicio
const consoleHelper = new Console('ENTITY CONFIG');

// Utiliza process.cwd() para tomar la raíz del proyecto, no la ubicación del archivo
const ENTITIES_PATH = path.join(process.cwd(), 'src/entities');
const CORE_PATH = path.join(process.cwd(), 'src/core');
const MODELS_ENTITIES_PATH = path.join(process.cwd(), 'models/entities');
const MODELS_CORE_PATH = path.join(process.cwd(), 'models/core');

// Plantilla para las rutas
const generateRoutes = (entity: string, basePath: string): string => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const capitalizedEntity = capitalize(entity);

    return `
import { Router } from 'express';
import { verifyToken, checkRole } from '@/middlewares/authorization.middleware';
import crudRoutes from '@/lib/crud/routes/crud.routes';
import { crud, ${capitalizedEntity}Controller } from "@/${basePath}/${entity}/${entity}.controller";

const router = Router();

// EndPoints

router.use("/", verifyToken, crudRoutes(crud)); // CRUD

export default router;
`;
};

// Plantillas para los controladores
const generateController = (entity: string, basePath: string): string => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const capitalizedEntity = capitalize(entity);

    return `
import { Request, Response } from 'express';
import ${entity}Service, { ${capitalizedEntity}Service } from "@/${basePath}/${entity}/${entity}.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class ${capitalizedEntity}Controller { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(${entity}Service.crud);
`;
};

// Plantilla para los servicios
const generateService = (entity: string): string => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    const capitalizedEntity = capitalize(entity);

    return `
import sequelize from "sequelize";
import Console from '@/helpers/console';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { dbConnection } from '@/src/database';
import { CrudService } from '@/lib/crud/service/crud.service';
import { getIo } from '@/src/monitor';

import { rule, validateRequest } from "@/lib/crud/config/validation/request.validation";
import { handleService } from "@/lib/crud/service/config.service";
import { Service } from "@/lib/crud/service/decorator.service";

import { ${capitalizedEntity}Model } from "@/interface/models/${entity}.interface";


// Nombre del servicio
const consoleHelper = new Console("${entity} Service");

// =============================================================================
// =============================================================================

export default { crud: CrudService(models.${capitalizedEntity}, consoleHelper) };

// =============================================================================
// =============================================================================

export class ${capitalizedEntity}Service { }
`;
};

// Función para crear los archivos si no existen
const createFiles = (entity: string, basePath: string): void => {
    const entityPath = path.join(basePath, entity);

    if (!fs.existsSync(entityPath)) {
        fs.mkdirSync(entityPath, { recursive: true });
    }

    const files = {
        controller: path.join(entityPath, `${entity}.controller.ts`),
        routes: path.join(entityPath, `${entity}.routes.ts`),
        service: path.join(entityPath, `${entity}.service.ts`)
    };

    if (!fs.existsSync(files.controller)) {
        fs.writeFileSync(files.controller, generateController(entity, basePath.includes('core') ? 'src/core' : 'src/entities'));
    }
    if (!fs.existsSync(files.routes)) {
        fs.writeFileSync(files.routes, generateRoutes(entity, basePath.includes('core') ? 'src/core' : 'src/entities'));
    }
    if (!fs.existsSync(files.service)) {
        fs.writeFileSync(files.service, generateService(entity));
    }

    const relativePath = path.relative(process.cwd(), basePath);
    consoleHelper.success(`Entidad generada: ${chalk.greenBright(entity)} en ${chalk.redBright(relativePath)}`, false);
};

/**
 * Función recursiva para buscar archivos `.model.ts` en subdirectorios
 */
const buscarArchivosModel = (directorio: string): string[] => {
    let entidades: string[] = [];

    const archivos = fs.readdirSync(directorio);

    archivos.forEach(archivo => {
        const rutaCompleta = path.join(directorio, archivo);
        const estadisticas = fs.statSync(rutaCompleta);

        if (estadisticas.isDirectory()) {
            entidades = entidades.concat(buscarArchivosModel(rutaCompleta));
        } else if (rutaCompleta.endsWith('.model.ts') && archivo !== 'init-models.ts') {
            const entityName = archivo.replace('.model.ts', '');
            entidades.push(entityName);
        }
    });

    return entidades;
};

// Función para generar entidades en src/entities
const generateFromEntitiesModels = (modelsPath: string, basePath: string): void => {
    if (!fs.existsSync(modelsPath)) {
        consoleHelper.error('El directorio de Models Entities no existe', false);
        console.error(modelsPath);
        return;
    }

    const entities = buscarArchivosModel(modelsPath);
    entities.forEach(entity => createFiles(entity, basePath));
};

// Función para generar core en src/core
const generateFromCoreModels = (modelsPath: string, basePath: string): void => {
    if (!fs.existsSync(modelsPath)) {
        consoleHelper.error('El directorio de Models Core no existe', false);
        console.error(modelsPath);
        return;
    }

    const coreEntities = buscarArchivosModel(modelsPath);
    coreEntities.forEach(entity => createFiles(entity, basePath));
};

// Generar entidades desde models/entities a src/entities
generateFromEntitiesModels(MODELS_ENTITIES_PATH, ENTITIES_PATH);

// Generar core desde models/core a src/core
generateFromCoreModels(MODELS_CORE_PATH, CORE_PATH);
