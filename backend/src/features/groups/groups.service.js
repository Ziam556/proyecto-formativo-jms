import { groupsRepository } from "./groups.repository.js";

export const groupsService = {
    async getAll() {
        return groupsRepository.getAll();
    },

    async getPermissionsByGroupId(groupId) {
        return groupsRepository.getPermissionsByGroupId(groupId);
    },

    async create(groupName, permissionCodenames) {
        const group = await groupsRepository.create(groupName);
        if (permissionCodenames.length) {
            const ids = await groupsRepository.getPermissionIdsByCodenames(permissionCodenames);
            await groupsRepository.assignPermissions(group.group_id, ids);
        }
        return group;
    },

    async addUsersToGroup(groupId, documentNumbers) {
        const userIds = await groupsRepository.getUserIdsByDocuments(documentNumbers);
        await groupsRepository.addUsersToGroup(groupId, userIds);
        return { added: userIds.length };
    },

    async update(groupId, groupName, permissionCodenames) {
        const group = await groupsRepository.update(groupId, groupName);
        if (!group) throw new Error("Grupo no encontrado");
        const ids = await groupsRepository.getPermissionIdsByCodenames(permissionCodenames);
        await groupsRepository.replacePermissions(groupId, ids);
        return group;
    },

    async getUsersByGroupId(groupId) {
        return groupsRepository.getUsersByGroupId(groupId);
    },

    async removeUsersFromGroup(groupId, documentNumbers) {
        const userIds = await groupsRepository.getUserIdsByDocuments(documentNumbers);
        await groupsRepository.removeUsersFromGroup(groupId, userIds);
        return { removed: userIds.length };
    },
};
