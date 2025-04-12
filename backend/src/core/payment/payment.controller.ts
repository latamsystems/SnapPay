
import { Request, Response } from 'express';
import paymentService, { PaymentService } from "@/src/core/payment/payment.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================
// =============================================================================

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: paymentService.crud });

// =============================================================================
// =============================================================================

export class PaymentController {

    /**
     * Actualizar perfil por ID
     * @param req
     */
    @Controller({
        service: PaymentService.statusPayment,
        messages: {
            success: "Pago actualizado exitosamente.",
            notFound: "Pago no encontrado.",
            validStatus: "El estado no es correcto.",
        },
        extractParams: (req: Request) => [req.params.id, req.body]
    })
    static statusPayment() { void 0 }


}