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
};
