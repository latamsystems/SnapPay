
import sequelize from "sequelize";
import Console from '@/helpers/console';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { dbConnection } from '@/src/database';
import { CrudService } from '@/lib/crud/service/crud.service';
import { getIo } from '@/src/monitor';

import { rule, validateRequest } from "@/lib/crud/config/validation/request.validation";
import { handleService } from "@/lib/crud/service/config.service";
import { Service } from "@/lib/crud/service/decorator.service";

import { Control } from "@/models/interface/control.interface";

// Nombre del servicio
const consoleHelper = new Console("control Service");

// =============================================================================
// =============================================================================

export default { crud: CrudService(models.Control, consoleHelper) };

// =============================================================================
// =============================================================================

export class ControlService {
    /**
     * Actualizacion de control
     * @param reqMsg 
     * @returns 
    */
    @Service
    static async updateControl(id_control: number, id_status: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.Control,
            rules: [
                rule.recordExists(id_control, reqMsg.notFound),
            ],
        });

        let deactivationDate_control;
        let message;

        if (id_status === 1) {
            deactivationDate_control = new Date();
            message = reqMsg.activeMaintenance;
        } else {
            deactivationDate_control = null;
            message = reqMsg.inactiveMaintenance;
        }

        await models.Control.update({
            id_status,
            deactivationDate_control,
        }, { where: { id_control } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('control:update', id_control);

        if (id_control === 1) {
            return HttpResponse.success({ message });
        } else {
            return HttpResponse.success({ message: reqMsg.success });
        }
    }
}
