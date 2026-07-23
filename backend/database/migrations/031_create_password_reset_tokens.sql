-- Tabla para almacenar los OTPs de recuperación de contraseña
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id           SERIAL PRIMARY KEY,
    user_email   VARCHAR(150) NOT NULL,
    otp_code     VARCHAR(6)   NOT NULL,
    expires_at   TIMESTAMP    NOT NULL,
    used         BOOLEAN      DEFAULT FALSE,
    created_at   TIMESTAMP    DEFAULT NOW()
);
