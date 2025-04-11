
import { Request, Response } from 'express';
import saleService, { SaleService } from "@/src/core/sale/sale.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================
// =============================================================================

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: saleService.crud });

// =============================================================================
// =============================================================================

export class SaleController {

    /**
     * Obtener datos de la venta por id de firebase
     * @param req
     */
    @Controller({
        service: SaleService.firebaseSale,
        messages: {
            success: 'Registro obtenido correctamente.',
            notFound: 'No se encontro el cliente.',
        },
        extractParams: (req: Request) => [req.params.idf]
    })
    static firebaseSale() { void 0 }

    // =============================================================================


    /**
     * Sincronizar venta con el id de firebase
     * @param req
     */
    @Controller({
        service: SaleService.syncSale,
        messages: {
            success: 'Se ha sincronizado el cliente:',
            notFound: 'La venta con ese id no existe.',
            sameId: 'El ID de Authenticación ya se encuentra registrado por otro cliente.',
        },
        extractParams: (req: Request) => [req.body]
    })
    static syncSale() { void 0 }

}

