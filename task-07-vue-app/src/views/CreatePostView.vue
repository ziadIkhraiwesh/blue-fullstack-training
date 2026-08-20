<script setup>
import {
  computed,
  reactive
} from "vue";
import { storeToRefs } from "pinia";
import { usePostsStore } from "../stores/posts";

const postsStore = usePostsStore();

const {
  isSubmitting,
  submitError,
  createdPost
} = storeToRefs(postsStore);

const form = reactive({
  title: "",
  body: "",
  userId: ""
});

const errors = reactive({
  title: "",
  body: "",
  userId: ""
});

const bodyCharacterCount = computed(() => form.body.length);

const validateField = (fieldName) => {
  const value = String(form[fieldName]).trim();

  errors[fieldName] = "";

  if (fieldName === "title") {
    if (!value) {
      errors.title = "Title is required.";
    } else if (value.length < 5) {
      errors.title =
        "Title must contain at least 5 characters.";
    } else if (value.length > 100) {
      errors.title =
        "Title must not exceed 100 characters.";
    }
  }

  if (fieldName === "body") {
    if (!value) {
      errors.body = "Post content is required.";
    } else if (value.length < 20) {
      errors.body =
        "Post content must contain at least 20 characters.";
    } else if (value.length > 500) {
      errors.body =
        "Post content must not exceed 500 characters.";
    }
  }

  if (fieldName === "userId") {
    const numericUserId = Number(value);

    if (!value) {
      errors.userId = "User ID is required.";
    } else if (
      !Number.isInteger(numericUserId) ||
      numericUserId <= 0
    ) {
      errors.userId =
        "User ID must be a positive whole number.";
    }
  }

  return errors[fieldName] === "";
};

const validateForm = () => {
  const titleIsValid = validateField("title");
  const bodyIsValid = validateField("body");
  const userIdIsValid = validateField("userId");

  return (
    titleIsValid &&
    bodyIsValid &&
    userIdIsValid
  );
};

const handleInput = (fieldName) => {
  if (errors[fieldName]) {
    validateField(fieldName);
  }

  if (submitError.value) {
    postsStore.submitError = "";
  }
};

const handleSubmit = async () => {
  if (!validateForm() || isSubmitting.value) {
    return;
  }

  await postsStore.submitPost({
    title: form.title.trim(),
    body: form.body.trim(),
    userId: Number(form.userId)
  });
};

const startNewPost = () => {
  form.title = "";
  form.body = "";
  form.userId = "";

  errors.title = "";
  errors.body = "";
  errors.userId = "";

  postsStore.resetSubmission();
};
</script>

<template>
  <section class="section create-post-section">
    <div class="container">
      <p class="eyebrow-text">Vue Form Handling</p>
      <h1>Create a New Post</h1>

      <p class="section-description">
        Complete the form to send a simulated post creation
        request to the JSONPlaceholder API.
      </p>

      <div
        v-if="createdPost"
        class="success-state"
        role="status"
        aria-live="polite"
      >
        <h2>Post created successfully</h2>

        <p>
          JSONPlaceholder returned the record ID:
          <strong>{{ createdPost.id }}</strong>
        </p>

        <p>
          This is a simulated API response and the post will
          not be permanently stored on the server.
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
            Your entered values were preserved. Please try
            submitting again.
          </p>
        </div>

        <div class="form-group">
          <label for="post-title">
            Title
          </label>

          <input
            id="post-title"
            v-model="form.title"
            type="text"
            maxlength="100"
            autocomplete="off"
            :aria-invalid="Boolean(errors.title)"
            :aria-describedby="
              errors.title ? 'post-title-error' : undefined
            "
            @blur="validateField('title')"
            @input="handleInput('title')"
          >

          <p
            v-if="errors.title"
            id="post-title-error"
            class="field-error"
          >
            {{ errors.title }}
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
            maxlength="500"
            :aria-invalid="Boolean(errors.body)"
            :aria-describedby="
              errors.body
                ? 'post-body-error post-body-count'
                : 'post-body-count'
            "
            @blur="validateField('body')"
            @input="handleInput('body')"
          ></textarea>

          <div class="field-feedback">
            <p
              v-if="errors.body"
              id="post-body-error"
              class="field-error"
            >
              {{ errors.body }}
            </p>

            <p
              id="post-body-count"
              class="character-count"
            >
              {{ bodyCharacterCount }} / 500 characters
            </p>
          </div>
        </div>

        <div class="form-group">
          <label for="post-user-id">
            User ID
          </label>

          <input
            id="post-user-id"
            v-model="form.userId"
            type="number"
            min="1"
            step="1"
            inputmode="numeric"
            :aria-invalid="Boolean(errors.userId)"
            :aria-describedby="
              errors.userId ? 'post-user-id-error' : undefined
            "
            @blur="validateField('userId')"
            @input="handleInput('userId')"
          >

          <p
            v-if="errors.userId"
            id="post-user-id-error"
            class="field-error"
          >
            {{ errors.userId }}
          </p>
        </div>

        <button
          class="button button-primary submit-button"
          type="submit"
          :disabled="isSubmitting"
        >
          {{
            isSubmitting
              ? "Submitting..."
              : submitError
                ? "Retry Submission"
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
  max-width: 720px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.create-post-form,
.success-state {
  max-width: 760px;
  margin-top: 2rem;
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
  font-weight: 800;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  color: var(--color-text);
  font: inherit;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.form-group input {
  min-height: 48px;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: 3px solid rgba(22, 131, 189, 0.25);
  border-color: var(--color-secondary);
}

.form-group input[aria-invalid="true"],
.form-group textarea[aria-invalid="true"] {
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

.success-state h2 {
  margin-bottom: 1rem;
}

.success-state p {
  margin-bottom: 1rem;
  line-height: 1.7;
}

@media (max-width: 600px) {
  .create-post-form,
  .success-state {
    padding: 1.25rem;
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