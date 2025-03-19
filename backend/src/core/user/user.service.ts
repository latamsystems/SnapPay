import sequelize from "sequelize";
import bcrypt from 'bcrypt';
import Console from '@/helpers/console';
import HttpResponse from '@/helpers/httpResponse';

import models from '@/models/init-models';
import { dbConnection } from '@/src/database';
import { CrudService } from "@/lib/crud/service/crud.service";
import { getIo } from '@/src/monitor';

import { rule, validateRequest } from "@/lib/crud/config/validation/request.validation";
import { handleService } from "@/lib/crud/service/config.service";
import { Service } from "@/lib/crud/service/decorator.service";

import { UserModel } from "@/models/interface/user.interface";

// Nombre de servicio
const consoleHelper = new Console("User Service");

// =============================================================================
// =============================================================================

// Configuración de la consulta
const config = {
    attributes: { exclude: ["password_user"] },
    include: [
        { model: models.Status, as: "status" },
        { model: models.Role, as: "role" }
    ]
};

/**
 * Métodos personalizados para el servicio
 */
const serviceMethods = {
    create: (formData: UserModel, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [formData] = args as [any];

            // Reglas de validación
            await validateRequest<UserModel>({
                model: models.User,
                formData,
                rules: [
                    rule.validateFieldTypes(),
                    rule.requiredFields(['firstname_user', 'lastname_user', 'identification_user', 'email_user', 'id_role']),
                    rule.uniqueField('identification_user', reqMsg.sameIdentification),
                    rule.uniqueField('email_user', reqMsg.sameEmail),
                    rule.validEmail('email_user'),
                ],
            });

            // Generar hash de la nueva contraseña
            const password = await bcrypt.hash(formData.identification_user, 10);

            // Crear
            const result = await models.User.create({ ...formData, password_user: password, id_status: 1 });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('user:created', result);

            return HttpResponse.success(reqMsg.success);
        },
        params: [formData]
    }),
    update: (id_user: number, formData: UserModel, reqMsg: Record<string, string>) => handleService({
        consoleHelper, async serviceFunction(...args) {
            const [id_user, formData] = args as [number, UserModel];

            // Reglas de validación
            await validateRequest<UserModel>({
                model: models.User,
                formData,
                rules: [
                    rule.validateFieldTypes(),
                    rule.requiredFields(['firstname_user', 'lastname_user', 'identification_user', 'email_user', 'id_role']),
                    rule.recordExists(id_user, reqMsg.notFound),
                    rule.uniqueField('identification_user', reqMsg.sameIdentification, id_user),
                    rule.uniqueField('email_user', reqMsg.sameEmail, id_user),
                    rule.validEmail('email_user'),
                ],
            });

            // Actualizar datos
            const result = await models.User.update(formData, { where: { id_user } });

            // Emitir evento a todos los clientes conectados
            const io = getIo();
            io.emit('user:updated', result);

            return HttpResponse.success(reqMsg.success);
        },
        params: [id_user, formData]
    })
};

export default { crud: CrudService(models.User, consoleHelper, config, serviceMethods) };

// =============================================================================
// =============================================================================

export class UserService {

