<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from "vue";
import { storeToRefs } from "pinia";
import {
  RouterLink,
  useRoute,
  useRouter
} from "vue-router";
import { usePostsStore } from "../stores/posts";
import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const postsStore = usePostsStore();
const authStore = useAuthStore();

const {
  currentPost: post,
  isPostLoading: isLoading,
  postErrorMessage: errorMessage,
  categories,
  isUpdating,
  updateError,
  updateValidationErrors,
  isDeleting,
  deleteError,
  operationMessage
} = storeToRefs(postsStore);

const isEditing = ref(false);

const editForm = reactive({
  title: "",
  body: "",
  status: "draft",
  category_id: ""
});

const isNotFound = computed(() =>
  errorMessage.value
    .toLowerCase()
    .includes("could not be found")
);

const isOwner = computed(() => {
  return (
    authStore.isAuthenticated &&
    post.value?.author?.id === authStore.user?.id
  );
});

const loadRequestedPost = async () => {
  isEditing.value = false;
  postsStore.updateError = "";
  postsStore.deleteError = "";
  postsStore.operationMessage = "";

  await postsStore.loadPostById(route.params.id);
};

const startEditing = () => {
  if (!post.value || !isOwner.value) {
    return;
  }

  editForm.title = post.value.title;
  editForm.body = post.value.body;
  editForm.status = post.value.status;
  editForm.category_id = String(
    post.value.category?.id || ""
  );

  postsStore.updateError = "";
  postsStore.updateValidationErrors = {};
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  postsStore.updateError = "";
  postsStore.updateValidationErrors = {};
};

const handleUpdate = async () => {
  const updatedPost =
    await postsStore.updateExistingPost(
      post.value.id,
      {
        title: editForm.title.trim(),
        body: editForm.body.trim(),
        status: editForm.status,
        category_id: editForm.category_id
          ? Number(editForm.category_id)
          : null
      }
    );

  if (updatedPost) {
    isEditing.value = false;
  }
};

const handleDelete = async () => {
  if (!post.value || !isOwner.value) {
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmed) {
    return;
  }

  const wasDeleted = await postsStore.removePost(
    post.value.id
  );

  if (wasDeleted) {
    await router.push({
      name: "posts"
    });
  }
};

const goBackToPosts = () => {
  const previousSearch =
    typeof route.query.from === "string"
      ? route.query.from
      : "";

  router.push({
    name: "posts",
    query: previousSearch
      ? { search: previousSearch }
      : {}
  });
};

watch(
  () => route.params.id,
  loadRequestedPost,
  {
    immediate: true
  }
);

onMounted(() => {
  postsStore.loadCategories();
});
</script>

