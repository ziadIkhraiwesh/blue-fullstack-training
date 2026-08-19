<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section class="section not-found-view">
    <div class="container">
      <p class="error-code">404</p>
      <h1>Page Not Found</h1>

      <p>
        The page you requested does not exist or may have been moved.
      </p>

      <RouterLink class="button button-primary" to="/">
        Return Home
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found-view {
  display: grid;
  min-height: calc(100vh - 72px);
  place-content: center;
  text-align: center;
}

.error-code {
  color: var(--color-secondary);
  font-size: clamp(5rem, 15vw, 10rem);
  font-weight: 900;
  line-height: 1;
}

h1 {
  margin: 1rem 0;
  color: var(--color-primary);
}

.not-found-view .container > p:not(.error-code) {
  margin-bottom: 2rem;
  color: var(--color-text-muted);
}
</style>