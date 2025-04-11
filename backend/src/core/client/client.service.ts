
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

export class ClientService {}
