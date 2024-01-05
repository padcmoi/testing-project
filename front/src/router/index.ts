import { storeToRefs } from "pinia"
import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL as string),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const { loadData } = UseAuthStore()
  const { currentUser } = storeToRefs(UseAuthStore())

  if (localStorage.getItem("accessToken")) await loadData()

  if (to.meta.requiresAnonymous && currentUser.value.loggedIn) next({ name: "Account" })
  else if (to.meta.requiresAuth && !currentUser.value.loggedIn) next({ name: "SignIn" })
  else next()
})

router.afterEach(async (to) => {
  nextTick(() => {
    document.title = (to.meta.title as string) ?? ""
  })
})

export default router
