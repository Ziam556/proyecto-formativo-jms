// auth.service.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { authRepository } from "./auth.repository.js";

export const authService = {
    async login({ email, password }) {
        const user = await authRepository.findByEmail(email);

        if (!user) {
            throw new Error("Credenciales invalidas");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Credenciales invalidas");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.start_date && new Date(user.start_date) > today) {
            throw new Error("Tu cuenta aún no está activa. Comunícate con un administrador.");
        }

        if (user.end_date && new Date(user.end_date) < today) {
            throw new Error("Tu cuenta ha vencido. Comunícate con un administrador.");
        }

        const token = jwt.sign(
            { email: user.user_email, userType: user.user_type },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES },
        );

        return {
            token,
            user: {
                email: user.user_email,
            },
        };
    },
};