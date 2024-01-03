import { toast as Vue3Toastify } from "vue3-toastify"
import type { ToastContainerOptions, ToastType, Content } from "vue3-toastify"
import type { ContentTypes } from "../types/axios"

export function If(condition: boolean, ...values: object[]) {
  return condition ? values : []
}

export function scrollToSmooth(top: number = 0, left: number = 0) {
  // scrollTo function exists but behavior smooth doesnt work
  window.scroll({ top, left, behavior: "smooth" })
}

export function toast(content: Content, type: ToastType = "info", autoClose: number = 3000, callback: (() => void) | null = null) {
  const theme = localStorage.getItem("VTheme") == "dark" ? "colored" : "colored"

  if (type == "info" || type == "error" || type == "warning" || type == "success" || type == "loading") {
    const id = Vue3Toastify[type](content, { theme, autoClose } as ToastContainerOptions)

    if (callback && id) callback()

    return id
  }

  return null
}

export function downloadBlobFile(blobPart: BlobPart, fileName: string, type: ContentTypes) {
  const blob = new Blob([blobPart], { type })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  link.click()
  URL.revokeObjectURL(link.href)
}
