<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { usePostsStore } from "../stores/posts";

const postsStore = usePostsStore();

const {
  favoritePosts,
  isLoading,
  errorMessage
} = storeToRefs(postsStore);

onMounted(() => {
  postsStore.loadFavoritePosts();
});
</script>

<template>
  <section class="section favorites-section">
    <div class="container">
      <p class="eyebrow-text">Saved Posts</p>
      <h1>Favorite Posts</h1>

      <p class="section-description">
        Your favorite posts are saved in this browser and remain
        available after refreshing the page.
      </p>

      <div
        v-if="isLoading"
        class="request-state"
        role="status"
      >
        Loading favorite posts...
      </div>

      <div
        v-else-if="errorMessage"
        class="request-state error-state"
        role="alert"
      >
        <p>{{ errorMessage }}</p>

        <button
          class="button button-primary"
          type="button"
          @click="postsStore.loadFavoritePosts"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="favoritePosts.length === 0"
        class="request-state"
      >
        <p>You have not selected any favorite posts yet.</p>

        <RouterLink
          class="button button-primary"
          to="/posts"
        >
          Browse Posts
        </RouterLink>
      </div>

      <div v-else class="favorites-grid">
        <article
          v-for="post in favoritePosts"
          :key="post.id"
          class="favorite-card"
        >
          <span>Post {{ post.id }}</span>
          <h2>{{ post.title }}</h2>
          <p>{{ post.body }}</p>

          <div class="card-actions">
            <RouterLink
              class="button button-primary"
              :to="{
                name: 'post-details',
                params: { id: post.id }
              }"
            >
              View Details
            </RouterLink>

            <button
              class="button remove-button"
              type="button"
              @click="postsStore.toggleFavorite(post.id)"
            >
              Remove Favorite
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.favorites-section {
  min-height: calc(100vh - 90px);
  background-color: var(--color-background);
}

h1 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.section-description {
  max-width: 720px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.request-state {
  margin-top: 2rem;
  padding: 2rem;
  color: var(--color-primary);
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.request-state p {
  margin-bottom: 1rem;
}

.error-state {
  color: #8a1c1c;
  background-color: #fff2f2;
  border-color: #e6a8a8;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.favorite-card {
  padding: 1.5rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.favorite-card span {
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--color-secondary-dark);
  font-weight: 900;
}

.favorite-card h2 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: 1.25rem;
}

.favorite-card p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.remove-button {
  color: #8a1c1c;
  background-color: #fff2f2;
  border: 1px solid #d99b9b;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .card-actions .button {
    width: 100%;
  }
}
</style>