
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

import { Sale } from "@/models/interface/sale.interface";

// Nombre del servicio
const consoleHelper = new Console("sale Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.Client, as: 'client' },
        { model: models.Device, as: 'device' },
        {
            model: models.User, as: 'user',
            attributes: { exclude: ["password_user"] }
        },
        { model: models.Status, as: 'status' }
    ]
}

export default { crud: CrudService(models.Sale, consoleHelper, config) };

// =============================================================================
// =============================================================================

export class SaleService {


    /**
     * Obtener datos de la venta por id de firebase
     * @param fid 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async firebaseSale(fid: string, reqMsg: Record<string, string>) {

        // Validar si existe el idf
        const sale = await models.Sale.findOne({
            where: { fid },
            include: [
                { model: models.Client, as: "client" },
            ]
        });
        if (!sale) return HttpResponse.notFound({ message: reqMsg.notFound, field: "fid" });

        // Devuelve los detalles del usuario
        return HttpResponse.success({ message: reqMsg.success, data: { sale } });
    }

    // =============================================================================

    /**
     * Sincronizar cliente con el id de firebase
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async syncSale(formData: any, reqMsg: Record<string, string>) {

        const { id_sale, fid, identification_client } = formData;

        // Reglas de validación
        await validateRequest({
            model: models.Sale,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(['id_sale', 'fid', 'identification_client']),
                rule.recordExists(id_sale, reqMsg.notFound),
            ],
        });

        // Obtener la venta
        const sale = await models.Sale.findOne({
            where: { id_sale },
            include: [
                { model: models.Client, as: "client" },
            ]
        });

        // Verifico si el identificacion del cliente coincide
        if (sale?.client?.identification_client !== identification_client) {
            return HttpResponse.conflict({ message: reqMsg.notFoundIdentification, field: "identification_client" });
        }

        // Validar si el id del ya esta registrado
        const valid_idf = await models.Sale.findOne({ where: { fid } });
        if (valid_idf && valid_idf.fid !== fid) return HttpResponse.conflict({ message: reqMsg.sameId, field: "fid" });

        // Actualizar cliente
        const result = await models.Sale.update({ fid }, { where: { id_sale } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('client:sync', result);

        return HttpResponse.success({ message: `${reqMsg.success} ${sale?.client?.firstname_client} ${sale?.client?.lastname_client}` });
    }
}
