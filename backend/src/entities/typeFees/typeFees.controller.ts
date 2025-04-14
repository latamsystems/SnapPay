
import { Request, Response } from 'express';
import typeFeesService, { TypeFeesService } from "@/src/entities/typeFees/typeFees.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class TypeFeesController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({service: typeFeesService.crud});
