<script lang="ts" setup>
  async function submitForm() {
    await api.post("/api/auth/sign-up", {})
  }
</script>

<template>
  <div class="container-fluid row">
    <div class="col-0 col-lg-3"></div>
    <div class="col-12 col-lg-6 maxWidth mx-auto">
      <form @submit.prevent="submitForm">
        <h1 class="my-5">Création de compte</h1>
        <div class="mb-3">
          <label for="inputemail" class="form-label">Email address</label>
          <input type="email" class="form-control" id="inputemail" aria-describedby="emailHelp" />
          <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
          <label for="inputpassword" class="form-label">Password</label>
          <input type="password" class="form-control" id="inputpassword" />
        </div>

        <button type="submit" class="btn btn-primary mt-3">Création</button>
      </form>
    </div>
    <div class="col-0 col-lg-3"></div>
  </div>
</template>

<style scoped>
  .maxWidth {
    max-width: 500px;
  }
</style>
