
import { Request, Response } from 'express';
import fine_clientService, { Fine_ClientService } from "@/src/junctions/fine_client/fine_client.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class Fine_ClientController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(fine_clientService.crud);
