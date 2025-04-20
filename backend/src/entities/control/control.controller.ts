
import { Request, Response } from 'express';
import controlService, { ControlService } from "@/src/entities/control/control.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================
// =============================================================================

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController({ service: controlService.crud });

// =============================================================================
// =============================================================================

export class ControlController {
    /**
    * Actualizacion de control
    * @param req 
   */
    @Controller({
        service: ControlService.updateControl,
        messages: {
            success: 'Se actualizo el estado correctamente.',
            notFound: 'No se encontro el control.',
            activeMaintenance: 'Modo mantenimiento activado correctamente.',
            inactiveMaintenance: 'Modo mantenimiento desactivado correctamente.',
        },
        extractParams: (req: Request) => [req.params.id, req.params.status],
    })
    static updateControl() { void 0 }

}

