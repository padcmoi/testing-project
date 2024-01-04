export {}

declare module "vue-router" {
  interface RouteMeta {
    requiresAnonymous: boolean
    requiresAuth: boolean
  }
}
