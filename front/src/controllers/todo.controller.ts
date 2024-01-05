import type { Todo } from "@/types/Todo"

export const todoController = {
  async getTodos() {
    type Response = { success: boolean; todo: Todo[] }

    const { data } = await api.get<Response>("/api/todo")
    return data
  },
  async addTodo(label: string) {
    type Response = { success: boolean; todo: Todo[] }

    const { data } = await api.post<Response>("/api/todo", { label })
    return data
  },
  async changeAllTodos(status: boolean) {
    type Response = { success: boolean; todo: Todo[] }

    const { data } = await api.put<Response>("/api/todo", { status })
    return data
  },
  async changeTodo(todoId: string, status: boolean) {
    type Response = { success: boolean; todo: Todo[] }

    const { data } = await api.put<Response>(`/api/todo/${todoId}`, { status })
    return data
  },
  async removeTodo(todoId: string) {
    type Response = { success: boolean; todo: Todo[] }

    const { data } = await api.delete<Response>(`/api/todo/${todoId}`)
    return data
  },
}
