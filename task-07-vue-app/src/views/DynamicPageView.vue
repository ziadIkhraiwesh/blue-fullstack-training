<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { usePagesStore } from "../stores/pages";

const route = useRoute();
const pagesStore = usePagesStore();

const {
  publicPage,
  isPublicPageLoading,
  publicPageError,
  publicPageNotFound
} = storeToRefs(pagesStore);

const loadRequestedPage = () => {
  pagesStore.loadPublicPage(
    String(route.params.slug || "")
  );
};

watch(
  () => route.params.slug,
  loadRequestedPage,
  {
    immediate: true
  }
);
</script>

<template>
  <section class="section dynamic-page-view">
    <div class="container">
      <div
        v-if="isPublicPageLoading"
        class="page-state"
        role="status"
      >
        Loading page content...
      </div>

      <div
        v-else-if="publicPageNotFound"
        class="page-state error-state"
        role="alert"
      >
        <h1>Page Not Found</h1>
        <p>
          The requested page is unavailable or
          has not been published.
        </p>
      </div>

      <div
        v-else-if="publicPageError"
        class="page-state error-state"
        role="alert"
      >
        <h1>Unable to Load Page</h1>
        <p>{{ publicPageError }}</p>

        <button
          class="button button-primary"
          type="button"
          @click="loadRequestedPage"
        >
          Retry
        </button>
      </div>

      <article
        v-else-if="publicPage"
        class="page-content"
      >
        <p class="eyebrow-text">
          Dynamic CMS Content
        </p>

        <h1>{{ publicPage.title }}</h1>

        <p class="page-meta">
          Published by
          {{ publicPage.author?.name || "NexaTech" }}
        </p>

        <div class="content-body">
          {{ publicPage.content }}
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.dynamic-page-view {
  min-height: 70vh;
  background-color: var(--color-background);
}

.page-content,
.page-state {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

h1 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.page-meta {
  margin-bottom: 2rem;
  color: var(--color-text-muted);
  font-weight: 700;
}

.content-body {
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
}

.page-state {
  color: var(--color-primary);
  text-align: center;
}

.error-state {
  color: #8a1c1c;
  background-color: #fff2f2;
  border-color: #e6a8a8;
}

.error-state p {
  margin-bottom: 1rem;
}
</style>