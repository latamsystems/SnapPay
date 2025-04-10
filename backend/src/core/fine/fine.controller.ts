
import { Request, Response } from 'express';
import fineService, { FineService } from "@/src/core/fine/fine.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class FineController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({service: fineService.crud});
