import type { RouteLocationNamedRaw, RouteRecordRaw } from "vue-router"

export const navRoutes: { label: string; to: RouteLocationNamedRaw }[] = [
  { label: "S'identifier", to: { name: "SignIn" } },
  { label: "Ajouter une Liste", to: { name: "SignUp" } },
  { label: "Todo liste", to: { name: "Todos" } },
]

export const routes: readonly RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    redirect: { name: "SignIn" },
    meta: { requiresAnonymous: false, requiresAuth: false },
    children: [],
  },
  {
    path: "/sign-in",
    name: "SignIn",
    component: () => import("../pages/signin.vue"),
    meta: { requiresAnonymous: true, requiresAuth: false },
    children: [],
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () => import("../pages/signup.vue"),
    meta: { requiresAnonymous: true, requiresAuth: false },
    children: [],
  },
  {
    path: "/todos",
    name: "Todos",
    component: () => import("../pages/todos.vue"),
    meta: { requiresAnonymous: false, requiresAuth: true },
    children: [],
  },
]
