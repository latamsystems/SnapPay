
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

import { Client } from "@/models/interface/client.interface";


// Nombre del servicio
const consoleHelper = new Console("client Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.User, as: "user", attributes: { exclude: ["password_user"] } },
        { model: models.Status, as: "status" },
    ]
}

/**
 * Métodos personalizados para el servicio
 */
const serviceMethods = {
    create: (formData: Client, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [formData] = args as [any];

            // Reglas de validación
            await validateRequest<Client>({
                model: models.Client,
                formData,
                rules: [
                    rule.validateFieldTypes(),
                    rule.requiredFields(['firstname_client', 'lastname_client', 'identification_client', 'phone_client', 'email_client', 'id_user']),
                    rule.uniqueField('identification_client', reqMsg.sameIdentification),
                    rule.uniqueField('email_client', reqMsg.sameEmail),
                    rule.validEmail('email_client'),
                ],
            });

            // Crear
            const result = await models.Client.create({ ...formData, id_status: 1 });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('client:created', result);

            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [formData]
    }),
    update: (id_client: number, formData: Client, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [id_client, formData] = args as [number, Client];

            // Reglas de validación
            await validateRequest<Client>({
                model: models.Client,
                formData,
                rules: [
                    rule.validateFieldTypes(),
                    rule.requiredFields(['firstname_client', 'lastname_client', 'identification_client', 'phone_client', 'email_client']),
                    rule.recordExists(id_client, reqMsg.notFound),
                    rule.uniqueField('identification_client', reqMsg.sameIdentification, id_client),
                    rule.uniqueField('email_client', reqMsg.sameEmail, id_client),
                    rule.validEmail('email_user'),
                ],
            });

            // Actualizar datos
            const result = await models.Client.update(formData, { where: { id_client } });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('client:updated', result);

            return HttpResponse.success({ message: reqMsg.success });
        },
        params: [id_client, formData]
    })
};


export default { crud: CrudService(models.Client, consoleHelper, config, serviceMethods) };

// =============================================================================
// =============================================================================

export class ClientService {


    /**
     * Desactivar registro
     * @param id_client 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async deactivateClient(id_client: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.Client,
            rules: [
                rule.recordExists(id_client, reqMsg.notFound),
            ]
        });

        // Actualizar datos
        await models.Client.update({ id_status: 2, inactive_in_client: new Date() }, { where: { id_client } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('client:deactivate', { id_client });

        return HttpResponse.success({ message: reqMsg.success });
    }

    // =============================================================================

    /**
     * Activar registro
     * @param id_client 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async activateClient(id_client: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.Client,
            rules: [
                rule.recordExists(id_client, reqMsg.notFound),
            ]
        });

        // Actualizar datos
        await models.Client.update({ id_status: 1, inactive_in_client: null }, { where: { id_client } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('client:activate', { id_client });

        return HttpResponse.success({ message: reqMsg.success });
    }

}
