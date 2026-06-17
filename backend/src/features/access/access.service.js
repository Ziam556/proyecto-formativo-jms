import { accessRepository } from "./access.repository.js";

export const accessService = {
    async hasPermission(userEmail, permissionCode) {
        const permissions = await accessRepository.getUserPermissions(userEmail);
        return permissions.includes(permissionCode);
    },
};
