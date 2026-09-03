<script setup>
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { usePagesStore } from "../stores/pages";

import HeroBlock from "../components/blocks/HeroBlock.vue";
import TextBlock from "../components/blocks/TextBlock.vue";
import FeaturesBlock from "../components/blocks/FeaturesBlock.vue";
import CallToActionBlock from "../components/blocks/CallToActionBlock.vue";
import UnsupportedBlock from "../components/blocks/UnsupportedBlock.vue";

const route = useRoute();
const pagesStore = usePagesStore();

const {
  publicPage,
  isPublicPageLoading,
  publicPageError,
  publicPageNotFound
} = storeToRefs(pagesStore);

const blockComponents = {
  hero: HeroBlock,
  text: TextBlock,
  features: FeaturesBlock,
  cta: CallToActionBlock
};

const orderedBlocks = computed(() => {
  return [
    ...(publicPage.value?.blocks || [])
  ].sort(
    (first, second) =>
      first.position - second.position ||
      first.id - second.id
  );
});

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
  <main class="dynamic-page-view">
    <section
      v-if="isPublicPageLoading"
      class="section"
    >
      <div
        class="container page-state"
        role="status"
      >
        Loading page content...
      </div>
    </section>

    <section
      v-else-if="publicPageNotFound"
      class="section"
    >
      <div
        class="container page-state error-state"
        role="alert"
      >
        <h1>Page Not Found</h1>
        <p>
          The requested page is unavailable or
          has not been published.
        </p>
      </div>
    </section>

    <section
      v-else-if="publicPageError"
      class="section"
    >
      <div
        class="container page-state error-state"
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
    </section>

    <template v-else-if="publicPage">
      <div class="page-admin-meta">
        <div class="container">
          <strong>{{ publicPage.title }}</strong>
          <span>
            Published by
            {{
              publicPage.author?.name ||
              "NexaTech"
            }}
          </span>
        </div>
      </div>

      <div
        v-if="orderedBlocks.length > 0"
        class="blocks-container"
      >
        <template
          v-for="block in orderedBlocks"
          :key="block.id"
        >
          <component
            :is="blockComponents[block.type]"
            v-if="blockComponents[block.type]"
            :data="block.data"
          />

          <UnsupportedBlock
            v-else
            :type="block.type"
          />
        </template>
      </div>

      <section v-else class="section">
        <article
          class="container fallback-content"
        >
          <p class="eyebrow-text">
            Dynamic CMS Content
          </p>

          <h1>{{ publicPage.title }}</h1>

          <div class="content-body">
            {{ publicPage.content }}
          </div>
        </article>
      </section>
    </template>
  </main>
</template>

<style scoped>
.dynamic-page-view {
  min-height: 70vh;
  background-color: var(--color-background);
}

.page-admin-meta {
  padding-block: 0.75rem;
  color: var(--color-text-muted);
  background-color: #eef6fa;
  border-bottom: 1px solid var(--color-border);
}

.page-admin-meta .container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.page-admin-meta strong {
  color: var(--color-primary);
}

.blocks-container {
  min-height: 50vh;
}

.page-state,
.fallback-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.page-state {
  color: var(--color-primary);
  text-align: center;
}

.page-state h1,
.fallback-content h1 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.error-state {
  color: #8a1c1c;
  background-color: #fff2f2;
  border-color: #e6a8a8;
}

.error-state p {
  margin-bottom: 1rem;
}

.content-body {
  color: var(--color-text);
  line-height: 1.8;
  white-space: pre-wrap;
}

@media (max-width: 600px) {
  .page-admin-meta .container {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>