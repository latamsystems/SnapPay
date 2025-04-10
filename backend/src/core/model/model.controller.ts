
import { Request, Response } from 'express';
import modelService, { ModelService } from "@/src/core/model/model.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class ModelController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({service: modelService.crud});
