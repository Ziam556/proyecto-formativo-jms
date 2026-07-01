import { loansRepository } from "./loans.repository.js";

export const loansService = {
    async create(loanData) {
        const { items = [], ...loanFields } = loanData;
        const loan = await loansRepository.create(loanFields);
        await loansRepository.createItems(loan.loan_id, items);
        return loan;
    },

    async getAll() {
        return loansRepository.findAll();
    },

    async getById(loanId) {
        return loansRepository.findById(loanId);
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
