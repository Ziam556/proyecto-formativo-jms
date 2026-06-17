CREATE TABLE IF NOT EXISTS public.loans (
    loan_id             SERIAL PRIMARY KEY,
    file_group          VARCHAR(100),
    amount              INTEGER,
    departure_date      DATE,
    delivery_date       DATE,
    justification       TEXT,
    requesting_user     VARCHAR(150) NOT NULL,
    verification_code   VARCHAR(50)  NOT NULL,
    loan_status         VARCHAR(50)  DEFAULT 'activo'
                            CHECK (loan_status IN ('activo', 'devuelto', 'cancelado')),
    created_at          TIMESTAMP    DEFAULT NOW(),
    updated_at          TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.loan_items (
    loan_item_id    SERIAL PRIMARY KEY,
    loan_id         INTEGER NOT NULL
                        REFERENCES public.loans(loan_id)
                        ON DELETE CASCADE,
    material_name   VARCHAR(150) NOT NULL,
    material_type   VARCHAR(10)  NOT NULL
                        CHECK (material_type IN ('M.C', 'M.D')),
    amount          INTEGER      NOT NULL DEFAULT 1
);
