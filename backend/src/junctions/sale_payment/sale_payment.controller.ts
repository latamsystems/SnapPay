
import { Request, Response } from 'express';
import sale_paymentService, { Sale_PaymentService } from "@/src/junctions/sale_payment/sale_payment.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class Sale_PaymentController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: sale_paymentService.crud });
