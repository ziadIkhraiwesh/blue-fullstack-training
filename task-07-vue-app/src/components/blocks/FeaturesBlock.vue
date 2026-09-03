<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <section class="content-block features-block">
    <div class="container">
      <h2>{{ data.heading }}</h2>

      <div
        v-if="data.items?.length"
        class="features-grid"
      >
        <article
          v-for="(item, index) in data.items"
          :key="`${item.title}-${index}`"
          class="feature-card"
        >
          <span class="feature-number">
            {{ index + 1 }}
          </span>

          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </article>
      </div>

      <p v-else class="empty-features">
        No features are currently available.
      </p>
    </div>
  </section>
</template>

<style scoped>
.features-block {
  padding-block: 4rem;
  background-color: var(--color-background);
}

h2 {
  margin-bottom: 2rem;
  color: var(--color-primary);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.feature-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: 900;
  background-color: var(--color-secondary);
  border-radius: 50%;
}

h3 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
}

p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.empty-features {
  text-align: center;
}

@media (max-width: 800px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>