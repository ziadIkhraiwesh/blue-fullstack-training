<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import {
  useRoute,
  useRouter
} from "vue-router";
import { usePostsStore } from "../stores/posts";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

const {
  currentPost: post,
  isPostLoading: isLoading,
  postErrorMessage: errorMessage
} = storeToRefs(postsStore);

const isNotFound = computed(() =>
  errorMessage.value
    .toLowerCase()
    .includes("could not be found")
);

const loadRequestedPost = () => {
  postsStore.loadPostById(route.params.id);
};

const goBackToPosts = () => {
  const previousSearch =
    typeof route.query.from === "string"
      ? route.query.from
      : "";

  router.push({
    name: "posts",
    query: previousSearch
      ? { q: previousSearch }
      : {}
  });
};

watch(
  () => route.params.id,
  loadRequestedPost,
  { immediate: true }
);
</script>

<template>
  <section class="section post-details-view">
    <div class="container">
      <button class="back-button" type="button" @click="goBackToPosts">
        ← Back to Posts
      </button>

      <div v-if="isLoading" class="request-state" role="status">
        Loading post details...
      </div>

      <div v-else-if="errorMessage" class="request-state error-state" role="alert">
        <p>{{ errorMessage }}</p>

        <button class="button button-primary" type="button" @click="retryPost">
          Retry
        </button>
      </div>

      <div v-else-if="isNotFound" class="request-state" role="status">
        <p>The requested post could not be found.</p>


        <button class="button button-primary" type="button" @click="goBackToPosts">
          Browse Posts
        </button>
      </div>

      <article v-else-if="post" class="post-details-card">
        <p class="eyebrow-text">Dynamic Post Route</p>
        <span class="post-id">Post ID: {{ post.id }}</span>

        <h1>{{ post.title }}</h1>
        <p class="post-body">{{ post.body }}</p>
        <button v-if="post" class="favorite-button" type="button"
          :class="{ 'is-favorite': postsStore.isFavorite(post.id) }" :aria-pressed="postsStore.isFavorite(post.id)"
          @click="postsStore.toggleFavorite(post.id)">
          {{
            postsStore.isFavorite(post.id)
              ? "★ Remove Favorite"
              : "☆ Add Favorite"
          }}
        </button>
      </article>
    </div>
  </section>
</template>

<style scoped>
.post-details-view {
  min-height: calc(100vh - 72px);
}

.back-button {
  min-height: 44px;
  margin-bottom: 2rem;
  padding: 0.65rem 1rem;
  color: var(--color-primary);
  font-weight: 800;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
  cursor: pointer;
}

.back-button:hover {
  border-color: var(--color-secondary);
}

.request-state {
  padding: 2rem;
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

.error-state p,
.request-state p {
  margin-bottom: 1rem;
}

.post-details-card {
  max-width: 850px;
  padding: clamp(1.5rem, 5vw, 3.5rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  box-shadow: var(--shadow-md);
}

.post-id {
  display: inline-block;
  margin-bottom: 1.25rem;
  padding: 0.4rem 0.75rem;
  color: var(--color-secondary-dark);
  font-weight: 900;
  background-color: #e5f3f9;
  border-radius: 0.4rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
}

.post-body {
  color: var(--color-text-muted);
  font-size: 1.1rem;
  line-height: 1.9;
}

.favorite-button {
  min-height: 44px;
  margin-top: 1rem;
  padding: 0.7rem 1rem;
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
</style>