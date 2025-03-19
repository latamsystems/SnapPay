import { Request } from 'express';
import { SeedService } from "@/src/seed/seed.service";

import { Controller } from '@/lib/crud/controller/decorator.controller';

export class SeedController {

    /**
     * Ejecutar datos quemados
     * @param req
     */
    @Controller({
        service: SeedService.dataSeed,
        messages: {
            success: "Datos generados exitosamente."
        },
        extractParams: (req: Request) => []
    })
    static dataSeed() { void 0 }
}