<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import { usePagesStore } from "../stores/pages";

const pagesStore = usePagesStore();

const {
  managedPages,
  isManagedPagesLoading,
  managedPagesError,
  isDeleting,
  deleteError,
  successMessage
} = storeToRefs(pagesStore);

const handleDelete = async (page) => {
  const confirmed = window.confirm(
    `Delete "${page.title}"?`
  );

  if (!confirmed) {
    return;
  }

  await pagesStore.removePage(page.id);
};

onMounted(() => {
  pagesStore.resetFormState();
  pagesStore.loadManagedPages();
});
</script>

<template>
  <section class="section pages-management-view">
    <div class="container">
      <div class="management-heading">
        <div>
          <p class="eyebrow-text">
            Authenticated Content Management
          </p>
          <h1>Manage Pages</h1>
          <p class="section-description">
            Create, edit, publish, and remove
            reusable website content.
          </p>
        </div>

        <RouterLink class="button button-primary" :to="{ name: 'create-page' }">
          Create Page
        </RouterLink>
      </div>

      <p v-if="successMessage" class="success-message" role="status">
        {{ successMessage }}
      </p>

      <p v-if="deleteError" class="error-message" role="alert">
        {{ deleteError }}
      </p>

      <div v-if="isManagedPagesLoading" class="request-state" role="status">
        Loading managed pages...
      </div>

      <div v-else-if="managedPagesError" class="request-state error-state" role="alert">
        <p>{{ managedPagesError }}</p>

        <button class="button button-primary" type="button" @click="pagesStore.loadManagedPages">
          Retry
        </button>
      </div>

      <div v-else-if="managedPages.length === 0" class="request-state">
        No pages have been created yet.
      </div>

      <div v-else class="pages-table-wrapper">
        <table class="pages-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="page in managedPages" :key="page.id">
              <td>{{ page.title }}</td>
              <td>/pages/{{ page.slug }}</td>
              <td>
                <span class="status-badge" :class="`status-${page.status}`">
                  {{ page.status }}
                </span>
              </td>
              <td>
                <div class="page-actions">
                  <RouterLink class="action-link" :to="{
                    name: 'manage-page-blocks',
                    params: {
                      id: page.id
                    }
                  }">
                    Manage Blocks
                  </RouterLink>
                  <RouterLink v-if="page.status === 'published'" class="action-link" :to="{
                    name: 'dynamic-page',
                    params: {
                      slug: page.slug
                    }
                  }">
                    View
                  </RouterLink>


                  <RouterLink class="action-link" :to="{
                    name: 'edit-page',
                    params: {
                      id: page.id
                    }
                  }">
                    Edit
                  </RouterLink>

                  <button class="delete-button" type="button" :disabled="isDeleting" @click="handleDelete(page)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pages-management-view {
  min-height: 70vh;
  background-color: var(--color-background);
}

.management-heading {
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

.section-description {
  color: var(--color-text-muted);
}

.pages-table-wrapper {
  overflow-x: auto;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.pages-table {
  width: 100%;
  border-collapse: collapse;
}

.pages-table th,
.pages-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.pages-table th {
  color: var(--color-primary);
  background-color: #eef6fa;
}

.status-badge {
  display: inline-flex;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: capitalize;
  border-radius: 999px;
}

.status-published {
  color: #176134;
  background-color: #dcf7e6;
}

.status-draft {
  color: #704d00;
  background-color: #fff4c2;
}

.page-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-link,
.delete-button {
  padding: 0.5rem 0.75rem;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  border-radius: 0.4rem;
}

.action-link {
  color: #ffffff;
  text-decoration: none;
  background-color: var(--color-secondary);
}

.delete-button {
  color: #8a1c1c;
  background-color: #fff2f2;
  border: 1px solid #e6a8a8;
}

.delete-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.request-state,
.success-message,
.error-message {
  margin-bottom: 1.5rem;
  padding: 1rem;
  text-align: center;
  border-radius: 0.6rem;
}

.request-state {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.success-message {
  color: #176134;
  background-color: #dcf7e6;
}

.error-message,
.error-state {
  color: #8a1c1c;
  background-color: #fff2f2;
  border: 1px solid #e6a8a8;
}

@media (max-width: 700px) {
  .management-heading {
    align-items: stretch;
    flex-direction: column;
  }

  .management-heading .button {
    width: 100%;
    text-align: center;
  }
}
</style>