<script setup>
import { RouterView } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import { usePostsStore } from "./stores/posts";
import { useAuthStore } from "./stores/auth";

const postsStore = usePostsStore();
const authStore = useAuthStore();

postsStore.restoreFavorites();
authStore.restoreAuthentication();
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>

  <SiteHeader />

  <main id="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: 0;
  left: 1rem;
  z-index: 200;
  padding: 0.75rem 1rem;
  color: #ffffff;
  background-color: #0b2a43;
  border-radius: 0 0 0.4rem 0.4rem;
  transform: translateY(-120%);
}

.skip-link:focus {
  transform: translateY(0);
}
</style>