
import { Request, Response } from 'express';
import clientService, { ClientService } from "@/src/core/client/client.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================
// =============================================================================

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({service: clientService.crud});

// =============================================================================
// =============================================================================

export class ClientController {

    
    /**
     * Obtener datos del cliente por id de firebase
     * @param req
     */
    @Controller({
        service: ClientService.firebaseClient,
        messages: {
            success: 'Registro obtenido correctamente.',
            notFound: 'No se encontro el cliente.',
        },
        extractParams: (req: Request) => [req.params.idf]
    })
    static firebaseClient() { void 0 }

    // =============================================================================


    /**
     * Sincronizar cliente con el id de firebase
     * @param req
     */
    @Controller({
        service: ClientService.syncClient,
        messages: {
            success: 'Se ha sincronizado el cliente:',
            notFoundId: 'El cliente con ese id no existe.',
            sameIdentification: 'El existe un cliente con esa identificación.',
            notFound: 'No se encuentra el cliente.',
            sameId: 'El ID de Authenticación ya se encuentra registrado por otro cliente.',
        },
        extractParams: (req: Request) => [req.body]
    })
    static syncClient() { void 0 }

    // =============================================================================

}

