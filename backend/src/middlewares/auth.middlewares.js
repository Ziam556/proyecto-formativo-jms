import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token invalido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token invalido o expirado" });
    }
};

/** Solo permite el acceso si el usuario pertenece al grupo SuperAdministrador. */
export const requireSuperAdmin = (req, res, next) => {
    if (req.user?.userGroup !== "SuperAdministrador") {
        return res.status(403).json({ message: "Se requiere rol SuperAdministrador" });
    }
    next();
};
