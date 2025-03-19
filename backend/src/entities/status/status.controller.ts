
import { Request, Response } from 'express';
import statusService, { StatusService } from "@/src/entities/status/status.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class StatusController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(statusService.crud);
