
import axios, { AxiosError, AxiosRequestConfig } from "axios"

interface ApiSuccess<T> {
  success: true
  data: T
}
interface ApiFailure {
  success: false
  errors: string[]
  status?: number
}
export type ApiResult<T> = ApiSuccess<T> | ApiFailure

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token":
      document.querySelector('[name="csrf-token"]')?.getAttribute("content") ||
      "",
  },
});


export async function requestJSON<T>(
  config: AxiosRequestConfig
): Promise<ApiResult<T>> {
  try {
    const resp = await api.request<ApiSuccess<T>>(config)

    if (resp.data.success) {
      return { success: true, data: resp.data.data }
    } else {
      // server-side returned { success: false, errors: […] }
      const errors = Array.isArray((resp.data as any).errors)
        ? (resp.data as any).errors
        : [ (resp.data as any).errors || "Unknown error" ]
      return { success: false, errors, status: resp.status }
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const payload = err.response.data as any

        // if your 422/404 JSON has { success:false, errors: [...] }
        const errs = Array.isArray(payload.errors)
          ? payload.errors
          : // maybe it has message instead?
            [ payload.message || err.response.statusText ]

        return { success: false, errors: errs, status: err.response.status }
      }

      return {
        success: false,
        errors: ["Network error: could not connect to server"],
      }
    }

    
    return {
      success: false,
      errors: [ err instanceof Error ? err.message : String(err) ],
    }
  }
}

