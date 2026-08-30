<script setup>
import {
  computed,
  onMounted,
  reactive
} from "vue";
import { storeToRefs } from "pinia";
import { usePostsStore } from "../stores/posts";

const postsStore = usePostsStore();

const {
  categories,
  isCategoriesLoading,
  categoriesError,
  isSubmitting,
  submitError,
  validationErrors,
  createdPost
} = storeToRefs(postsStore);

const form = reactive({
  title: "",
  body: "",
  status: "draft",
  category_id: ""
});

const bodyCharacterCount = computed(
  () => form.body.length
);

const handleInput = (fieldName) => {
  if (validationErrors.value[fieldName]) {
    delete postsStore.validationErrors[fieldName];
  }

  if (submitError.value) {
    postsStore.submitError = "";
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return;
  }

  await postsStore.submitPost({
    title: form.title.trim(),
    body: form.body.trim(),
    status: form.status,
    category_id: form.category_id
      ? Number(form.category_id)
      : null
  });
};

const startNewPost = () => {
  form.title = "";
  form.body = "";
  form.status = "draft";
  form.category_id = "";

  postsStore.resetSubmission();
};

onMounted(() => {
  postsStore.loadCategories();
});
</script>

<template>
  <section class="section create-post-section">
    <div class="container">
      <p class="eyebrow-text">
        Vue + Laravel End-to-End CRUD
      </p>

      <h1>Create a New Post</h1>

      <p class="section-description">
        Submit this form to the protected Laravel endpoint.
        The authenticated user becomes the post owner
        automatically, and the record is persisted in MySQL.
      </p>

      <div
        v-if="createdPost"
        class="success-state"
        role="status"
        aria-live="polite"
      >
        <h2>Post created successfully</h2>

        <p>
          Laravel created post
          <strong>#{{ createdPost.id }}</strong>
          and saved it in the database.
        </p>

        <p>
          Owner:
          <strong>
            {{ createdPost.author?.name }}
          </strong>
        </p>

        <p>
          Category:
          <strong>
            {{ createdPost.category?.name }}
          </strong>
        </p>

        <button
          class="button button-primary"
          type="button"
          @click="startNewPost"
        >
          Create Another Post
        </button>
      </div>

      <form
        v-else
        class="create-post-form"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="submitError"
          class="submit-error"
          role="alert"
        >
          <p>{{ submitError }}</p>
          <p>
            Review the fields below and try again.
          </p>
        </div>

        <div
          v-if="categoriesError"
          class="submit-error"
          role="alert"
        >
          <p>{{ categoriesError }}</p>

          <button
            class="button button-secondary"
            type="button"
            @click="postsStore.loadCategories"
          >
            Retry Categories
          </button>
        </div>

        <div class="form-group">
          <label for="post-title">
            Title
          </label>

          <input
            id="post-title"
            v-model="form.title"
            type="text"
            autocomplete="off"
            :aria-invalid="
              Boolean(validationErrors.title)
            "
            @input="handleInput('title')"
          >

          <p
            v-if="validationErrors.title"
            class="field-error"
          >
            {{ validationErrors.title[0] }}
          </p>
        </div>

        <div class="form-group">
          <label for="post-body">
            Body / Content
          </label>

          <textarea
            id="post-body"
            v-model="form.body"
            rows="8"
            maxlength="1000"
            :aria-invalid="
              Boolean(validationErrors.body)
            "
            @input="handleInput('body')"
          ></textarea>

          <div class="field-feedback">
            <p
              v-if="validationErrors.body"
              class="field-error"
            >
              {{ validationErrors.body[0] }}
            </p>

            <p class="character-count">
              {{ bodyCharacterCount }} / 1000 characters
            </p>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="post-status">
              Status
            </label>

            <select
              id="post-status"
              v-model="form.status"
              :aria-invalid="
                Boolean(validationErrors.status)
              "
              @change="handleInput('status')"
            >
              <option value="draft">Draft</option>
              <option value="published">
                Published
              </option>
            </select>

            <p
              v-if="validationErrors.status"
              class="field-error"
            >
              {{ validationErrors.status[0] }}
            </p>
          </div>

          <div class="form-group">
            <label for="post-category">
              Category
            </label>

            <select
              id="post-category"
              v-model="form.category_id"
              :disabled="isCategoriesLoading"
              :aria-invalid="
                Boolean(validationErrors.category_id)
              "
              @change="handleInput('category_id')"
            >
              <option value="">
                {{
                  isCategoriesLoading
                    ? "Loading categories..."
                    : "Select a category"
                }}
              </option>

              <option
                v-for="category in categories"
                :key="category.id"
                :value="String(category.id)"
              >
                {{ category.name }}
              </option>
            </select>

            <p
              v-if="validationErrors.category_id"
              class="field-error"
            >
              {{ validationErrors.category_id[0] }}
            </p>
          </div>
        </div>

        <button
          class="button button-primary submit-button"
          type="submit"
          :disabled="
            isSubmitting ||
            isCategoriesLoading
          "
        >
          {{
            isSubmitting
              ? "Saving to Laravel..."
              : "Create Post"
          }}
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.create-post-section {
  min-height: calc(100vh - 90px);
  background-color: var(--color-background);
}

h1 {
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.section-description {
  max-width: 760px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.create-post-form,
.success-state {
  max-width: 800px;
  margin-top: 2rem;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  font-weight: 800;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  min-height: 48px;
  padding: 0.8rem;
  color: var(--color-text);
  font: inherit;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: var(--color-secondary);
  outline: 3px solid rgba(22, 131, 189, 0.25);
}

.form-group [aria-invalid="true"] {
  border-color: #b42318;
}

.field-feedback {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.field-error {
  margin-top: 0.45rem;
  color: #b42318;
  font-weight: 700;
}

.character-count {
  margin-top: 0.45rem;
  margin-left: auto;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.submit-error {
  margin-bottom: 1.5rem;
  padding: 1rem;
  color: #8a1c1c;
  background-color: #fff2f2;
  border: 1px solid #e6a8a8;
  border-radius: 0.5rem;
}

.submit-error p + p {
  margin-top: 0.5rem;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.success-state {
  color: #155724;
  background-color: #effbf2;
  border-color: #8bd19c;
}

.success-state h2,
.success-state p {
  margin-bottom: 1rem;
}

@media (max-width: 650px) {
  .create-post-form,
  .success-state {
    padding: 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .field-feedback {
    align-items: flex-start;
    flex-direction: column;
    gap: 0;
  }

  .character-count {
    margin-left: 0;
  }

  .submit-button {
    width: 100%;
  }
}
</style>