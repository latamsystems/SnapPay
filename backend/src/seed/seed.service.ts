import bcrypt from 'bcrypt';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { Service } from "@/lib/crud/service/decorator.service";
import { seedValidator } from '@/lib/crud/config/validation/seed.validation';

import { Status } from '@/models/interface/status.interface';
import { Role } from '@/models/interface/role.interface';
import { User } from '@/models/interface/user.interface';
import { Brand } from '@/models/interface/brand.interface';
import { Model } from '@/models/interface/model.interface';
import { Device } from '@/models/interface/device.interface';
import { Client } from '@/models/interface/client.interface';
import { TypeFees } from '@/models/interface/typeFees.interface';
import { Control } from '@/models/interface/control.interface';

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
            { id_status: 6, name_status: "RECHAZADO" },
        ];

        await seedValidator(models.Status, status, "id_status");

        // Crear controles de app (verificar si existen)
        const controls: Control[] = [
            { id_control: 1, name_control: "MODO MANTENIMIENTO", id_status: 1 },
            { id_control: 2, name_control: "WHATSAPP", id_status: 1 },
            { id_control: 3, name_control: "CHATBOT", id_status: 1 },
            { id_control: 4, name_control: "CHAT GENERAL", id_status: 1 },
        ];

        await seedValidator(models.Control, controls, "id_control");

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

        // Crear datos marcas
        const brands: Brand[] = [
            { id_brand: 1, name_brand: "Infinix" },
            { id_brand: 2, name_brand: "Samsung" },
            { id_brand: 3, name_brand: "Xiaomi" },
            { id_brand: 4, name_brand: "Huawei" },
            { id_brand: 5, name_brand: "Apple" },
        ]

        await seedValidator(models.Brand, brands, "id_brand");

        // Crear modelos
        const model: Model[] = [
            { id_model: 1, name_model: "Note 12 Pro 5G", id_brand: 1 },
            { id_model: 2, name_model: "Iphone 13", id_brand: 5 },
            { id_model: 3, name_model: "Galaxy S23", id_brand: 2 },
            { id_model: 4, name_model: "Galaxy S22", id_brand: 2 },
            { id_model: 5, name_model: "Redmi Note 11", id_brand: 3 },
            { id_model: 6, name_model: "P40 Pro", id_brand: 4 },
            { id_model: 7, name_model: "Iphone 14", id_brand: 5 },
        ]

        await seedValidator(models.Model, model, "id_model");

        // Crear dispositivos
        const devices: Device[] = [
            { id_device: 1, price_device: 180.0, id_model: 1, id_user: 1, id_status: 1 },
            { id_device: 2, price_device: 600.0, id_model: 2, id_user: 1, id_status: 1 },
            { id_device: 3, price_device: 450.0, id_model: 3, id_user: 1, id_status: 1 },
            { id_device: 4, price_device: 400.0, id_model: 4, id_user: 1, id_status: 1 },
            { id_device: 5, price_device: 300.0, id_model: 5, id_user: 1, id_status: 1 },
            { id_device: 6, price_device: 200.0, id_model: 6, id_user: 1, id_status: 1 },
            { id_device: 7, price_device: 1000.0, id_model: 7, id_user: 1, id_status: 1 },
        ]

        await seedValidator(models.Device, devices, "id_device");

        // Crear tipos de cuotas
        const typeFees: TypeFees[] = [
            { id_typeFees: 1, name_typeFees: "SEMANAL" },
            { id_typeFees: 2, name_typeFees: "QUINCENAL" },
            { id_typeFees: 3, name_typeFees: "MENSUAL" },
        ]

        await seedValidator(models.TypeFees, typeFees, "id_typeFees");

        // Crear clientes
        const clients: Client[] = [
            { id_client: 1, firstname_client: 'Armando Josue', lastname_client: 'Velasquez Delgado', identification_client: '2350793218', email_client: 'josue27.velasquez9@gmail.com', phone_client: '0980167849', id_user: 1, id_status: 1 },
            { id_client: 2, firstname_client: 'Alicia Melinda', lastname_client: 'Velasquez Delgado', identification_client: '2350793226', email_client: 'josuearmando814@gmail.com', phone_client: '0980167849', id_user: 1, id_status: 1 },
        ]

        await seedValidator(models.Client, clients, "id_client");

        return HttpResponse.success({ message: reqMsg.success });
    }
}
