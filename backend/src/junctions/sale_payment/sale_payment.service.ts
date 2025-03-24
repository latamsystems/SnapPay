
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

import { Sale_Payment } from "@/models/interface/sale_payment.interface";

// Nombre del servicio
const consoleHelper = new Console("sale_payment Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.Sale, as: 'sale' },
        { model: models.Payment, as: 'payment' },
    ]
}

export default { crud: CrudService(models.Sale_Payment, consoleHelper, config) };

// =============================================================================
// =============================================================================

export class Sale_PaymentService { }
