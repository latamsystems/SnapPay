
import { Request, Response } from 'express';
import brandService, { BrandService } from "@/src/entities/brand/brand.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class BrandController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(brandService.crud);
