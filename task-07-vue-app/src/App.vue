<script setup>
import { onBeforeUnmount } from "vue";
import {
  RouterView,
  useRouter
} from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import { usePostsStore } from "./stores/posts";
import { useAuthStore } from "./stores/auth";
import {
  AUTH_UNAUTHORIZED_EVENT
} from "./services/apiClient";

const router = useRouter();
const postsStore = usePostsStore();
const authStore = useAuthStore();

const handleUnauthorized = async (event) => {
  const currentRoute = router.currentRoute.value;

  authStore.clearAuthentication();
  authStore.errorMessage =
    event.detail?.message ||
    "Your session has expired. Please log in again.";

  if (currentRoute.name !== "login") {
    await router.push({
      name: "login",
      query: {
        redirect: currentRoute.fullPath,
        reason: "expired"
      }
    });
  }
};

window.addEventListener(
  AUTH_UNAUTHORIZED_EVENT,
  handleUnauthorized
);

onBeforeUnmount(() => {
  window.removeEventListener(
    AUTH_UNAUTHORIZED_EVENT,
    handleUnauthorized
  );
});

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