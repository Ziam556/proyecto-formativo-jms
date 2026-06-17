import { accessService } from "./access.service.js";

export const accessController = {
    async checkPermission(req, res) {
        try {
            const userEmail = req.user.email;
            const { permissionCode } = req.params;

            const granted = await accessService.hasPermission(userEmail, permissionCode);

            res.json({ granted });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
