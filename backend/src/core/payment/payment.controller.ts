
import { Request, Response } from 'express';
import paymentService, { PaymentService } from "@/src/core/payment/payment.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class PaymentController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({service: paymentService.crud});
