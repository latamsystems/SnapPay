
import { Request, Response } from 'express';
import deviceService, { DeviceService } from "@/src/core/device/device.service";

import { handleController } from '@/lib/crud/controller/config.controller';
import { CrudController } from '@/lib/crud/controller/crud.controller';
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

export class DeviceController { }

// Exporta el CRUD con los métodos personalizados
export const crud = CrudController(deviceService.crud);
