<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
  import type { Todo } from "@/types/Todo"
  import TodoList from "../components/TodoList.vue"
  import { storeToRefs } from "pinia"

  const { currentUser } = storeToRefs(UseAuthStore())

  const loading = ref<boolean>(true)
  const todos = ref<Todo[]>([])

  function loadData() {
    todoController
      .getTodos()
      .then((data) => {
        if (data.success) {
          todos.value = data.todo
          loading.value = false
        }
      })
      .catch(() => (loading.value = false))
  }

  function addItem(label: string) {
    todoController.addTodo(label).then((data) => {
      if (data.success) loadData()
    })
  }
  function change(todo: Todo) {
    todoController.changeTodo(todo.id, todo.status)
  }
  function remove(todo: Todo) {
    todoController.removeTodo(todo.id).then((data) => {
      if (data.success) loadData()
    })
  }
  function uncheckAll() {
    todoController.changeAllTodos(false).then((data) => {
      if (data.success) loadData()
    })
  }

  onBeforeMount(() => {
    loadData()
  })
</script>

<template>
  <div class="container-fluid row" v-show="!loading">
    <div class="col-0 col-lg-2"></div>
    <div class="col-12 col-lg-8 maxWidth mt-5 mx-auto">
      <!--  -->
      <todo-list v-model="todos" :identifier="currentUser.identifier" @add-item="addItem" @change="change" @remove="remove" @unchecked-all="uncheckAll" />
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
