<script setup>
import {
  computed,
  onMounted,
  reactive
} from "vue";
import { storeToRefs } from "pinia";
import {
  RouterLink,
  useRoute,
  useRouter
} from "vue-router";
import { usePagesStore } from "../stores/pages";

const route = useRoute();
const router = useRouter();
const pagesStore = usePagesStore();

const {
  isEditingPageLoading,
  isSaving,
  saveError,
  validationErrors
} = storeToRefs(pagesStore);

const pageId = computed(() => {
  const numericId = Number(route.params.id);

  return Number.isInteger(numericId) &&
    numericId > 0
    ? numericId
    : null;
});

const isEditing = computed(
  () => pageId.value !== null
);

const form = reactive({
  title: "",
  slug: "",
  content: "",
  status: "draft"
});

const fieldError = (fieldName) => {
  return validationErrors.value[
    fieldName
  ]?.[0] || "";
};

const normalizeSlug = () => {
  form.slug = form.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const submitForm = async () => {
  normalizeSlug();

  const savedPage = await pagesStore.savePage(
    {
      title: form.title,
      slug: form.slug,
      content: form.content,
      status: form.status
    },
    pageId.value
  );

  if (savedPage) {
    await router.push({
      name: "manage-pages"
    });
  }
};

onMounted(async () => {
  pagesStore.resetFormState();

  if (!isEditing.value) {
    return;
  }

  const page =
    await pagesStore.loadManagedPage(
      pageId.value
    );

  if (!page) {
    return;
  }

  form.title = page.title;
  form.slug = page.slug;
  form.content = page.content;
  form.status = page.status;
});
</script>

<template>
  <section class="section page-form-view">
    <div class="container">
      <p class="eyebrow-text">
        Authenticated Content Management
      </p>

      <h1>
        {{ isEditing ? "Edit Page" : "Create Page" }}
      </h1>

      <p class="section-description">
        Manage reusable content that can be loaded
        dynamically through its unique slug.
      </p>

      <div
        v-if="isEditingPageLoading"
        class="form-state"
        role="status"
      >
        Loading page...
      </div>

      <form
        v-else
        class="page-form"
        novalidate
        @submit.prevent="submitForm"
      >
        <div
          v-if="saveError"
          class="form-error"
          role="alert"
        >
          {{ saveError }}
        </div>

        <div class="form-group">
          <label for="page-title">Title</label>

          <input
            id="page-title"
            v-model="form.title"
            type="text"
            autocomplete="off"
            :aria-invalid="Boolean(
              fieldError('title')
            )"
          >

          <p
            v-if="fieldError('title')"
            class="field-error"
          >
            {{ fieldError("title") }}
          </p>
        </div>

        <div class="form-group">
          <label for="page-slug">Slug</label>

          <input
            id="page-slug"
            v-model="form.slug"
            type="text"
            autocomplete="off"
            placeholder="about-us"
            :aria-invalid="Boolean(
              fieldError('slug')
            )"
            @blur="normalizeSlug"
          >

          <p class="field-help">
            Use lowercase letters, numbers, and
            hyphens. Example: about-us
          </p>

          <p
            v-if="fieldError('slug')"
            class="field-error"
          >
            {{ fieldError("slug") }}
          </p>
        </div>

        <div class="form-group">
          <label for="page-content">
            Content
          </label>

          <textarea
            id="page-content"
            v-model="form.content"
            rows="12"
            :aria-invalid="Boolean(
              fieldError('content')
            )"
          />

          <p
            v-if="fieldError('content')"
            class="field-error"
          >
            {{ fieldError("content") }}
          </p>
        </div>

        <div class="form-group">
          <label for="page-status">
            Status
          </label>

          <select
            id="page-status"
            v-model="form.status"
            :aria-invalid="Boolean(
              fieldError('status')
            )"
          >
            <option value="draft">
              Draft
            </option>
            <option value="published">
              Published
            </option>
          </select>

          <p
            v-if="fieldError('status')"
            class="field-error"
          >
            {{ fieldError("status") }}
          </p>
        </div>

        <div class="form-actions">
          <button
            class="button button-primary"
            type="submit"
            :disabled="isSaving"
          >
            {{
              isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Page"
                  : "Create Page"
            }}
          </button>

          <RouterLink
            class="button button-secondary"
            :to="{ name: 'manage-pages' }"
          >
            Cancel
          </RouterLink>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.page-form-view {
  min-height: 70vh;
  background-color: var(--color-background);
}

h1 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.section-description {
  max-width: 750px;
  margin-bottom: 2rem;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.page-form {
  max-width: 850px;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  font-weight: 900;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  min-height: 48px;
  padding: 0.75rem;
  color: var(--color-text);
  font: inherit;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.form-group textarea {
  resize: vertical;
}

.form-group [aria-invalid="true"] {
  border-color: #c62828;
}

.field-help {
  margin-top: 0.4rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.field-error {
  margin-top: 0.4rem;
  color: #a31515;
  font-weight: 800;
}

.form-error,
.form-state {
  margin-bottom: 1.5rem;
  padding: 1rem;
  text-align: center;
  border-radius: 0.6rem;
}

.form-error {
  color: #8a1c1c;
  background-color: #fff2f2;
  border: 1px solid #e6a8a8;
}

.form-state {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 600px) {
  .page-form {
    padding: 1.25rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .button {
    width: 100%;
    text-align: center;
  }
}
</style>