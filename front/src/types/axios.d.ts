import type { InternalAxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios"
import type { ToastType, Content } from "vue3-toastify"

export type AxiosResponseData = {
  __toastify?: Array<{ message: Content; type: ToastType; timeout: number }>

  authorizationToken?: string
}

export interface CustomAxiosResponse<T = AxiosResponseData, D = unknown> {
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: InternalAxiosRequestConfig<D>
  request?: unknown
}

export type ContentTypes = "application/ogg " | "application/pdf " | "application/json" | "application/xml " | "application/zip "
