<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["filter-change"]);
</script>

<template>
  <div class="project-filters" aria-label="Filter projects by category">
    <button
      v-for="category in categories"
      :key="category.value"
      class="filter-button"
      :class="{ 'is-active': selectedCategory === category.value }"
      type="button"
      :aria-pressed="selectedCategory === category.value"
      @click="emit('filter-change', category.value)"
    >
      {{ category.label }}
    </button>
  </div>
</template>

<style scoped>
.project-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 2rem 0;
}

.filter-button {
  min-height: 44px;
  padding: 0.65rem 1.15rem;
  color: var(--color-primary);
  font-weight: 800;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
}

.filter-button:hover {
  border-color: var(--color-secondary);
}

.filter-button.is-active {
  color: #ffffff;
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
}

@media (max-width: 480px) {
  .project-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-button {
    width: 100%;
  }
}
</style>