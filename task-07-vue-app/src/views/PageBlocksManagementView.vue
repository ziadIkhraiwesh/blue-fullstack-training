<script setup>
import {
  computed,
  onMounted,
  reactive
} from "vue";
import { storeToRefs } from "pinia";
import {
  RouterLink,
  useRoute
} from "vue-router";
import { usePagesStore } from "../stores/pages";
import {
  usePageBlocksStore
} from "../stores/pageBlocks";

const route = useRoute();
const pagesStore = usePagesStore();
const blocksStore = usePageBlocksStore();

const {
  editingPage,
  isEditingPageLoading
} = storeToRefs(pagesStore);

const {
  blocks,
  isLoading,
  loadError,
  isSaving,
  saveError,
  validationErrors,
  isDeleting,
  isReordering,
  reorderError,
  deleteError,
  successMessage
} = storeToRefs(blocksStore);

const pageId = computed(
  () => Number(route.params.id)
);

const editingBlockId = computed(
  () => form.id
);

const form = reactive({
  id: null,
  type: "hero",
  position: "",
  heading: "",
  subheading: "",
  body: "",
  text: "",
  buttonLabel: "",
  buttonUrl: "",
  featuresText: ""
});

const fieldError = (fieldName) => {
  return validationErrors.value[
    fieldName
  ]?.[0] || "";
};

const resetForm = () => {
  form.id = null;
  form.type = "hero";
  form.position = "";
  form.heading = "";
  form.subheading = "";
  form.body = "";
  form.text = "";
  form.buttonLabel = "";
  form.buttonUrl = "";
  form.featuresText = "";
};

const buildBlockData = () => {
  if (form.type === "hero") {
    return {
      heading: form.heading,
      subheading: form.subheading
    };
  }

  if (form.type === "text") {
    return {
      heading: form.heading,
      body: form.body
    };
  }

  if (form.type === "cta") {
    return {
      heading: form.heading,
      text: form.text,
      button_label: form.buttonLabel,
      button_url: form.buttonUrl
    };
  }

  return {
    heading: form.heading,
    items: form.featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [
          title,
          ...descriptionParts
        ] = line.split("|");

        return {
          title: title?.trim() || "",
          description:
            descriptionParts
              .join("|")
              .trim()
        };
      })
  };
};

const submitBlock = async () => {
  const blockData = {
    type: form.type,
    data: buildBlockData()
  };

  if (form.position !== "") {
    blockData.position =
      Number(form.position);
  }

  const savedBlock =
    await blocksStore.saveBlock(
      pageId.value,
      blockData,
      form.id
    );

  if (savedBlock) {
    resetForm();
  }
};

