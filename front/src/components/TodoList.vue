<script lang="ts" setup>
  import type { Todo } from "@/types/Todo"

  const emit = defineEmits<{
    (e: "update:modelValue", value: Todo[]): void
    (e: "change", value: Todo): void
    (e: "remove", value: Todo): void
    (e: "addItem", value: string): void
    (e: "uncheckedAll"): void
  }>()

  const props = defineProps<{
    modelValue: Todo[]
    identifier: string
  }>()

  const item = ref<string>("")

  const modelValue = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emit("update:modelValue", value)
    },
  })

  const classes = {
    li: "d-flex justify-content-between align-items-center my-3",
  }
  const changeStatus = (todo: Todo) => emit("change", todo)
  const removeItem = (todo: Todo) => emit("remove", todo)
  const addItem = () => emit("addItem", item.value)
  function uncheckedAll() {
    modelValue.value.map((todo) => (todo.status = false))
    emit("uncheckedAll")
  }
</script>

<template>
  <div class="card-body maxWidth">
    <h3 class="mb-3">
      TODO Liste: <small>{{ identifier }}</small>
    </h3>

    <ul>
      <li v-for="(todo, index) of modelValue" :key="index" :class="classes.li">
        <div class="d-flex align-items-center form-switch">
          <input class="form-check-input me-2 cursor-pointer" :id="`${index}`" type="checkbox" v-model="todo.status" @change="changeStatus(todo)" />
          <label :for="`${index}`" :class="{ 'cursor-pointer': true, 'text-decoration-line-through': todo.status }">{{ todo.label }}</label>
        </div>
        <button type="button" class="btn btn-outline-danger" data-mdb-toggle="tooltip" @click="removeItem(todo)" title="Supprimer cette TODO">X</button>
      </li>
    </ul>

    <div class="input-group mt-5">
      <input type="text" class="form-control" placeholder="Ajouter une TODO" v-model="item" />
      <button class="btn btn-primary" type="button" @click="addItem">Ajouter</button>
    </div>

    <div class="input-group mt-5">
      <button class="btn btn-warning" type="button" @click="uncheckedAll">Tout décocher</button>
    </div>
  </div>
</template>

<style scoped>
  .maxWidth {
    max-width: 800px !important;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
