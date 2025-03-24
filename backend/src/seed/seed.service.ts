import bcrypt from 'bcrypt';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { Service } from "@/lib/crud/service/decorator.service";
import { seedValidator } from '@/lib/crud/config/validation/seed.validation';

import { Status } from '@/models/interface/status.interface';
import { Role } from '@/models/interface/role.interface';
import { User } from '@/models/interface/user.interface';

export class SeedService {

    /**
     * Ejecutar datos quemados
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async dataSeed(reqMsg: Record<string, string>) {

        // Crear estados (verificar si existen)
        const status: Status[] = [
            { id_status: 1, name_status: "ACTIVO" },
            { id_status: 2, name_status: "INACTIVO" },
            { id_status: 3, name_status: "PAGADO" },
            { id_status: 4, name_status: "PENDIENTE" },
            { id_status: 5, name_status: "BLOQUEADO" },
        ];

        await seedValidator(models.Status, status, "id_status");

        // Crear roles (verificar si existen)
        const roles: Role[] = [
            { id_role: 1, name_role: "ADMINISTRADOR" },
            { id_role: 2, name_role: "MODERADOR" },
        ];

        await seedValidator(models.Role, roles, "id_role");

        // Crear usuarios (verificar si existen)
        const users: User[] = [
            {
                id_user: 1,
                firstname_user: "Admin",
                lastname_user: "Sistema",
                identification_user: "2222222222",
                email_user: "admin@gmail.com",
                password_user: bcrypt.hashSync("12345", 10),
                id_role: 1,
                id_status: 1,
                created_at_user: new Date(),
            },
            {
                id_user: 2,
                firstname_user: "Moderador",
                lastname_user: "Sistema",
                identification_user: "3333333333",
                email_user: "mod@gmail.com",
                password_user: bcrypt.hashSync("12345", 10),
                id_role: 2,
                id_status: 1,
                created_at_user: new Date(),
            },
        ];

        await seedValidator(models.User, users, "id_user");

        return HttpResponse.success(reqMsg.success);
    }
}
