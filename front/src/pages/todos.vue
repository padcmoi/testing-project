<script lang="ts" setup>
  import type { Todo } from "@/types/Todo"
  import TodoList from "../components/TodoList.vue"
  import { storeToRefs } from "pinia"

  const { currentUser } = storeToRefs(UseAuthStore())

  const todos = ref<Todo[]>([
    { id: "_id_1", label: "Lorem", status: false },
    { id: "_id_2", label: "ipsum", status: true },
    { id: "_id_3", label: "dolor", status: false },
    { id: "_id_4", label: "sit", status: true },
    { id: "_id_5", label: "amet", status: false },
    { id: "_id_6", label: "consectetur", status: false },
  ])
</script>

<template>
  <div class="container-fluid row">
    <div class="col-0 col-lg-2"></div>
    <div class="col-12 col-lg-8 maxWidth mt-5 mx-auto">
      <!--  -->

      <todo-list v-model="todos" :identifier="currentUser.identifier"></todo-list>

      {{ todos }}

      <!--  -->
    </div>
    <div class="col-0 col-lg-2"></div>
  </div>
</template>

<style scoped>
  .maxWidth {
    max-width: 1000px;
  }
</style>