const beginEdit = (block) => {
  resetForm();

  form.id = block.id;
  form.type = block.type;
  form.position = block.position;
  form.heading =
    block.data?.heading || "";
  form.subheading =
    block.data?.subheading || "";
  form.body = block.data?.body || "";
  form.text = block.data?.text || "";
  form.buttonLabel =
    block.data?.button_label || "";
  form.buttonUrl =
    block.data?.button_url || "";

  form.featuresText =
    (block.data?.items || [])
      .map(
        (item) =>
          `${item.title} | ${item.description}`
      )
      .join("\n");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

const handleDelete = async (block) => {
  const confirmed = window.confirm(
    `Delete the ${block.type} block?`
  );

  if (!confirmed) {
    return;
  }

  const wasDeleted =
    await blocksStore.removeBlock(
      pageId.value,
      block.id
    );

  if (
    wasDeleted &&
    form.id === block.id
  ) {
    resetForm();
  }
};

onMounted(async () => {
  blocksStore.resetState();
  pagesStore.resetFormState();

  await Promise.all([
    pagesStore.loadManagedPage(
      pageId.value
    ),
    blocksStore.loadBlocks(
      pageId.value
    )
  ]);
});
</script>

<template>
  <section class="section blocks-management-view">
    <div class="container">
      <div class="page-heading">
        <div>
          <p class="eyebrow-text">
            CMS-Style Page Composition
          </p>

          <h1>Manage Content Blocks</h1>

          <p v-if="editingPage">
            Page:
            <strong>
              {{ editingPage.title }}
            </strong>
          </p>
        </div>

        <div class="heading-actions">
          <RouterLink
            class="button button-secondary"
            :to="{ name: 'manage-pages' }"
          >
            Back to Pages
          </RouterLink>

          <RouterLink
            v-if="
              editingPage?.status ===
              'published'
            "
            class="button button-primary"
            :to="{
              name: 'dynamic-page',
              params: {
                slug: editingPage.slug
              }
            }"
          >
            View Public Page
          </RouterLink>
        </div>
      </div>

      <div
        v-if="isEditingPageLoading"
        class="request-state"
      >
        Loading page...
      </div>

      <form
        v-else
        class="block-form"
        novalidate
        @submit.prevent="submitBlock"
      >
        <h2>
          {{
            editingBlockId
              ? "Edit Block"
              : "Add Content Block"
          }}
        </h2>

        <p
          v-if="saveError"
          class="message error-message"
          role="alert"
        >
          {{ saveError }}
        </p>

        <div class="form-row">
          <div class="form-group">
            <label for="block-type">
              Block Type
            </label>

            <select
              id="block-type"
              v-model="form.type"
              :disabled="Boolean(
                editingBlockId
              )"
            >
              <option value="hero">
                Hero
              </option>
              <option value="text">
                Text
              </option>
              <option value="features">
                Feature List
              </option>
              <option value="cta">
                Call to Action
              </option>
            </select>

            <p
              v-if="fieldError('type')"
              class="field-error"
            >
              {{ fieldError("type") }}
            </p>
          </div>

          <div class="form-group">
            <label for="block-position">
              Position
            </label>

            <input
              id="block-position"
              v-model="form.position"
              type="number"
              min="0"
              placeholder="Automatic"
            >
          </div>
        </div>

        <div
          v-if="
            ['hero', 'text', 'features', 'cta']
              .includes(form.type)
          "
          class="form-group"
        >
          <label for="block-heading">
            Heading
          </label>

          <input
            id="block-heading"
            v-model="form.heading"
            type="text"
            autocomplete="off"
          >

          <p
            v-if="
              fieldError('data.heading')
            "
            class="field-error"
          >
            {{
              fieldError("data.heading")
            }}
          </p>
        </div>

        <div
          v-if="form.type === 'hero'"
          class="form-group"
        >
          <label for="hero-subheading">
            Subheading
          </label>

          <textarea
            id="hero-subheading"
            v-model="form.subheading"
            rows="3"
          />
        </div>

        <div
          v-if="form.type === 'text'"
          class="form-group"
        >
          <label for="text-body">
            Body
          </label>

          <textarea
            id="text-body"
            v-model="form.body"
            rows="7"
          />

          <p
            v-if="
              fieldError('data.body')
            "
            class="field-error"
          >
            {{ fieldError("data.body") }}
          </p>
        </div>

        <div
          v-if="form.type === 'features'"
          class="form-group"
        >
          <label for="features-items">
            Feature Items
          </label>

          <textarea
            id="features-items"
            v-model="form.featuresText"
            rows="7"
            placeholder="Feature title | Feature description"
          />

          <p class="field-help">
            Add one feature per line using:
            Title | Description
          </p>

          <p
            v-if="
              fieldError('data.items')
            "
            class="field-error"
          >
            {{
              fieldError("data.items")
            }}
          </p>
        </div>

        <template v-if="form.type === 'cta'">
          <div class="form-group">
            <label for="cta-text">
              Supporting Text
            </label>

            <textarea
              id="cta-text"
              v-model="form.text"
              rows="3"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="button-label">
                Button Label
              </label>

              <input
                id="button-label"
                v-model="form.buttonLabel"
                type="text"
              />

              <p
                v-if="
                  fieldError(
                    'data.button_label'
                  )
                "
                class="field-error"
              >
                {{
                  fieldError(
                    "data.button_label"
                  )
                }}
              </p>
            </div>

            <div class="form-group">
              <label for="button-url">
                Button URL
              </label>

              <input
                id="button-url"
                v-model="form.buttonUrl"
                type="text"
                placeholder="/contact"
              />

              <p
                v-if="
                  fieldError(
                    'data.button_url'
                  )
                "
                class="field-error"
              >
                {{
                  fieldError(
                    "data.button_url"
                  )
                }}
              </p>
            </div>
          </div>
        </template>

        <div class="form-actions">
          <button
            class="button button-primary"
            type="submit"
            :disabled="isSaving"
          >
            {{
              isSaving
                ? "Saving..."
                : editingBlockId
                  ? "Update Block"
                  : "Add Block"
            }}
          </button>

          <button
            v-if="editingBlockId"
            class="button button-secondary"
            type="button"
            @click="resetForm"
          >
            Cancel Editing
          </button>
        </div>
      </form>

      <div class="blocks-list-section">
        <h2>Page Blocks</h2>

        <p
          v-if="successMessage"
          class="message success-message"
        >
          {{ successMessage }}
        </p>

        <p
          v-if="
            deleteError || reorderError
          "
          class="message error-message"
          role="alert"
        >
          {{
            deleteError ||
            reorderError
          }}
        </p>

        <div
          v-if="isLoading"
          class="request-state"
        >
          Loading content blocks...
        </div>

        <div
          v-else-if="loadError"
          class="request-state error-message"
        >
          {{ loadError }}
        </div>

        <div
          v-else-if="blocks.length === 0"
          class="request-state"
        >
          This page does not contain any
          content blocks yet.
        </div>

        <div v-else class="blocks-list">
          <article
            v-for="(block, index) in blocks"
            :key="block.id"
            class="block-card"
          >
            <div class="block-summary">
              <span class="position-badge">
                {{ block.position }}
              </span>

              <div>
                <h3>
                  {{ block.type }}
                </h3>
                <p>
                  {{
                    block.data?.heading ||
                    block.data?.body ||
                    "Configured content block"
                  }}
                </p>
              </div>
            </div>

            <div class="block-actions">
              <button
                type="button"
                :disabled="
                  index === 0 ||
                  isReordering
                "
                @click="
                  blocksStore.moveBlock(
                    pageId,
                    block.id,
                    'up'
                  )
                "
              >
                Move Up
              </button>

              <button
                type="button"
                :disabled="
                  index ===
                    blocks.length - 1 ||
                  isReordering
                "
                @click="
                  blocksStore.moveBlock(
                    pageId,
                    block.id,
                    'down'
                  )
                "
              >
                Move Down
              </button>

              <button
                type="button"
                @click="beginEdit(block)"
              >
                Edit
              </button>

              <button
                class="delete-button"
                type="button"
                :disabled="isDeleting"
                @click="
                  handleDelete(block)
                "
              >
                Delete
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.blocks-management-view {
  min-height: 70vh;
  background-color: var(--color-background);
}

