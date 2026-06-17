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
};
