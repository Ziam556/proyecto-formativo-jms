import { loansRepository } from "./loans.repository.js";
import { transporter, MAIL_USER } from "../../config/mailer.js";

// ── Helpers de email ─────────────────────────────────────────────────────────

async function sendLoanCreatedEmail(loan, notificationEmail) {
    const recipient = notificationEmail || loan?.requesting_user;
    if (!recipient) return;
    await transporter.sendMail({
        from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
        to:      recipient,
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

async function sendLoanUpdatedEmail(loan, recipientEmail) {
    if (!recipientEmail) return;
    await transporter.sendMail({
        from:    `"Sistema de Inventario SENA" <${MAIL_USER}>`,
        to:      recipientEmail,
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
        const { items = [], notificationEmail, ...loanFields } = loanData;
        const loan = await loansRepository.create(loanFields);
        await loansRepository.createItems(loan.loan_id, items);

        // Actualizar inventario: descontar stock al salir el préstamo
        for (const item of items) {
            if (!item.materialId) continue;
            if (item.materialType === "M.C") {
                await loansRepository.decrementConsumableStock(item.materialId, item.amount ?? 1);
            } else if (item.materialType === "M.D") {
                await loansRepository.disableReturnableMaterial(item.materialId);
            }
        }

        sendLoanCreatedEmail(loan, notificationEmail); // no-await: no bloquea la respuesta
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

        // Buscar el email real del cuentadante para notificar correctamente.
        // requesting_user almacena el nombre, no el email, así que se busca por nombre o documento.
        loansRepository
            .findUserEmailByNameOrDoc(updated.requesting_user)
            .then((email) => sendLoanUpdatedEmail(updated, email))
            .catch((err) => console.error("Error buscando email para notificación:", err));

        return updated;
    },

    async updateStatus(loanId, status) {
        // Al cancelar un préstamo, restaurar el inventario de cada ítem
        if (status === "cancelado") {
            const loan = await loansRepository.findById(loanId);
            if (loan?.items?.length) {
                for (const item of loan.items) {
                    if (item.material_type === "M.C" && item.consumable_material_id) {
                        // Devolver la cantidad completa (nada se consumió físicamente)
                        await loansRepository.restoreConsumableStock(
                            item.consumable_material_id,
                            item.amount
                        );
                    } else if (item.material_type === "M.D" && item.returnable_material_id) {
                        await loansRepository.enableReturnableMaterial(item.returnable_material_id);
                    }
                }
            }
        }
        return loansRepository.updateStatus(loanId, status);
    },

    async delete(loanId) {
        // Restaurar inventario antes de eliminar (igual que al cancelar)
        const loan = await loansRepository.findById(loanId);
        if (!loan) throw new Error("Préstamo no encontrado");

        if (loan.items?.length) {
            for (const item of loan.items) {
                if (item.material_type === "M.C" && item.consumable_material_id) {
                    await loansRepository.restoreConsumableStock(item.consumable_material_id, item.amount);
                } else if (item.material_type === "M.D" && item.returnable_material_id) {
                    await loansRepository.enableReturnableMaterial(item.returnable_material_id);
                }
            }
        }

        const deleted = await loansRepository.delete(loanId);
        if (!deleted) throw new Error("Préstamo no encontrado");
        return deleted;
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

        // Actualizar inventario con los materiales físicamente devueltos
        const itemIds  = items.map((it) => it.loanItemId);
        const refs     = await loansRepository.getMaterialRefsByItemIds(itemIds);
        for (const ref of refs) {
            const returnData = items.find((it) => it.loanItemId === ref.loan_item_id);
            if (!returnData) continue;

            if (ref.material_type === "M.C" && ref.consumable_material_id) {
                // Sumar sobrante reportado al stock del consumible
                await loansRepository.restoreConsumableStock(
                    ref.consumable_material_id,
                    returnData.leftoverAmount ?? 0
                );
            } else if (ref.material_type === "M.D" && ref.returnable_material_id) {
                // Actualizar estado del devolutivo y re-habilitarlo (salvo pérdida)
                await loansRepository.restoreReturnableMaterial(
                    ref.returnable_material_id,
                    returnData.state ?? "Bueno"
                );
            }
        }

        const { total, returned } = await loansRepository.countItemsAndReturns(loanId);

        // Si ya se devolvieron todos los materiales del préstamo, se marca completo
        if (total > 0 && returned >= total) {
            await loansRepository.updateStatus(loanId, "devuelto");
        }

        const loan = await loansRepository.findById(loanId);
        return { loan, total, returned };
    },
};
