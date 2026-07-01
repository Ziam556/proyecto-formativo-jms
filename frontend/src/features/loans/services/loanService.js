const API_URL = "/api/loans";

function getAuthHeaders() {
    const token = sessionStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

function getBearerHeaders() {
    const token = sessionStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
}

// ── Mapear préstamo del backend al shape del frontend ────────────────────────
function mapLoan(l) {
    const fmt = (d) =>
        d ? new Date(d).toLocaleDateString("es-CO") : "—";

    return {
        id:           l.loan_id,
        ficha:        l.file_group   ?? "—",
        amount:       l.amount,
        departureDate: fmt(l.departure_date),
        deliveryDate:  fmt(l.delivery_date),
        justification: l.justification,
        user:          l.requesting_user,
        status:        l.loan_status,
        materiales:   (l.materiales || []).map((m) => ({
            name:   m.name,
            type:   m.type,
            amount: m.amount ?? 1,
        })),
    };
}

// ── Préstamos ────────────────────────────────────────────────────────────────

export async function createLoan(loanData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(loanData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear el préstamo");
    }
    return response.json();
}

export async function getLoans() {
    const response = await fetch(API_URL, { headers: getBearerHeaders() });
    if (!response.ok) throw new Error("Error al obtener los préstamos");
    const data = await response.json();
    return data.map(mapLoan);
}

export async function getLoanById(id) {
    const response = await fetch(`${API_URL}/${id}`, { headers: getBearerHeaders() });
    if (!response.ok) throw new Error("Préstamo no encontrado");
    const data = await response.json();
    return {
        ...mapLoan(data),
        materiales: (data.items || []).map((i) => ({
            id:               i.loan_item_id,
            name:             i.material_name,
            type:             i.material_type === "M.D" ? "Devolutivo" : "Consumo",
            amount:           i.amount,
            returned:         Boolean(i.returned_at),
            returnedState:    i.item_state,
            returnedLeftover: i.leftover_amount,
            returnedNotes:    i.observations,
        })),
    };
}

export async function updateLoan(id, fields) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(fields),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar el préstamo");
    }
    return response.json();
}

// ── Devoluciones ──────────────────────────────────────────────────────────────

export async function registerLoanReturn(loanId, items) {
    const response = await fetch(`${API_URL}/${loanId}/return`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al registrar la devolución");
    }
    return response.json();
}

// ── Materiales disponibles para préstamo (consumo + devolutivo) ───────────────

export async function getMaterialsForLoan() {
    const headers = getBearerHeaders();
    const [consumableRes, returnableRes] = await Promise.all([
        fetch("/api/consumableMaterial", { headers }),
        fetch("/api/returnableMaterial", { headers }),
    ]);

    const consumable = consumableRes.ok ? await consumableRes.json() : [];
    const returnable = returnableRes.ok ? await returnableRes.json() : [];

    return [
        ...consumable.map((m) => ({
            id:           `C-${m.consumable_material_id}`,
            material:     m.material_element_name,
            materialtype: "M.C",
            plateSena:    m.material_plate    ?? "—",
            serial:       null,
            amount:       m.material_amount   ?? 0,
        })),
        ...returnable.map((m) => ({
            id:           `D-${m.returnable_material_id}`,
            material:     m.material_element_name,
            materialtype: "M.D",
            plateSena:    m.material_plate    ?? "—",
            serial:       m.material_serial   ?? "—",
            amount:       1,
        })),
    ];
}
