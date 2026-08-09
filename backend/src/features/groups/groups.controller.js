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

    async getAllPermissions(req, res) {
        try {
            const permissions = await groupsService.getAllPermissions();
            res.json(permissions);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo permisos" });
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

    async addUsers(req, res) {
        try {
            const groupId = Number(req.params.groupId);
            const { documentNumbers = [] } = req.body;
            const result = await groupsService.addUsersToGroup(groupId, documentNumbers);
            res.json({ message: "Usuarios agregados al grupo", ...result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async update(req, res) {
        try {
            const groupId = Number(req.params.groupId);
            const { groupName, permissionCodenames = [] } = req.body;
            const group = await groupsService.update(groupId, groupName, permissionCodenames);
            res.json(group);
        } catch (error) {
            const status = error.message.includes("no encontrado") ? 404 : 500;
            res.status(status).json({ error: error.message });
        }
    },

    async getGroupUsers(req, res) {
        try {
            const groupId = Number(req.params.groupId);
            const users = await groupsService.getUsersByGroupId(groupId);
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: "Error obteniendo usuarios del grupo" });
        }
    },

    async removeUsers(req, res) {
        try {
            const groupId = Number(req.params.groupId);
            const { documentNumbers = [] } = req.body;
            const result = await groupsService.removeUsersFromGroup(groupId, documentNumbers);
            res.json({ message: "Usuarios eliminados del grupo", ...result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async toggle(req, res) {
        try {
            const group = await groupsService.toggle(Number(req.params.groupId));
            res.json(group);
        } catch (err) {
            const status = err.message.includes("no encontrado") ? 404 : 500;
            res.status(status).json({ error: err.message });
        }
    },

    async delete(req, res) {
        try {
            const deleted = await groupsService.delete(Number(req.params.groupId));
            res.status(200).json({ message: "Grupo eliminado correctamente", group: deleted });
        } catch (err) {
            console.error("ERROR delete group:", err);
            const status = err.message.includes("no encontrado") ? 404
                         : err.message.includes("sistema")      ? 403
                         : 500;
            res.status(status).json({ error: err.message });
        }
    },
};
