import { groupsService } from "./groups.service.js";

export const groupsController = {
    async getAll(req, res) {
        try {
            const groups = await groupsService.getAll();
            res.json(groups);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo grupos" });
        }
    },

    async getGroupPermissions(req, res) {
        try {
            const groupId = Number(req.params.groupId);
            const permissions = await groupsService.getPermissionsByGroupId(groupId);
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo permisos del grupo" });
        }
    },

    async create(req, res) {
        try {
            const { groupName, permissionCodenames = [] } = req.body;
            const group = await groupsService.create(groupName, permissionCodenames);
            res.status(201).json(group);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
