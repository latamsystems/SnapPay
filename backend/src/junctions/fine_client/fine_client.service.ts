
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

import { Fine_Client } from "@/models/interface/fine_client.interface";

// Nombre del servicio
const consoleHelper = new Console("fine_client Service");

// =============================================================================
// =============================================================================

const config: FindOptions = {
    include: [
        { model: models.Fine, as : 'fine' },
        { model: models.Client, as : 'client' },
    ]
}

export default { crud: CrudService(models.Fine_Client, consoleHelper, config) };

// =============================================================================
// =============================================================================

export class Fine_ClientService { }
