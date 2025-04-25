
import { Request, Response } from 'express';
import clientService, { ClientService } from "@/src/core/client/client.service";

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
        req, res, serviceFunction: clientService.crud.create,
        resMsg: {
            success: 'Registro creado exitosamente.',
            sameIdentification: 'Ya existe un cliente registrado con esa identificación.',
            sameEmail: 'Ya existe un cliente con ese correo eléctronico.',
        },
        params: [req.body],
    }),
    update: async (req: Request, res: Response) => handleController({
        req, res, serviceFunction: clientService.crud.update,
        resMsg: {
            success: 'Registro actualizado exitosamente.',
            notFound: 'Registro no encontrado.',
            sameIdentification: 'Ya existe un cliente registrado con esa identificación.',
            sameEmail: 'Ya existe un cliente con ese correo eléctronico.',
        },
        params: [req.params.id, req.body],
    }),
}


// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: clientService.crud, controllerMethods });

// =============================================================================
// =============================================================================

export class ClientController {

    /**
     * Desactivar registro
     * @param req
     */
    @Controller({
        service: ClientService.deactivateClient,
        messages: {
            success: "Registro desactivado exitosamente.",
            notFound: "Registro no encontrado."
        },
        extractParams: (req: Request) => [req.params.id]
    })
    static deactivateClient() { void 0 }

    // =============================================================================

    /**
     * Activar registro
     * @param req
     */
    @Controller({
        service: ClientService.activateClient,
        messages: {
            success: "Registro activado exitosamente.",
            notFound: "Registro no encontrado."
        },
        extractParams: (req: Request) => [req.params.id]
    })
    static activateClient() { void 0 }


}

