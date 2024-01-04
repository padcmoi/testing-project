<script setup lang="ts">
  import { RouterLink, RouterView } from "vue-router"
  const _route = useRoute()
</script>

<template>
  <header>
    <nav class="my-1 mx-5">
      <ul class="nav nav-pills">
        <li class="nav-item" v-for="(route, i) of navRoutes" :key="i">
          <RouterLink :class="['nav-link', _route.name == route.to.name ? 'active' : '']" :to="route.to">{{ route.label }}</RouterLink>
        </li>
      </ul>
    </nav>
  </header>

  <main class="container-fluid vh90 d-flex align-items-center">
    <RouterView></RouterView>
  </main>
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
