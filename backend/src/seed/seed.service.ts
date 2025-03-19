import bcrypt from 'bcrypt';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { Service } from "@/lib/crud/service/decorator.service";
import { seedValidator } from '@/lib/crud/config/validation/seed.validation';

import { StatusModel } from '@/models/interface/status.interface';
import { RoleModel } from '@/models/interface/role.interface';
import { UserModel } from '@/models/interface/user.interface';

export class SeedService {

    /**
     * Ejecutar datos quemados
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async dataSeed(reqMsg: Record<string, string>) {

        // Crear estados (verificar si existen)
        const status: StatusModel[] = [
            { id_status: 1, name_status: "ACTIVE" },
            { id_status: 2, name_status: "INACTIVE" },
        ];

        await seedValidator(models.Status, status, "id_status");

        // Crear roles (verificar si existen)
        const roles: RoleModel[] = [
            { id_role: 1, name_role: "ADMIN" },
            { id_role: 2, name_role: "MOD" },
            { id_role: 3, name_role: "CLIENT" },
        ];

        await seedValidator(models.Role, roles, "id_role");

        // Crear usuarios (verificar si existen)
        const users: UserModel[] = [
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
            {
                id_user: 3,
                firstname_user: "Usuario",
                lastname_user: "Sistema",
                identification_user: "4444444444",
                email_user: "user@gmail.com",
                password_user: bcrypt.hashSync("12345", 10),
                id_role: 3,
                id_status: 1,
                created_at_user: new Date(),
            },
        ];

        await seedValidator(models.User, users, "id_user");

        return HttpResponse.success(reqMsg.success);
    }
}
