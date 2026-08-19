<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <section id="home" class="hero-section">
    <div class="container hero-layout">
      <div>
        <p class="eyebrow-text">Vue-Powered Digital Experiences</p>

        <h1>Building Modern Solutions with Vue.js</h1>

        <p class="hero-description">
          Explore reusable components, reactive project filtering, custom
          events, and live REST API content built with Vue 3.
        </p>

        <div class="hero-actions">
          <RouterLink class="button button-primary" to="/projects">
            Explore Projects
          </RouterLink>

          <RouterLink class="button button-secondary" to="/posts">
            View Latest Posts
          </RouterLink>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="vue-symbol">V</div>
        <strong>Vue 3 + Vite</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 6rem 0;
  background:
    radial-gradient(circle at 80% 30%, rgba(85, 194, 232, 0.24), transparent 25%),
    #eef8fc;
}

.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
  align-items: center;
  gap: 4rem;
}

h1 {
  max-width: 750px;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-size: clamp(2.5rem, 6vw, 4.75rem);
  line-height: 1.05;
}

.hero-description {
  max-width: 680px;
  color: var(--color-text-muted);
  font-size: 1.1rem;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.hero-visual {
  display: grid;
  min-height: 300px;
  place-content: center;
  gap: 1rem;
  color: var(--color-primary);
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--color-border);
  border-radius: 2rem;
  box-shadow: var(--shadow-md);
}

.vue-symbol {
  display: grid;
  width: 110px;
  height: 110px;
  margin-inline: auto;
  place-content: center;
  color: #ffffff;
  font-size: 3rem;
  font-weight: 900;
  background-color: var(--color-secondary);
  border-radius: 1.5rem;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 0;
  }

  .hero-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .button {
    width: 100%;
  }

  .hero-visual {
    min-height: 240px;
  }
}
</style>