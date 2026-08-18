<script setup>
defineProps({
  project: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["view-details"]);
</script>

<template>
  <article class="project-card">
    <span class="category">{{ project.categoryLabel }}</span>

    <h3>{{ project.title }}</h3>

    <p>{{ project.description }}</p>

    <div class="project-details">
      <span>{{ project.technology }}</span>
      <span>{{ project.year }}</span>
    </div>

    <button
      class="details-button"
      type="button"
      @click="emit('view-details', project)"
    >
      View Details
    </button>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.category {
  align-self: flex-start;
  margin-bottom: 1rem;
  padding: 0.35rem 0.7rem;
  color: var(--color-secondary-dark);
  font-size: 0.8rem;
  font-weight: 900;
  background-color: #e5f3f9;
  border-radius: 0.375rem;
}

h3 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: 1.2rem;
}

p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.project-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1.25rem;
}

.project-details span {
  padding: 0.3rem 0.6rem;
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 700;
  background-color: var(--color-background);
  border-radius: 0.375rem;
}

.details-button {
  min-height: 44px;
  margin-top: 1rem;
  padding: 0.65rem 1rem;
  color: #ffffff;
  font-weight: 800;
  background-color: var(--color-secondary);
  border: 0;
  border-radius: 0.4rem;
  cursor: pointer;
}

.details-button:hover {
  background-color: var(--color-secondary-dark);
}
</style>
