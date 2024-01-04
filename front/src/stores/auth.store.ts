import { defineStore } from "pinia"
import { globalRouter } from "@/router/globalRouter"
import type { UserEntity, UserEntityResponse } from "@/types/UserEntity"

export const UseAuthStore = defineStore("UseAuthStore", () => {
  let intervalState: number | undefined //: NodeJS.Timeout

  const currentUser = reactive<UserEntity>({ loggedIn: false, identifier: "" })

  function auth() {
    console.log("Auth...")
    loadData().then(() => {
      globalRouter.router?.push({ name: "Todos" })
    })
  }

  function logout() {
    api.delete("/api/auth/signout").then(() => reset())
  }

  function reset() {
    localStorage.removeItem("accessToken")
    Object.assign(currentUser, { loggedIn: false, identifier: "" })
    globalRouter.router?.push({ name: "SignIn" })
  }

  async function loadData() {
    if (!localStorage.getItem("accessToken")) return currentUser

    return api
      .get<UserEntityResponse>("/api/auth/me")
      .then(({ data }) => {
        if (data.success) {
          currentUser.loggedIn = true
          Object.assign(currentUser, data.user)
        } else {
          localStorage.removeItem("accessToken")
          currentUser.loggedIn = false
        }

        return currentUser
      })
      .catch(() => {
        localStorage.removeItem("accessToken")
        currentUser.loggedIn = false

        return currentUser
      })
  }

  onMounted(() => {
    clearInterval(intervalState)
    intervalState = setInterval(() => {
      if (!localStorage.getItem("accessToken")) return
      if (currentUser.loggedIn) loadData()
    }, 10000)
  })

  return { currentUser, auth, logout, reset, loadData }
})
