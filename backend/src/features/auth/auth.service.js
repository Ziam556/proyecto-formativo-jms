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

        const token = jwt.sign(
            { email: user.user_email },
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