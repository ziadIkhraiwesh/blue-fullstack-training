<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import PostCard from "./PostCard.vue";
import {
  RouterLink,
  useRoute,
  useRouter
} from "vue-router";
import { usePostsStore } from "../stores/posts";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

const {
  posts,
  isLoading,
  errorMessage
} = storeToRefs(postsStore);

const searchQuery = computed({
  get() {
    return typeof route.query.q === "string"
      ? route.query.q
      : "";
  },

  set(value) {
    const updatedQuery = { ...route.query };

    if (value) {
      updatedQuery.q = value;
    } else {
      delete updatedQuery.q;
    }

    router.replace({
      name: "posts",
      query: updatedQuery
    });
  }
});

const filteredPosts = computed(() => {
  const normalizedSearch =
    searchQuery.value.trim().toLowerCase();

  if (!normalizedSearch) {
    return posts.value;
  }

  return posts.value.filter((post) =>
    post.title.toLowerCase().includes(normalizedSearch)
  );
});

const resultMessage = computed(() => {
  const count = filteredPosts.value.length;
  const resultWord = count === 1 ? "result" : "results";

  return `${count} ${resultWord} displayed.`;
});

const clearSearch = () => {
  searchQuery.value = "";
};

onMounted(() => {
  if (posts.value.length === 0) {
    postsStore.loadPosts();
  }
});
</script>
<template>
  <section id="posts" class="section posts-section">
    <div class="container">
      <p class="eyebrow-text">Vue REST API Integration</p>
      <h2>Latest Posts</h2>

      <p class="section-description">
        These posts are loaded from JSONPlaceholder using the Vue lifecycle,
        reactive state, and computed search results.
      </p>

      <div v-if="isLoading" class="request-state" role="status">
        Loading latest posts...
      </div>

      <div v-else-if="errorMessage" class="request-state error-state" role="alert">
        <p>{{ errorMessage }}</p>

        <button class="button button-primary" type="button" @click="loadRequestedPost">
          Retry
        </button>
      </div>

      <div v-else-if="posts.length === 0" class="request-state" role="status">
        No posts are currently available.
      </div>

      <div v-else>
        <div class="posts-toolbar">
          <div class="search-field">
            <label for="post-search">Search posts by title</label>

            <input id="post-search" v-model="searchQuery" type="search" placeholder="Enter a post title"
              autocomplete="off">
          </div>

          <button class="button button-secondary" type="button" :disabled="searchQuery.length === 0"
            @click="clearSearch">
            Clear Search
          </button>
        </div>

        <p class="result-count" aria-live="polite">
          {{ resultMessage }}
        </p>

        <div v-if="filteredPosts.length === 0" class="request-state" role="status">
          No matching posts were found.
        </div>

        <div v-else class="posts-grid">
          <PostCard v-for="post in filteredPosts" :key="post.id" :post="post"
            :is-favorite="postsStore.isFavorite(post.id)" :from-search="searchQuery"
            @toggle-favorite="postsStore.toggleFavorite" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.posts-section {
  background-color: var(--color-background);
}

h2 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 4vw, 3rem);
}

.section-description {
  max-width: 750px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.posts-toolbar {
  display: flex;
  align-items: end;
  gap: 1rem;
  margin: 2rem 0 1rem;
}

.search-field {
  flex: 1;
}

.search-field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  font-weight: 800;
}

.search-field input {
  width: 100%;
  min-height: 48px;
  padding: 0.75rem;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.result-count {
  margin-bottom: 1.25rem;
  color: var(--color-text-muted);
  font-weight: 700;
}

.request-state {
  margin-top: 2rem;
  padding: 1.5rem;
  color: var(--color-primary);
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.error-state {
  color: #8a1c1c;
  background-color: #fff2f2;
  border-color: #e6a8a8;
}

.error-state p {
  margin-bottom: 1rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.post-card {
  height: 100%;
  padding: 1.5rem;
  overflow-wrap: anywhere;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.post-card span {
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

@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .posts-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .posts-toolbar .button {
    width: 100%;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>