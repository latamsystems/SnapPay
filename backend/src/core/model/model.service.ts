
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

import { Model } from "@/models/interface/model.interface";


// Nombre del servicio
const consoleHelper = new Console("model Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.Brand, as: 'brand' }
    ]
}

export default { crud: CrudService(models.Model, consoleHelper, config) };

// =============================================================================
// =============================================================================

export class ModelService { }
