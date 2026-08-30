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
    <div class="post-meta">
      <span class="post-id">
        Post {{ post.id }}
      </span>

      <span
        class="post-status"
        :class="`status-${post.status}`"
      >
        {{ post.status }}
      </span>
    </div>

    <button
      class="favorite-button"
      type="button"
      :class="{ 'is-favorite': isFavorite }"
      :aria-pressed="isFavorite"
      @click="$emit('toggle-favorite', post.id)"
    >
      {{
        isFavorite
          ? "Remove Favorite"
          : "Add Favorite"
      }}
    </button>

    <h3>{{ post.title }}</h3>

    <p class="post-body">
      {{ post.body }}
    </p>

    <dl class="post-details">
      <div>
        <dt>Category</dt>
        <dd>{{ post.category?.name || "Uncategorized" }}</dd>
      </div>

      <div>
        <dt>Author</dt>
        <dd>{{ post.author?.name || "Unknown" }}</dd>
      </div>
    </dl>

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
      View Details
    </RouterLink>
  </article>
</template>

<style scoped>
.post-card {
  display: flex;
  height: 100%;
  padding: 1.5rem;
  overflow-wrap: anywhere;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.post-id,
.post-status {
  display: inline-block;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 900;
  border-radius: 999px;
}

.post-id {
  color: var(--color-secondary-dark);
  background-color: #e5f3f9;
}

.post-status {
  text-transform: capitalize;
}

.status-published {
  color: #155724;
  background-color: #dff3e4;
}

.status-draft {
  color: #704d00;
  background-color: #fff4c2;
}

.post-card h3 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: 1.15rem;
}

.post-body {
  display: -webkit-box;
  margin-bottom: 1rem;
  overflow: hidden;
  color: var(--color-text-muted);
  line-height: 1.7;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.post-details {
  display: grid;
  margin-top: auto;
  padding-top: 1rem;
  gap: 0.5rem;
  border-top: 1px solid var(--color-border);
}

.post-details div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.post-details dt {
  color: var(--color-primary);
  font-weight: 800;
}

.post-details dd {
  color: var(--color-text-muted);
}

.favorite-button {
  align-self: flex-start;
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