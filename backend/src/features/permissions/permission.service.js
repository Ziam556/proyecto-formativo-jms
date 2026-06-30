import { permissionRepository } from "./permission.repository.js";

export const permissionService = {

    async getAll() {
        return await permissionRepository.findAll();
    },

    async create(name, codename, module) {
        if (!name?.trim() || !codename?.trim()) {
            throw new Error("Nombre y codename son obligatorios");
        }
        // Codename: sin espacios, lowercase
        const normalizedCodename = codename.trim().toLowerCase().replace(/\s+/g, "_");

        const existing = await permissionRepository.findByCodename(normalizedCodename);
        if (existing) throw new Error(`El codename '${normalizedCodename}' ya está registrado`);

        return await permissionRepository.create(
            name.trim(),
            normalizedCodename,
            module?.trim() || "General"
        );
    },

    async update(id, { name, codename, module }) {
        if (!name?.trim() || !codename?.trim()) {
            throw new Error("Nombre y codename son obligatorios");
        }
        const normalizedCodename = codename.trim().toLowerCase().replace(/\s+/g, "_");

        // Verificar que el codename no esté en uso por otro permiso
        const existing = await permissionRepository.findByCodename(normalizedCodename);
        if (existing && existing.permission_id !== Number(id)) {
            throw new Error(`El codename '${normalizedCodename}' ya está en uso`);
        }

        const updated = await permissionRepository.update(id, {
            name: name.trim(),
            codename: normalizedCodename,
            module: module?.trim() || "General",
        });
        if (!updated) throw new Error("Permiso no encontrado");
        return updated;
    },
};
