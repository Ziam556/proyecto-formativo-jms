// Configuración compartida de Nodemailer (Gmail App Password)
// Las credenciales se leen desde variables de entorno (.env) — nunca hardcodear aquí.
import nodemailer from "nodemailer";

export const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS        = process.env.MAIL_PASS;

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});
