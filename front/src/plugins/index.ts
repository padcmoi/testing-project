/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// common css

// Plugins

import router from "../router"
import { createPinia } from "pinia"
import Vue3Toastify from "vue3-toastify"
import type { ToastContainerOptions } from "vue3-toastify"
import "vue3-toastify/dist/index.css"

// Types
import type { App } from "vue"

export function registerPlugins(app: App) {
  app
    .use(createPinia())
    .use(router)
    .use(Vue3Toastify, { position: "bottom-right" } as ToastContainerOptions)
}
