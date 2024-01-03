import { defineStore } from "pinia"
import { globalRouter } from "@/router/globalRouter"
// import { AppUserEntity } from "@/types/entities/user"

export const UseAuthStore = defineStore("UseAuthStore", () => {
  let intervalState: NodeJS.Timeout

  const currentUser = reactive({ loggedIn: false })

  function auth() {
    console.log("Auth...")
    loadData().then(() => {
      const lastFullPath = localStorage.getItem("lastFullPath")
      globalRouter.router?.push(lastFullPath ? lastFullPath : { name: "PanelRidingCenters" })
    })
  }

  function logout() {
    api.delete("/api/auth/signout").then(() => reset())
  }

  function reset() {
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("accessToken")

    // Object.assign(currentUser, userDefaultSchema())

    globalRouter.router?.push({ name: "SignIn" })
  }

  async function loadData() {
    if (!localStorage.getItem("accessToken")) return

    const { data } = await api.get("/api/account/me")

    if (data) {
      currentUser.loggedIn = true
      Object.assign(currentUser, data)
    } else {
      localStorage.removeItem("accessToken")
      currentUser.loggedIn = false
    }
  }

  onMounted(() => {
    clearInterval(intervalState)
    intervalState = setInterval(() => {
      if (!localStorage.getItem("accessToken")) return
      if (currentUser.loggedIn) api.get("/api/account/me")
      //   .then(({ data }) => {
      //   if (data) {
      //     currentUser.loggedIn = true
      //     Object.assign(currentUser, data)
      //     currentUser.avatar = { type: "image", value: "https://cdn.vuetifyjs.com/images/profiles/marcus.jpg" } //TODO to implement later
      //   }
      // })
    }, 10000)
  })

  return { currentUser, auth, logout, reset, loadData }
})
