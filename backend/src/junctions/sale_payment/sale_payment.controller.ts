
import { Request, Response } from 'express';
import sale_paymentService, { Sale_PaymentService } from "@/src/junctions/sale_payment/sale_payment.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================
// =============================================================================

/**
 * Métodos personalizados del controlador
 */
const controllerMethods = {
    create: async (req: Request, res: Response) => handleController({
        req, res, serviceFunction: sale_paymentService.crud.create,
        resMsg: {
            success: 'Registro creado exitosamente.',
            sameNumDocument: 'Ya se ha registrado el número comprobante.',
            notFoundSale: 'No existe el registro de la compra.',

            validTypeInteger: 'El valor debe ser un número entero.',
            validTypeNumber: 'El valor debe ser númerico.',
        },
        params: [req.body],
    }),
    update: async (req: Request, res: Response) => handleController({
        req, res, serviceFunction: sale_paymentService.crud.update,
        resMsg: {
            success: 'Registro actualizado exitosamente.',
            notFound: 'Registro no encontrado.',
            sameNumDocument: 'Ya se ha registrado el número comprobante.',
            notFoundSale: 'No existe el registro de la compra.',

            validTypeInteger: 'El valor debe ser un número entero.',
            validTypeNumber: 'El valor debe ser númerico.',
        },
        params: [req.params.id, req.body],
    }),
    delete: async (req: Request, res: Response) => handleController({
        req, res, serviceFunction: sale_paymentService.crud.delete,
        resMsg: {
            success: 'Registro eliminado exitosamente.',
            notFound: 'Registro no encontrado.',
        },
        params: [req.params.id],
    }),
}

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: sale_paymentService.crud, controllerMethods });

// =============================================================================
// =============================================================================

export class Sale_PaymentController { }