.page-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

h1 {
  margin-bottom: 0.75rem;
  color: var(--color-primary);
  font-size: clamp(2rem, 5vw, 3.5rem);
}

h2 {
  margin-bottom: 1.25rem;
  color: var(--color-primary);
}

.heading-actions,
.form-actions,
.block-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.block-form {
  max-width: 900px;
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.form-row {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  font-weight: 900;
}

.form-group input,
.form-group select,
.form-group textarea {
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

.message,
.request-state {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 0.6rem;
}

.success-message {
  color: #176134;
  background-color: #dcf7e6;
}

.error-message {
  color: #8a1c1c;
  background-color: #fff2f2;
  border: 1px solid #e6a8a8;
}

.request-state {
  text-align: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.blocks-list {
  display: grid;
  gap: 1rem;
}

.block-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
}

.block-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.position-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  color: #ffffff;
  font-weight: 900;
  background-color: var(--color-secondary);
  border-radius: 50%;
}

.block-card h3 {
  color: var(--color-primary);
  text-transform: capitalize;
}

.block-card p {
  color: var(--color-text-muted);
}

.block-actions button {
  padding: 0.55rem 0.75rem;
  color: var(--color-primary);
  font: inherit;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 0.4rem;
}

.block-actions .delete-button {
  color: #8a1c1c;
  background-color: #fff2f2;
  border-color: #e6a8a8;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 800px) {
  .page-heading,
  .block-card {
    align-items: stretch;
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .heading-actions .button,
  .form-actions .button {
    width: 100%;
    text-align: center;
  }
}
</style>