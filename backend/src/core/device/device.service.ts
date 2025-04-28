
import sequelize, { FindOptions } from "sequelize";
import Console from '@/helpers/console';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { dbConnection } from '@/src/database';
import { CrudService } from '@/lib/crud/service/crud.service';
import { getIo } from '@/src/monitor';

import { rule, validateRequest } from "@/lib/crud/config/validation/request.validation";
import { handleService } from "@/lib/crud/service/config.service";
import { Service } from "@/lib/crud/service/decorator.service";

import { Device } from "@/models/interface/device.interface";


// Nombre del servicio
const consoleHelper = new Console("device Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        {
            model: models.Model, as: 'model',
            include: [{ model: models.Brand, as: 'brand' }]
        },
        {
            model: models.User, as: 'user',
            attributes: { exclude: ['password_user'] }
        },
        { model: models.Status, as: 'status' },
    ]
}


/**
 * Métodos personalizados para el servicio
 */
const serviceMethods = {
    create: (formData: Device, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [formData] = args as [any];

            // Reglas de validación
            await validateRequest<Device>({
                model: models.Device,
                formData,
                rules: [
                    rule.validateFieldTypes(),
                    rule.requiredFields(['price_device', 'id_model', 'id_user']),
                ],
            });

            // Crear
            const result = await models.Device.create({ ...formData, id_status: 1 });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('device:created', result);

            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [formData]
    }),
    update: (id_device: number, formData: Device, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [id_device, formData] = args as [number, Device];

            // Reglas de validación
            await validateRequest<Device>({
                model: models.Device,
                formData,
                rules: [
                    rule.validateFieldTypes(),
                    rule.requiredFields(['price_device', 'id_model', 'id_user']),
                    rule.recordExists(id_device, reqMsg.notFound),
                ],
            });

            // Actualizar datos
            const result = await models.Device.update(formData, { where: { id_device } });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('device:updated', result);

            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [id_device, formData]
    })
};

export default { crud: CrudService(models.Device, consoleHelper, config, serviceMethods) };

// =============================================================================
// =============================================================================

export class DeviceService { 
    
    /**
     * Desactivar registro
     * @param id_device 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async deactivateDevice(id_device: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.Device,
            rules: [
                rule.recordExists(id_device, reqMsg.notFound),
            ]
        });

        // Actualizar datos
        await models.Device.update({ id_status: 2 }, { where: { id_device } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('device:deactivate', { id_device });

        return HttpResponse.success({ message: reqMsg.success });
    }

    // =============================================================================

    /**
     * Activar registro
     * @param id_device 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async activateDevice(id_device: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.Device,
            rules: [
                rule.recordExists(id_device, reqMsg.notFound),
            ]
        });

        // Actualizar datos
        await models.Device.update({ id_status: 1 }, { where: { id_device } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('device:activate', { id_device });

        return HttpResponse.success({ message: reqMsg.success });
    }

}
