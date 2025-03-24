
import { Request, Response } from 'express';
import clientService, { ClientService } from "@/src/core/client/client.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class ClientController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(clientService.crud);
