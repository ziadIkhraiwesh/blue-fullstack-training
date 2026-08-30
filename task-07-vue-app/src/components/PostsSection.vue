<script setup>
import {
  onMounted,
  reactive,
  watch
} from "vue";
import { storeToRefs } from "pinia";
import {
  useRoute,
  useRouter
} from "vue-router";
import PostCard from "./PostCard.vue";
import { usePostsStore } from "../stores/posts";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();

const {
  posts,
  isLoading,
  errorMessage,
  categories,
  isCategoriesLoading,
  pagination,
  operationMessage
} = storeToRefs(postsStore);

const filterForm = reactive({
  search: "",
  status: "",
  category_id: ""
});

const syncFormFromRoute = () => {
  filterForm.search =
    typeof route.query.search === "string"
      ? route.query.search
      : "";

  filterForm.status =
    typeof route.query.status === "string"
      ? route.query.status
      : "";

  filterForm.category_id =
    typeof route.query.category_id === "string"
      ? route.query.category_id
      : "";
};

const loadPostsFromRoute = async () => {
  syncFormFromRoute();

  await postsStore.loadPosts({
    page: Number(route.query.page) || 1,
    search: filterForm.search,
    status: filterForm.status,
    category_id: filterForm.category_id
  });
};

const applyFilters = async () => {
  const query = {};

  if (filterForm.search.trim()) {
    query.search = filterForm.search.trim();
  }

  if (filterForm.status) {
    query.status = filterForm.status;
  }

  if (filterForm.category_id) {
    query.category_id = filterForm.category_id;
  }

  await router.replace({
    name: "posts",
    query
  });
};

const clearFilters = async () => {
  filterForm.search = "";
  filterForm.status = "";
  filterForm.category_id = "";

  await router.replace({
    name: "posts"
  });
};

const changePage = async (page) => {
  if (
    page < 1 ||
    page > pagination.value.lastPage ||
    page === pagination.value.currentPage
  ) {
    return;
  }

  await router.replace({
    name: "posts",
    query: {
      ...route.query,
      page
    }
  });
};

watch(
  () => route.query,
  loadPostsFromRoute,
  {
    immediate: true,
    deep: true
  }
);

onMounted(() => {
  postsStore.loadCategories();
});
</script>

<template>
  <section id="posts" class="section posts-section">
    <div class="container">
      <p class="eyebrow-text">
        Vue + Laravel Full-Stack Integration
      </p>

      <h2>Latest Posts</h2>

      <p class="section-description">
        These posts, categories, filters, and pagination are
        loaded directly from the Laravel REST API and MySQL.
      </p>

      <p v-if="operationMessage" class="operation-success" role="status">
        {{ operationMessage }}
      </p>

      <form class="posts-toolbar" @submit.prevent="applyFilters">
        <div class="filter-field search-field">
          <label for="post-search">
            Search by title
          </label>

          <input id="post-search" v-model="filterForm.search" type="search" placeholder="Enter a post title"
            autocomplete="off">
        </div>

        <div class="filter-field">
          <label for="status-filter">
            Status
          </label>

          <select id="status-filter" v-model="filterForm.status">
            <option value="">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div class="filter-field">
          <label for="category-filter">
            Category
          </label>

          <select id="category-filter" v-model="filterForm.category_id" :disabled="isCategoriesLoading">
            <option value="">
              {{
                isCategoriesLoading
                  ? "Loading categories..."
                  : "All categories"
              }}
            </option>

            <option v-for="category in categories" :key="category.id" :value="String(category.id)">
              {{ category.name }}
            </option>
          </select>
        </div>

        <button class="button button-primary" type="submit">
          Apply
        </button>

        <button class="button button-secondary" type="button" @click="clearFilters">
          Clear
        </button>
      </form>

      <div v-if="isLoading" class="request-state" role="status">
        Loading posts from Laravel...
      </div>

      <div v-else-if="errorMessage" class="request-state error-state" role="alert">
        <p>{{ errorMessage }}</p>

        <button class="button button-primary" type="button" @click="postsStore.retryLoadPosts">
          Retry
        </button>
      </div>

      <div v-else-if="posts.length === 0" class="request-state" role="status">
        No matching posts were found.
      </div>

      <div v-else>
        <p class="result-count" aria-live="polite">
          {{ pagination.total }} total posts -
          Page {{ pagination.currentPage }}
          of {{ pagination.lastPage }}
        </p>

        <div class="posts-grid">
          <PostCard v-for="post in posts" :key="post.id" :post="post" :is-favorite="postsStore.isFavorite(post.id)
            " :from-search="filterForm.search" @toggle-favorite="
              postsStore.toggleFavorite
            " />
        </div>

        <nav v-if="pagination.lastPage > 1" class="pagination" aria-label="Posts pagination">
          <button class="button button-secondary" type="button" :disabled="pagination.currentPage === 1" @click="
            changePage(pagination.currentPage - 1)
            ">
            Previous
          </button>

          <span>
            Page {{ pagination.currentPage }}
            of {{ pagination.lastPage }}
          </span>

          <button class="button button-secondary" type="button" :disabled="pagination.currentPage ===
            pagination.lastPage
            " @click="
              changePage(pagination.currentPage + 1)
              ">
            Next
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
  display: grid;
  grid-template-columns:
    minmax(220px, 2fr) minmax(150px, 1fr) minmax(170px, 1fr) auto auto;
  align-items: end;
  gap: 1rem;
  margin: 2rem 0;
}

.filter-field {
  display: grid;
  gap: 0.5rem;
}

.filter-field label {
  color: var(--color-primary);
  font-weight: 800;
}

.filter-field input,
.filter-field select {
  width: 100%;
  min-height: 48px;
  padding: 0.75rem;
  color: var(--color-text);
  font: inherit;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
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
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 1.5rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
}

.pagination span {
  color: var(--color-primary);
  font-weight: 800;
}

button:disabled,
select:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.operation-success {
  margin-top: 1.5rem;
  padding: 1rem;
  color: #155724;
  font-weight: 700;
  background-color: #effbf2;
  border: 1px solid #8bd19c;
  border-radius: 0.5rem;
}

@media (max-width: 1100px) {
  .posts-toolbar {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .posts-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {

  .posts-toolbar,
  .posts-grid {
    grid-template-columns: 1fr;
  }

  .posts-toolbar .button {
    width: 100%;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
</style>