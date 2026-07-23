// Configuración compartida de Nodemailer (Gmail App Password)
import nodemailer from "nodemailer";

export const MAIL_USER = "sc876858@gmail.com";
const MAIL_PASS = "jhqocfbwjqxxdgnq";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});
