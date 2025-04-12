
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

import { Payment } from "@/models/interface/payment.interface";

// Nombre del servicio
const consoleHelper = new Console("payment Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.Status, as: 'status' },
    ]
}

export default { crud: CrudService(models.Payment, consoleHelper, config) };

// =============================================================================
// =============================================================================

export class PaymentService {

    /**
     * Actualizar estado de pago
     * @param id_payment 
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async statusPayment(id_payment: number, formData: Payment, reqMsg: Record<string, string>) {

        const { id_status } = formData;

        // Reglas de validación
        await validateRequest({
            model: models.User,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(["id_status"]),
                rule.recordExists(id_payment, reqMsg.notFound),
            ],
        });

        // Solo estados permitidis
        const validStatus = [3, 4, 6];
        if (!validStatus.includes(id_status)) {
            return HttpResponse.badRequest({ message: reqMsg.validStatus });
        }

        // Actualizar datos
        await models.Payment.update(formData, { where: { id_payment } });

        return HttpResponse.success({ message: reqMsg.success });
    }

}