    /**
     * Actualizar perfil por ID
     * @param id_user 
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async updateUserProfile(id_user: number, formData: UserModel, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.User,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(["firstname_user", "lastname_user", "identification_user", "email_user"]),
                rule.recordExists(id_user, reqMsg.notFound),
                rule.uniqueField("identification_user", reqMsg.sameIdentification, id_user),
                rule.uniqueField("email_user", reqMsg.sameEmail, id_user),
                rule.validEmail("email_user"),
            ],
        });

        // Actualizar datos
        await models.User.update(formData, { where: { id_user } });

        return HttpResponse.success(reqMsg.success);
    }

    // =============================================================================

    /**
     * Actualizar contraseña de perfil por ID
     * @param id_user 
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async updatePasswordUser(id_user: number, formData: any, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.User,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(["password_user", "new_password"]),
                rule.recordExists(id_user, reqMsg.notFound),
                rule.checkCurrentPassword(id_user, "password_user", "new_password"),
            ],
        });

        // Actualizar contraseña
        await dbConnection.query(`
            UPDATE user 
                SET 
                    password_user = :new_password 
                WHERE 
                    id_user = :id_user
            `,
            {
                replacements: {
                    new_password: await bcrypt.hash(formData.new_password, 10),
                    id_user
                }, type: sequelize.QueryTypes.UPDATE
            }
        );

        return HttpResponse.success(reqMsg.success);
    }

    // =============================================================================

    /**
     * Desactivar registro
     * @param id_user 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async deactivateUser(id_user: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.User,
            rules: [
                rule.recordExists(id_user, reqMsg.notFound),
            ]
        });

        // Actualizar datos
        await models.User.update({ id_status: 2, inactive_in_user: new Date() }, { where: { id_user } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('user:deactivate', { id_user });

        return HttpResponse.success(reqMsg.success);
    }

    // =============================================================================

    /**
     * Activar registro
     * @param id_user 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async activateUser(id_user: number, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.User,
            rules: [
                rule.recordExists(id_user, reqMsg.notFound),
            ]
        });

        // Actualizar datos
        await models.User.update({ id_status: 1, inactive_in_user: null }, { where: { id_user } });

        // Emitir evento a todos los clientes conectados
        const io = getIo();
        io.emit('user:activate', { id_user });

        return HttpResponse.success(reqMsg.success);
    }

    // =============================================================================

    /**
     * Restablecer contraseña
     * @param id_user 
     * @param identification_user 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async resetPasswordUser(id_user: number, identification_user: string, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest<UserModel>({
            model: models.User,
            rules: [
                rule.recordExists(id_user, reqMsg.notFound),
            ]
        });

        // Generar hash de la nueva contraseña
        const password_user = await bcrypt.hash(identification_user, 10);

        // Actualizar datos
        await models.User.update({ password_user }, { where: { id_user } });

        return HttpResponse.success(reqMsg.success);
    }

    // =============================================================================

    /**
     * Verificacion del codigo de recuperación de contraseña
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async resetPasswordUserTokenVerify(formData: any, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.User,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(['email_user', 'verification_code']),
            ],
        });

        const { email_user, verification_code } = formData;

        // Verificar si el código de recuperación es válido
        const code = await models.User.findOne({
            where: {
                email_user,
                resetPasswordToken_user: verification_code,
                resetPasswordExpires_user: { [sequelize.Op.gt]: Date.now() }
            }
        });

        if (!code) return HttpResponse.notFound({ message: reqMsg.notFoundCode, field: "email_user, verification_code" });

        return HttpResponse.success(reqMsg.success);
    }

    // =============================================================================

    /**
     * Restablecer contraseña por codigo de recuperación
     * @param formData 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async resetPasswordUserToken(formData: any, reqMsg: Record<string, string>) {

        // Reglas de validación
        await validateRequest({
            model: models.User,
            formData,
            rules: [
                rule.validateFieldTypes(),
                rule.requiredFields(['email_user', 'verification_code']),
            ],
        });

        const { email_user, verification_code } = formData;

        // Verificar si el código de recuperación es válido
        const code = await models.User.findOne({
            where: {
                email_user,
                resetPasswordToken_user: verification_code,
                resetPasswordExpires_user: { [sequelize.Op.gt]: Date.now() }
            }
        });

        if (!code) return HttpResponse.notFound({ message: reqMsg.notFoundCode, field: "email_user, verification_code" });

        // Verificar si la contraseña es la misma
        if (await bcrypt.compare(verification_code, code.password_user))
            return HttpResponse.conflict({ message: reqMsg.samePassword, field: "verification_code" });

        // Generar hash de la nueva contraseña
        const password_user = await bcrypt.hash(verification_code, 10);

        // Actualizar datos
        await models.User.update({ password_user }, { where: { id_user: code.id_user } });

        return HttpResponse.success(reqMsg.success);
    }



}

