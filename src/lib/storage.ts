/**
 * Small localStorage wrapper. Storage can be unavailable (private mode,
 * blocked site data), so every access is guarded and failures fall back
 * to defaults instead of breaking the app.
 */

export function readJson<T>(key: string, fallback: T): T {
    try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

export function writeJson(key: string, value: unknown): void {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Ignore quota or privacy-mode errors; history is a convenience.
    }
}
