<script setup lang="ts">
  import { storeToRefs } from "pinia"
  import { RouterLink, RouterView } from "vue-router"

  const { currentUser } = storeToRefs(UseAuthStore())
  const route = useRoute()
  const router = useRouter()

  const routerDictPermissions = ref<{ [key: string]: { requiresAnonymous: boolean; requiresAuth: boolean } }>({})

  const navigation = computed(() => {
    return navRoutes
      .filter(({ to }) => {
        const permission = routerDictPermissions.value[to.name as string]
        return (
          (currentUser.value.loggedIn && (permission.requiresAuth || !permission.requiresAnonymous)) ||
          (!permission.requiresAuth && !currentUser.value.loggedIn)
        )
      })
      .map(({ label, to }) => {
        return { activeRoute: route.name == to.name ? "active" : "", label, to }
      })
  })

  onBeforeMount(() => {
    router.options.routes.forEach((route) => Object.assign(routerDictPermissions.value, { [route.name as string]: route.meta }))
  })
</script>

<template>
  <header>
    <nav class="m-1">
      <ul class="nav nav-pills">
        <li class="nav-item" v-for="(route, i) of navigation" :key="i">
          <RouterLink :class="['nav-link', route.activeRoute]" :to="route.to">{{ route.label }}</RouterLink>
        </li>
      </ul>
    </nav>
  </header>

  <main class="container-fluid vh90 d-flex align-items-center">
    <RouterView></RouterView>
  </main>

  <footer></footer>
</template>

<style>
  body {
    background: #333;
    color: white;
  }

  nav a {
    color: white !important;
  }

  .vh90 {
    min-height: 90vh;
  }
</style>
