
import { Request, Response } from 'express';
import deviceService, { DeviceService } from "@/src/core/device/device.service";

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
        req, res, serviceFunction: deviceService.crud.create,
        resMsg: {
            success: 'Registro creado exitosamente.',
        },
        params: [req.body],
    }),
    update: async (req: Request, res: Response) => handleController({
        req, res, serviceFunction: deviceService.crud.update,
        resMsg: {
            success: 'Registro actualizado exitosamente.',
            notFound: 'Registro no encontrado.',
        },
        params: [req.params.id, req.body],
    }),
}

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: deviceService.crud, controllerMethods });

// =============================================================================
// =============================================================================

export class DeviceController {

    /**
     * Desactivar registro
     * @param req
     */
    @Controller({
        service: DeviceService.deactivateDevice,
        messages: {
            success: "Registro desactivado exitosamente.",
            notFound: "Registro no encontrado."
        },
        extractParams: (req: Request) => [req.params.id]
    })
    static deactivateDevice() { void 0 }

    // =============================================================================

    /**
     * Activar registro
     * @param req
     */
    @Controller({
        service: DeviceService.activateDevice,
        messages: {
            success: "Registro activado exitosamente.",
            notFound: "Registro no encontrado."
        },
        extractParams: (req: Request) => [req.params.id]
    })
    static activateDevice() { void 0 }

}

