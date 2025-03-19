
import { Request, Response } from 'express';
import roleService, { RoleService } from "@/src/entities/role/role.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class RoleController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(roleService.crud);
