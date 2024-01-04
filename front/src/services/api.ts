import Axios from "axios"
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"
import type { CustomAxiosResponse } from "@/types/axios"

const api = Axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "content-type": "application/json",
  },
}) as AxiosInstance & { protectedByCSRF(): Promise<void> }

// Custom methods
api.protectedByCSRF = function () {
  return this.get("/api/auth/csrf").then(({ data }) => {
    if (data?.X_CSRF_TOKEN) this.defaults.headers.common["X-CSRF-TOKEN"] = data.X_CSRF_TOKEN
  })
}

// Request interceptor
function requestSuccess(config: InternalAxiosRequestConfig) {
  config.headers.authorization = localStorage.getItem("accessToken")

  return config
}
function requestError() {}

// Response interceptor
function commonResponse(response: CustomAxiosResponse) {
  if (response.data.__toastify) {
    response.data.__toastify.forEach(({ type, message, timeout }) => {
      setTimeout(() => {
        toast(message ?? "", type ?? "info")
      }, timeout ?? 0)
    })
  }
}

function responseSuccess(response: CustomAxiosResponse) {
  const authorization = response.headers.authorization as string | undefined

  if (authorization && authorization.split(".").length >= 3) {
    // console.warn("++ New authorization token provided")
    localStorage.setItem("accessToken", `Bearer ${authorization}`)
  }

  commonResponse(response)
  return response
}
function responseError(error: AxiosError) {
  const { response } = error
  const { reset } = UseAuthStore()

  switch (error.response?.status) {
    case 400:
      break
    case 401:
      reset()
      break
    case 403:
      break
    case 404:
      break
    case 429:
      break
    case 500:
      reset()
      break
  }

  commonResponse(response as CustomAxiosResponse)

  throw response
}

api.interceptors.request.use(requestSuccess, requestError)
api.interceptors.response.use(responseSuccess, responseError)

export default api
