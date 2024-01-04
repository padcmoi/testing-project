<script lang="ts" setup>
  const { auth } = UseAuthStore()

  const form = reactive<{ identifier: string; password: string }>({ identifier: "", password: "" })

  function submitForm() {
    api
      .post("/api/auth/sign-in", form)
      .then(({ data }) => {
        if (data.success) auth()
      })
      .catch(({ data }) => console.error(data))
  }
</script>

<template>
  <div class="container-fluid row align-items-center">
    <div class="col-0 col-lg-3"></div>
    <div class="col-12 col-lg-6 maxWidth mx-auto">
      <div>
        <h1 class="my-5">Identification</h1>

        <div class="mb-3">
          <label for="inputidentifier" class="form-label">Identifiant</label>
          <input v-model="form.identifier" type="text" class="form-control" id="inputidentifier" />
        </div>
        <div class="mb-3">
          <label for="inputpassword" class="form-label">Mot de passe</label>
          <input v-model="form.password" type="password" class="form-control" id="inputpassword" />
        </div>

        <button type="submit" class="btn btn-primary mt-3" @click="submitForm">Connexion</button>
      </div>
    </div>
    <div class="col-0 col-lg-3"></div>
  </div>
</template>

<style scoped>
  .maxWidth {
    max-width: 500px;
  }
</style>
