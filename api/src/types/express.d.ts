/* eslint-disable @typescript-eslint/no-explicit-any */

export interface CustomExpressRequest {
  [k: string]: any
  body: any
  cookies: Record<string, any>
  headers: Record<string, any>
  params: Record<string, any>
  query: Record<string, any>

  userId?: string
  __toastify: Array<{ type: "info" | "success" | "error" | "warning" | "loading" | "default"; message: string; timeout?: number }>
}

export interface CustomExpressAuthInfo {}

declare global {
  namespace Express {
    export interface AuthInfo extends CustomExpressAuthInfo {}

    export interface Request extends CustomExpressRequest {}
  }
}
