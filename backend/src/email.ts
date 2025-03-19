import Console from '@/helpers/console';
import { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASSWD, EMAIL_SEND } from '@/src/enviroment';
import nodemailer, { Transporter } from 'nodemailer';

const consoleHelper = new Console("EMAIL");

// ============================================================================

/**
 * Configuración del transporte
 * @type {Transporter}
 */
const transporter: Transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE, // Ejemplos: Gmail, Outlook, Yahoo, etc.
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWD
  }
});

// ============================================================================

/**
 * Envía un correo electrónico
 * @param email - Dirección de correo del destinatario
 * @param subject - Asunto del correo
 * @param text - Texto sin formato del correo
 * @param html - Contenido HTML del correo
 * @returns Promise con el resultado del envío
 */
export const sendResetEmail = async (
  email: string,
  subject: string,
  text: string,
  html: string
): Promise<void> => {
  
  const mailOptions = {
    from: EMAIL_SEND,
    to: email,
    subject: subject,
    text: text,
    html: html
  };

  try {
    await transporter.sendMail(mailOptions);
    consoleHelper.success(`Correo enviado a: ${email}`, false);
  } catch (error) {
    consoleHelper.error(`Error al enviar correo a ${email}`, false);
    console.error(error);
    throw error;
  }
};

