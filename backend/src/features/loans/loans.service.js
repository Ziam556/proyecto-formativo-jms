import { loansRepository } from "./loans.repository.js";
import { transporter, MAIL_USER } from "../../config/mailer.js";

// ── Helpers de email ─────────────────────────────────────────────────────────

async function sendLoanCreatedEmail(loan) {
    if (!loan?.requesting_user) return;
    await transporter.sendMail({
        from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
        to:      loan.requesting_user,
        subject: `Préstamo #${loan.loan_id} creado`,
        html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0e123e;border-radius:16px;color:#fff;">
                <h2 style="color:#50E5F9;margin-top:0;">Préstamo registrado</h2>
                <p>Tu solicitud de préstamo ha sido registrada exitosamente.</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">ID Préstamo</td><td style="font-weight:bold;">#${loan.loan_id}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Cantidad</td><td>${loan.amount ?? "—"}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Fecha de salida</td><td>${loan.departure_date ? new Date(loan.departure_date).toLocaleDateString("es-CO") : "—"}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Fecha de entrega</td><td>${loan.delivery_date ? new Date(loan.delivery_date).toLocaleDateString("es-CO") : "—"}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Código de verificación</td><td style="font-weight:bold;letter-spacing:4px;">${loan.verification_code ?? "—"}</td></tr>
                </table>
                <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;">
                    Si no solicitaste este préstamo, comunícate con un administrador.
                </p>
            </div>
        `,
    }).catch((err) => console.error("Error enviando email de préstamo creado:", err));
}

async function sendLoanUpdatedEmail(loan) {
    if (!loan?.requesting_user) return;
    await transporter.sendMail({
        from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
        to:      loan.requesting_user,
        subject: `Préstamo #${loan.loan_id} actualizado`,
        html: `
            <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#0e123e;border-radius:16px;color:#fff;">
                <h2 style="color:#FDC300;margin-top:0;">Préstamo actualizado</h2>
                <p>Los datos de tu préstamo han sido actualizados.</p>
                <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">ID Préstamo</td><td style="font-weight:bold;">#${loan.loan_id}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Estado</td><td>${loan.status ?? "—"}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Fecha de salida</td><td>${loan.departure_date ? new Date(loan.departure_date).toLocaleDateString("es-CO") : "—"}</td></tr>
                    <tr><td style="color:rgba(255,255,255,0.5);padding:6px 0;">Fecha de entrega</td><td>${loan.delivery_date ? new Date(loan.delivery_date).toLocaleDateString("es-CO") : "—"}</td></tr>
                </table>
                <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;">
                    Si tienes dudas, comunícate con un administrador.
                </p>
            </div>
        `,
    }).catch((err) => console.error("Error enviando email de préstamo actualizado:", err));
}

export const loansService = {
    async create(loanData) {
        const { items = [], ...loanFields } = loanData;
        const loan = await loansRepository.create(loanFields);
        await loansRepository.createItems(loan.loan_id, items);
        sendLoanCreatedEmail(loan); // no-await: no bloquea la respuesta
        return loan;
    },

    async getAll() {
        return loansRepository.findAll();
    },

    async getById(loanId) {
        return loansRepository.findById(loanId);
    },

    async update(loanId, fields) {
        const loan = await loansRepository.findById(loanId);
        if (!loan) throw new Error("Préstamo no encontrado");
        const updated = await loansRepository.update(loanId, fields);
        sendLoanUpdatedEmail(updated); // no-await: no bloquea la respuesta
        return updated;
    },

    async updateStatus(loanId, status) {
        return loansRepository.updateStatus(loanId, status);
    },

    async registerReturn(loanId, items) {
        if (!items?.length) throw new Error("No hay materiales para devolver");

        await loansRepository.createReturns(
            items.map((it) => ({
                loanItemId:     it.loanItemId,
                state:          it.state ?? null,
                leftoverAmount: it.leftoverAmount ?? null,
                observations:   it.observations ?? null,
            }))
        );

        const { total, returned } = await loansRepository.countItemsAndReturns(loanId);

        // Si ya se devolvieron todos los materiales del préstamo, se marca completo
        if (total > 0 && returned >= total) {
            await loansRepository.updateStatus(loanId, "devuelto");
        }

        const loan = await loansRepository.findById(loanId);
        return { loan, total, returned };
    },
};
