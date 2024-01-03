import type { Router } from "vue-router"

const globalRouter = { router: null } as { router: null | Router }

const loadGlobalRouter = () => (globalRouter.router = useRouter())

export { globalRouter, loadGlobalRouter }