<template>
  <section class="section post-details-view">
    <div class="container">
      <button
        class="back-button"
        type="button"
        @click="goBackToPosts"
      >
        Back to Posts
      </button>

      <div
        v-if="isLoading"
        class="request-state"
        role="status"
      >
        Loading post from Laravel...
      </div>

      <div
        v-else-if="errorMessage"
        class="request-state error-state"
        role="alert"
      >
        <h1>
          {{ isNotFound ? "Post Not Found" : "Request Error" }}
        </h1>

        <p>{{ errorMessage }}</p>

        <button
          class="button button-primary"
          type="button"
          @click="loadRequestedPost"
        >
          Retry
        </button>
      </div>

      <article
        v-else-if="post"
        class="post-details-card"
      >
        <div class="post-heading">
          <div>
            <p class="eyebrow-text">
              Post #{{ post.id }}
            </p>

            <h1>{{ post.title }}</h1>
          </div>

          <span
            class="status-badge"
            :class="`status-${post.status}`"
          >
            {{ post.status }}
          </span>
        </div>

        <p class="post-content">
          {{ post.body }}
        </p>

        <dl class="post-information">
          <div>
            <dt>Category</dt>
            <dd>
              {{ post.category?.name || "Uncategorized" }}
            </dd>
          </div>

          <div>
            <dt>Author</dt>
            <dd>
              {{ post.author?.name || "Unknown" }}
            </dd>
          </div>
        </dl>

        <p
          v-if="operationMessage"
          class="success-message"
          role="status"
        >
          {{ operationMessage }}
        </p>

        <div
          v-if="isOwner"
          class="owner-actions"
        >
          <button
            v-if="!isEditing"
            class="button button-primary"
            type="button"
            @click="startEditing"
          >
            Edit Post
          </button>

          <button
            v-if="!isEditing"
            class="button delete-button"
            type="button"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            {{
              isDeleting
                ? "Deleting..."
                : "Delete Post"
            }}
          </button>
        </div>

        <p
          v-else-if="authStore.isAuthenticated"
          class="permission-message"
        >
          This post belongs to another user. You cannot
          update or delete it.
        </p>

        <p
          v-else
          class="permission-message"
        >
          <RouterLink
            :to="{
              name: 'login',
              query: {
                redirect: route.fullPath
              }
            }"
          >
            Log in
          </RouterLink>
          to manage posts that belong to you.
        </p>

        <p
          v-if="deleteError"
          class="form-error"
          role="alert"
        >
          {{ deleteError }}
        </p>

        <form
          v-if="isEditing"
          class="edit-form"
          novalidate
          @submit.prevent="handleUpdate"
        >
          <h2>Edit Post</h2>

          <p
            v-if="updateError"
            class="form-error"
            role="alert"
          >
            {{ updateError }}
          </p>

          <div class="form-group">
            <label for="edit-title">
              Title
            </label>

            <input
              id="edit-title"
              v-model="editForm.title"
              type="text"
            >

            <p
              v-if="updateValidationErrors.title"
              class="field-error"
            >
              {{ updateValidationErrors.title[0] }}
            </p>
          </div>

          <div class="form-group">
            <label for="edit-body">
              Body
            </label>

            <textarea
              id="edit-body"
              v-model="editForm.body"
              rows="7"
            ></textarea>

            <p
              v-if="updateValidationErrors.body"
              class="field-error"
            >
              {{ updateValidationErrors.body[0] }}
            </p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="edit-status">
                Status
              </label>

              <select
                id="edit-status"
                v-model="editForm.status"
              >
                <option value="draft">Draft</option>
                <option value="published">
                  Published
                </option>
              </select>

              <p
                v-if="updateValidationErrors.status"
                class="field-error"
              >
                {{ updateValidationErrors.status[0] }}
              </p>
            </div>

            <div class="form-group">
              <label for="edit-category">
                Category
              </label>

              <select
                id="edit-category"
                v-model="editForm.category_id"
              >
                <option value="">
                  Select a category
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
                v-if="
                  updateValidationErrors.category_id
                "
                class="field-error"
              >
                {{
                  updateValidationErrors.category_id[0]
                }}
              </p>
            </div>
          </div>

          <div class="edit-actions">
            <button
              class="button button-primary"
              type="submit"
              :disabled="isUpdating"
            >
              {{
                isUpdating
                  ? "Saving..."
                  : "Save Changes"
              }}
            </button>

            <button
              class="button button-secondary"
              type="button"
              :disabled="isUpdating"
              @click="cancelEditing"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    </div>
  </section>
</template>

<style scoped>
.post-details-view {
  min-height: calc(100vh - 72px);
  background-color: var(--color-background);
}

.back-button {
  margin-bottom: 1.5rem;
  padding: 0.65rem 1rem;
  color: var(--color-primary);
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.post-details-card {
  max-width: 900px;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.post-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.post-heading h1 {
  color: var(--color-primary);
}

.status-badge {
  padding: 0.4rem 0.75rem;
  font-weight: 900;
  text-transform: capitalize;
  border-radius: 999px;
}

.status-published {
  color: #155724;
  background-color: #dff3e4;
}

.status-draft {
  color: #704d00;
  background-color: #fff4c2;
}

.post-content {
  margin: 2rem 0;
  color: var(--color-text-muted);
  line-height: 1.8;
  white-space: pre-wrap;
}

.post-information {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
  gap: 1rem;
  background-color: #f4f8fa;
  border-radius: 0.5rem;
}

.post-information dt {
  color: var(--color-primary);
  font-weight: 900;
}

.post-information dd {
  margin-top: 0.25rem;
  color: var(--color-text-muted);
}

.owner-actions,
.edit-actions {
  display: flex;
  margin-top: 1.5rem;
  gap: 1rem;
}

.delete-button {
  color: #ffffff;
  background-color: #b42318;
}

.permission-message,
.form-error,
.success-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.permission-message {
  color: #704d00;
  background-color: #fff8dc;
}

.form-error {
  color: #8a1c1c;
  background-color: #fff2f2;
}

.success-message {
  color: #155724;
  background-color: #effbf2;
}

.edit-form {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.edit-form h2 {
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
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
  padding: 0.8rem;
  color: var(--color-text);
  font: inherit;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.field-error {
  margin-top: 0.4rem;
  color: #b42318;
  font-weight: 700;
}

.request-state {
  padding: 2rem;
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.error-state {
  color: #8a1c1c;
  background-color: #fff2f2;
}

.error-state p {
  margin: 1rem 0;
}

@media (max-width: 650px) {
  .post-details-card {
    padding: 1.25rem;
  }

  .post-heading,
  .owner-actions,
  .edit-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .form-row,
  .post-information {
    grid-template-columns: 1fr;
  }
}
</style>