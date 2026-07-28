import { loansService } from "./loans.service.js";
import { generateCode, saveCode, validateCode } from "./loans.verification.js";
import { transporter, MAIL_USER } from "../../config/mailer.js";

export const loansController = {
    async create(req, res) {
        try {
            const loan = await loansService.create(req.body);
            res.status(201).json(loan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const loans = await loansService.getAll();
            res.json(loans);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getById(req, res) {
        try {
            const loan = await loansService.getById(req.params.id);
            if (!loan) return res.status(404).json({ error: "Préstamo no encontrado" });
            res.json(loan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const loan = await loansService.update(req.params.id, req.body);
            if (!loan) return res.status(404).json({ error: "Préstamo no encontrado" });
            res.json(loan);
        } catch (error) {
            res.status(error.message === "Préstamo no encontrado" ? 404 : 500).json({ error: error.message });
        }
    },

    async updateStatus(req, res) {
        try {
            const loan = await loansService.updateStatus(req.params.id, req.body.status);
            res.json(loan);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async registerReturn(req, res) {
        try {
            const { items = [] } = req.body;
            const result = await loansService.registerReturn(req.params.id, items);
            res.status(200).json(result);
        } catch (error) {
            const status = error.message === "No hay materiales para devolver" ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    },

    // ── Verificación de préstamo ─────────────────────────────────────────────

    async sendVerification(req, res) {
        const { userEmail, userName } = req.body;

        if (!userEmail) {
            return res.status(400).json({ error: "Se requiere el correo del usuario." });
        }

        try {
            const code = generateCode();
            saveCode(userEmail, code);

            await transporter.sendMail({
                from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
                to:      userEmail,
                subject: "Código de verificación — Préstamo de materiales",
                html: `
                    <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0e123e;border-radius:16px;color:#fff;">
                        <h2 style="color:#50E5F9;margin-top:0;">Código de verificación</h2>
                        <p>Hola${userName ? ` <strong>${userName}</strong>` : ""}, se está registrando un préstamo de materiales a tu nombre.</p>
                        <p>Tu código de verificación es:</p>
                        <div style="font-size:2.5rem;font-weight:bold;letter-spacing:10px;text-align:center;padding:20px 0;color:#FDC300;">
                            ${code}
                        </div>
                        <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;">
                            Este código expira en <strong>10 minutos</strong>.<br>
                            Si no solicitaste ningún préstamo, ignora este mensaje o comunícate con un administrador.
                        </p>
                    </div>
                `,
            });

            res.json({ ok: true, message: "Código enviado al correo del usuario." });
        } catch (err) {
            console.error("Error enviando código de verificación:", err);
            res.status(500).json({ error: "No se pudo enviar el correo. Verifica la configuración." });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await loansService.delete(Number(req.params.id));
            res.status(200).json({ message: "Préstamo eliminado correctamente", loan: deleted });
        } catch (err) {
            console.error("ERROR delete loan:", err);
            const status = err.message.includes("no encontrado") ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    },

    async verifyCode(req, res) {
        const { userEmail, code } = req.body;

        if (!userEmail || !code) {
            return res.status(400).json({ error: "Se requieren correo y código." });
        }

        const result = validateCode(userEmail, code);
        if (!result.valid) {
            return res.status(400).json({ error: result.reason });
        }

        res.json({ ok: true, message: "Código verificado correctamente." });
    },
};
