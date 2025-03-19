import { Request } from 'express';
import { MailService } from "@/src/mail/mail.service";
import { Controller } from '@/lib/crud/controller/decorator.controller';

// =============================================================================

/**
 * Generar codigo de 6 digitos
 * @returns 
 */
const generateToken = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// =============================================================================

export class MailController {

    /**
     * Enviar codigo para restablecer contraseña
     * @param req
     */
    @Controller({
        service: MailService.resetPassword,
        messages: {
            success: 'Restablecimiento de contraseña enviado exitosamente.',
            notFoundUser: 'No se ha encontrado el usuario con el correo electrónico proporcionado.',
        },
        extractParams: (req: Request) => [req.body, generateToken()]
    })
    static resetPassword() { void 0 }
}
