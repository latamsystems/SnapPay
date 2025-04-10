
import { Request, Response } from 'express';
import saleService, { SaleService } from "@/src/core/sale/sale.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class SaleController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: saleService.crud });
