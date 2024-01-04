import type { RouteLocationNamedRaw, RouteRecordRaw } from "vue-router"

export const navRoutes: { label: string; to: RouteLocationNamedRaw }[] = [
  { label: "Se connecter", to: { name: "SignIn" } },
  { label: "Créer un compte", to: { name: "SignUp" } },
  { label: "Mon compte", to: { name: "Account" } },
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
    path: "/account",
    name: "Account",
    component: () => import("../pages/account.vue"),
    meta: { requiresAnonymous: false, requiresAuth: true },
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
