<script setup>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const form = reactive({
  email: "",
  password: ""
});

const handleSubmit = async () => {
  const wasSuccessful = await authStore.login({
    email: form.email,
    password: form.password
  });

  if (wasSuccessful) {
    const redirectPath =
      typeof route.query.redirect === "string"
        ? route.query.redirect
        : "/posts";

    await router.push(redirectPath);
  }
};
</script>

<template>
  <section class="login-page">
    <div class="container">
      <div class="login-card">
        <div>
          <p class="eyebrow">Full-Stack Access</p>
          <h1>Log in to NexaTech</h1>
          <p class="login-description">
            Sign in through the Laravel API to create, update,
            and delete your posts.
          </p>
        </div>

        <form class="login-form" @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model.trim="form.email"
              type="email"
              autocomplete="email"
              required
            >

            <p
              v-if="authStore.validationErrors.email"
              class="field-error"
            >
              {{ authStore.validationErrors.email[0] }}
            </p>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
            >

            <p
              v-if="authStore.validationErrors.password"
              class="field-error"
            >
              {{ authStore.validationErrors.password[0] }}
            </p>
          </div>

          <p
            v-if="authStore.errorMessage"
            class="form-error"
            role="alert"
          >
            {{ authStore.errorMessage }}
          </p>

          <button
            class="login-button"
            type="submit"
            :disabled="authStore.isLoading"
          >
            {{
              authStore.isLoading
                ? "Logging in..."
                : "Log In"
            }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 72px);
  padding: 5rem 0;
  background:
    linear-gradient(
      135deg,
      rgba(11, 42, 67, 0.08),
      rgba(238, 111, 87, 0.12)
    );
}

.login-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem;
  gap: 3rem;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  box-shadow: var(--shadow-sm);
}

.eyebrow {
  margin-bottom: 0.5rem;
  color: var(--color-secondary-dark);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.login-card h1 {
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.login-description {
  color: #526170;
  line-height: 1.7;
}

.login-form {
  display: grid;
  gap: 1.25rem;
}

.form-group {
  display: grid;
  gap: 0.45rem;
}

.form-group label {
  color: var(--color-primary);
  font-weight: 800;
}

.form-group input {
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font: inherit;
}

.form-group input:focus {
  border-color: var(--color-secondary);
  outline: 3px solid rgba(238, 111, 87, 0.18);
}

.field-error,
.form-error {
  margin: 0;
  color: #b42318;
  font-size: 0.9rem;
}

.form-error {
  padding: 0.75rem;
  background-color: #fff1f0;
  border-radius: 0.5rem;
}

.login-button {
  padding: 0.85rem 1rem;
  color: #ffffff;
  font: inherit;
  font-weight: 800;
  background-color: var(--color-primary);
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
}

.login-button:disabled {
  cursor: wait;
  opacity: 0.65;
}

@media (max-width: 700px) {
  .login-card {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 2rem;
  }
}
</style>