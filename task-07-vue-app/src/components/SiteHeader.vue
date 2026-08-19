<script setup>
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
</script>
<template>
  <header class="site-header">
    <div class="container header-content">
      <RouterLink class="logo" to="/" exact-active-class="is-logo-active">
        NexaTech<span>.</span>
      </RouterLink>

      <nav aria-label="Main navigation">
        <ul class="navigation-list">
          <li>
            <RouterLink to="/" exact-active-class="is-active">
              Home
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/projects" active-class="is-active">
              Projects
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/posts" active-class="is-active" :class="{ 'is-active': route.path.startsWith('/posts') }">
              Posts
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/contact" active-class="is-active">
              Contact
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  gap: 1.5rem;
}

.logo {
  color: var(--color-primary);
  font-size: 1.35rem;
  font-weight: 900;
  text-decoration: none;
}

.logo span {
  color: var(--color-secondary);
}

.navigation-list {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}

.navigation-list a {
  position: relative;
  padding: 0.5rem 0;
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: none;
}

.navigation-list a::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  content: "";
  background-color: var(--color-secondary);
  border-radius: 999px;
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.navigation-list a:hover,
.navigation-list a.is-active {
  color: var(--color-secondary-dark);
}

.navigation-list a.is-active::after {
  transform: scaleX(1);
}

@media (max-width: 600px) {
  .header-content {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
    padding-block: 1rem;
  }

  .navigation-list {
    flex-wrap: wrap;
    gap: 1rem;
  }
}
</style>