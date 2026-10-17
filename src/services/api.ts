import { getToken } from "@/libs/storage";
import type { ApiResponse } from "@/store/types/ApiType";

const request = async (method: string, path: string, payload?: unknown): Promise<ApiResponse> => {
    const token = getToken()

    const response = await fetch(import.meta.env.PUBLIC_API_URL + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: payload === undefined ? undefined : JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
    })

    // Backend mengembalikan { status, message, data } juga untuk 401/403/404,
    // jadi response error tetap diteruskan ke slice seperti response biasa.
    const body = await response.json().catch(() => null)
    if (body?.status) {
        return body
    }
    throw new Error(`Request failed: ${response.status}`)
}

const api = {
    get     : (path: string) => request("GET", path),
    post    : (path: string, payload: unknown) => request("POST", path, payload),
}

export default api;
