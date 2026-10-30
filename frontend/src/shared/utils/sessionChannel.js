/**
 * Detección de sesión activa mediante heartbeat en localStorage.
 *
 * La pestaña autenticada (DashboardLayout) escribe un timestamp cada
 * HEARTBEAT_INTERVAL ms y lo borra al cerrarse (beforeunload).
 *
 * El Login lee ese timestamp en el momento del submit:
 *   - Si existe y es reciente → hay una pestaña abierta → bloquear
 *   - Si no existe o es viejo → pestaña cerrada → dejar entrar
 */

const HEARTBEAT_KEY      = "jms_tab_alive";
const HEARTBEAT_INTERVAL = 3_000;   // escribe cada 3 s
const STALE_MS           = 7_000;   // se considera "viva" si tiene < 7 s de antigüedad

/**
 * Llama esto en DashboardLayout (useEffect).
 * Devuelve una función de limpieza para el return del useEffect.
 */
export function startHeartbeat() {
    const write = () => localStorage.setItem(HEARTBEAT_KEY, String(Date.now()));
    write(); // pulso inmediato al montar

    const intervalId = setInterval(write, HEARTBEAT_INTERVAL);

    const onUnload = () => {
        clearInterval(intervalId);
        localStorage.removeItem(HEARTBEAT_KEY);
    };
    window.addEventListener("beforeunload", onUnload);

    return () => {
        clearInterval(intervalId);
        window.removeEventListener("beforeunload", onUnload);
        localStorage.removeItem(HEARTBEAT_KEY);
    };
}

/**
 * Llama esto en Login antes de autenticar.
 * @returns {boolean} true si hay una pestaña autenticada activa
 */
export function isTabAlive() {
    const raw = localStorage.getItem(HEARTBEAT_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < STALE_MS;
}
