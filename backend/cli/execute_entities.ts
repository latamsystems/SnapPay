import 'module-alias/register';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import Console from '@/helpers/console';

// Nombre de servicio
const consoleHelper = new Console('ENTITY CONFIG');

// Utiliza process.cwd() para tomar la raíz del proyecto
const ENTITIES_PATH = path.join(process.cwd(), 'src/entities');
const CORE_PATH = path.join(process.cwd(), 'src/core');
const JUNCTIONS_PATH = path.join(process.cwd(), 'src/junctions');

const MODELS_ENTITIES_PATH = path.join(process.cwd(), 'models/entities');
const MODELS_CORE_PATH = path.join(process.cwd(), 'models/core');
const MODELS_JUNCTIONS_PATH = path.join(process.cwd(), 'models/junctions');

// Devuelve la ruta base de import según el tipo
const getImportBasePath = (basePath: string): string => {
  if (basePath.includes('core')) return 'src/core';
  if (basePath.includes('junctions')) return 'src/junctions';
  return 'src/entities';
};

const toPascalCasePreservingUnderscores = (str: string): string =>
  str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('_');

// Plantilla para las rutas
const generateRoutes = (entity: string, basePath: string): string => {
  const capitalizedEntity = toPascalCasePreservingUnderscores(entity);

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
  const capitalizedEntity = toPascalCasePreservingUnderscores(entity);

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
  const capitalizedEntity = toPascalCasePreservingUnderscores(entity);

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

import { ${capitalizedEntity} } from "@/models/interface/${entity}.interface";

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

  const importBasePath = getImportBasePath(basePath);

  if (!fs.existsSync(files.controller)) {
    fs.writeFileSync(files.controller, generateController(entity, importBasePath));
  }
  if (!fs.existsSync(files.routes)) {
    fs.writeFileSync(files.routes, generateRoutes(entity, importBasePath));
  }
  if (!fs.existsSync(files.service)) {
    fs.writeFileSync(files.service, generateService(entity));
  }

  const relativePath = path.relative(process.cwd(), basePath);
  consoleHelper.success({message: `Entidad generada: ${chalk.greenBright(entity)} en ${chalk.redBright(relativePath)}`, showCallerDetails: false});
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

const generateFromModels = (modelsPath: string, basePath: string, type: string): void => {
  if (!fs.existsSync(modelsPath)) {
    consoleHelper.error({message: `El directorio de Models ${type} no existe`, showCallerDetails: false});
    console.error(modelsPath);
    return;
  }

  const entities = buscarArchivosModel(modelsPath);
  entities.forEach(entity => createFiles(entity, basePath));
};

// Generar entidades desde models/entities a src/entities
generateFromModels(MODELS_ENTITIES_PATH, ENTITIES_PATH, 'Entities');

// Generar core desde models/core a src/core
generateFromModels(MODELS_CORE_PATH, CORE_PATH, 'Core');

// Generar junctions desde models/junctions a src/junctions
generateFromModels(MODELS_JUNCTIONS_PATH, JUNCTIONS_PATH, 'Junctions');