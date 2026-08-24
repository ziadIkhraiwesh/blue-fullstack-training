<script setup>
import { RouterLink } from "vue-router";

defineProps({
  post: {
    type: Object,
    required: true
  },

  isFavorite: {
    type: Boolean,
    default: false
  },

  fromSearch: {
    type: String,
    default: ""
  }
});

defineEmits(["toggle-favorite"]);
</script>

<template>
  <article class="post-card">
    <span>Post {{ post.id }}</span>

    <button
      class="favorite-button"
      type="button"
      :class="{ 'is-favorite': isFavorite }"
      :aria-pressed="isFavorite"
      @click="$emit('toggle-favorite', post.id)"
    >
      {{
        isFavorite
          ? "★ Remove Favorite"
          : "☆ Add Favorite"
      }}
    </button>

    <h3>{{ post.title }}</h3>
    <p>{{ post.body }}</p>

    <RouterLink
      class="read-more"
      :to="{
        name: 'post-details',
        params: { id: post.id },
        query: fromSearch
          ? { from: fromSearch }
          : {}
      }"
    >
      Read More
    </RouterLink>
  </article>
</template>

<style scoped>
.post-card {
  height: 100%;
  padding: 1.5rem;
  overflow-wrap: anywhere;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.post-card > span {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.35rem 0.7rem;
  color: var(--color-secondary-dark);
  font-size: 0.8rem;
  font-weight: 900;
  background-color: #e5f3f9;
  border-radius: 0.375rem;
}

.post-card h3 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: 1.15rem;
}

.post-card p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.favorite-button {
  display: block;
  min-height: 44px;
  margin-bottom: 1rem;
  padding: 0.6rem 0.85rem;
  color: var(--color-primary);
  font-weight: 800;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.favorite-button:hover,
.favorite-button.is-favorite {
  color: #704d00;
  background-color: #fff4c2;
  border-color: #d6a800;
}

.favorite-button:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.read-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  margin-top: 1.25rem;
  padding: 0.65rem 1rem;
  color: #ffffff;
  font-weight: 800;
  text-decoration: none;
  background-color: var(--color-secondary);
  border-radius: 0.4rem;
}

.read-more:hover {
  background-color: var(--color-secondary-dark);
}
</style>