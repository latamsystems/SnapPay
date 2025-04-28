
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

    // =============================================================================

    /**
     * Resumen general del sistema
     * @param reqMsg 
     * @returns 
    */
    @Service
    static async getGeneralResume(id_user: number, reqMsg: Record<string, string>) {
        // Verificar si existe el usuario
        const user = await models.User.findOne({ where: { id_user } });
        if (!user) { return HttpResponse.notFound({ message: reqMsg.notFound }); }

        // Conteo de marcas
        const countBrands = await models.Brand.count();
        const lastBrand = await models.Brand.findOne({
            order: [['id_brand', 'DESC']],
            limit: 1,
        });

        // Conteo de modelos
        const countModels = await models.Model.count();
        const lastModel = await models.Model.findOne({
            order: [['id_model', 'DESC']],
            limit: 1,
        });

        // Conteo de dispositivos
        const countDevices = await models.Device.count();

        // Conteo de clientes
        const countClients = await models.Client.count();

        // Registrados esta semana
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const countClientsThisWeek = await models.Client.count({
            where: {
                created_at_client: {
                    [sequelize.Op.gte]: startOfWeek,
                },
            },
        });

        // Conteo de usuarios
        const countUsers = await models.User.count();

        // Data
        const result = {
            control: [
                {
                    title: "Marcas registradas",
                    total: countBrands,
                    description: `Última: ${lastBrand ? lastBrand.name_brand : "No se han registrado marcas"}`,
                },
                {
                    title: "Modelos únicos",
                    total: countModels,
                    description: `Ultimo: ${lastModel ? lastModel.name_model : "No se han registrado modelos"}`,
                },
                {
                    title: "Dispositivos totales",
                    total: countDevices,
                    description: "Activos e inactivos",
                },
                {
                    title: "Clientes registrados",
                    total: countClients,
                    description: `${countClientsThisWeek === 1 ? 'nuevo' : 'nuevos'} esta semana`,
                },
                {
                    title: "Usuarios del sistema",
                    total: countUsers,
                    description: "Activos e inactivos",
                },
            ],
        }

        // Responder con los datos agrupados y con un solo "for" para iterar
        return HttpResponse.success({ message: reqMsg.success, data: result });
    }


}
