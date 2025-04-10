
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

export default { crud: CrudService(models.Client, consoleHelper, config) };

// =============================================================================
// =============================================================================

export class ClientService {

    /**
     * Obtener datos del cliente por id de firebase
     * @param fid 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async firebaseClient(fid: string, reqMsg: Record<string, string>) {

        // Validar si existe el idf
        const client = await models.Client.findOne({ where: { fid } });
        if (!client) return HttpResponse.notFound({ message: reqMsg.notFound, field: "fid" });

        // Devuelve los detalles del usuario
        return HttpResponse.success(reqMsg.success, client);
    }


    /**
     * Sincronizar cliente con el id de firebase
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async syncClient(formData: Client, reqMsg: Record<string, string>) {

        const { id_client, fid, identification_client } = formData;

        // Reglas de validación
        await validateRequest({
            model: models.Client,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(['id_client', 'fid', 'identification_client']),
                rule.recordExists(id_client, reqMsg.notFoundId),
                rule.uniqueField('identification_client', reqMsg.sameIdentification, id_client),
            ],
        });

        // Validar si el cliente existe
        const valid_identification = await models.Client.findOne({ where: { id_client, identification_client } });
        if (!valid_identification) return HttpResponse.conflict({ message: reqMsg.notFound, field: "id_client, identification_client" });

        // Validar si el id del ya esta registrado
        const valid_idf = await models.Client.findOne({ where: { fid } });
        if (valid_idf && valid_identification.fid !== fid) return HttpResponse.conflict({ message: reqMsg.sameId, field: "fid" });

        // Actualizar cliente
        const result = await models.Client.update({ fid }, { where: { identification_client } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('client:sync', result);

        return HttpResponse.success(`${reqMsg.success} ${valid_identification.firstname_client} ${valid_identification.lastname_client}`);
    }

}
