import fs from 'fs';
import handlebars from 'handlebars';
import { TIME_RESET_PASSWD } from "@/src/enviroment";
import { sendResetEmail } from "@/src/email";
import HttpResponse from "@/helpers/httpResponse";

import models from "@/models/init-models";
import { entityVerify } from '@/lib/crud/config/validation/entity.validation';
import { Service } from '@/lib/crud/service/decorator.service';

// =============================================================================

export class MailService {

    /**
     * Enviar codigo para restablecer contraseña
     * @param formData 
     * @param token 
     * @param reqMsg 
     * @returns 
     */
    @Service
    static async resetPassword(formData: any, token: any, reqMsg: any) {

        const { email_user } = formData;

        // Validar campos obligatorios
        const validationError = entityVerify({ email_user });
        if (validationError) return HttpResponse.badRequest(validationError);

        // Tiempo de expiración del token
        const time = Number(TIME_RESET_PASSWD);
        const expirationTime = new Date(Date.now() + time);

        // Buscar el usuario por email
        const user = await models.User.findOne({ where: { email_user } });
        if (!user) return HttpResponse.notFound({ message: reqMsg.notFoundUser, field: "email_user" });

        // Actualizar el usuario con el token y la fecha de expiración
        user.resetPasswordToken_user = token;
        user.resetPasswordExpires_user = expirationTime;
        await user.save();

        // Datos de envío
        const subject = 'Restablecimiento de Contraseña';
        const text = `Usa este código para restablecer tu contraseña: ${token}`;

        // Leer la plantilla HTML
        const htmlTemplate = fs.readFileSync('public/emails/reset_passwd.html', 'utf8');

        // Compilar la plantilla con Handlebars
        const template = handlebars.compile(htmlTemplate);
        const html = template({ token, firstname_user: user.firstname_user, lastname_user: user.lastname_user });

        // Enviar el correo electrónico
        await sendResetEmail(email_user, subject, text, html);
        return HttpResponse.success(reqMsg.success, { mail: email_user, time: expirationTime });
    }
}
