import { defineStore } from "pinia";
import {
  createPage,
  deletePage,
  fetchManagedPageById,
  fetchManagedPages,
  fetchPublicPageBySlug,
  updatePage
} from "../services/pagesApi";
import {
  getApiErrorMessage,
  getValidationErrors
} from "../services/apiClient";

export const usePagesStore = defineStore(
  "pages",
  {
    state: () => ({
      publicPage: null,
      isPublicPageLoading: false,
      publicPageError: "",
      publicPageNotFound: false,

      managedPages: [],
      isManagedPagesLoading: false,
      managedPagesError: "",

      editingPage: null,
      isEditingPageLoading: false,

      isSaving: false,
      saveError: "",
      validationErrors: {},
      successMessage: "",

      isDeleting: false,
      deleteError: ""
    }),

    actions: {
      async loadPublicPage(slug) {
        this.publicPage = null;
        this.publicPageError = "";
        this.publicPageNotFound = false;
        this.isPublicPageLoading = true;

        try {
          this.publicPage =
            await fetchPublicPageBySlug(slug);
        } catch (error) {
          if (error.response?.status === 404) {
            this.publicPageNotFound = true;
          } else {
            this.publicPageError =
              getApiErrorMessage(
                error,
                "Unable to load this page."
              );
          }
        } finally {
          this.isPublicPageLoading = false;
        }
      },

      async loadManagedPages() {
        this.isManagedPagesLoading = true;
        this.managedPagesError = "";

        try {
          const response =
            await fetchManagedPages();

          this.managedPages =
            response.data || [];
        } catch (error) {
          this.managedPagesError =
            getApiErrorMessage(
              error,
              "Unable to load managed pages."
            );
        } finally {
          this.isManagedPagesLoading = false;
        }
      },

      async loadManagedPage(pageId) {
        this.editingPage = null;
        this.isEditingPageLoading = true;
        this.saveError = "";

        try {
          this.editingPage =
            await fetchManagedPageById(pageId);

          return this.editingPage;
        } catch (error) {
          this.saveError = getApiErrorMessage(
            error,
            "Unable to load the page."
          );

          return null;
        } finally {
          this.isEditingPageLoading = false;
        }
      },

      async savePage(pageData, pageId = null) {
        if (this.isSaving) {
          return null;
        }

        this.isSaving = true;
        this.saveError = "";
        this.validationErrors = {};
        this.successMessage = "";

        try {
          const savedPage = pageId
            ? await updatePage(
                pageId,
                pageData
              )
            : await createPage(pageData);

          this.successMessage = pageId
            ? "Page updated successfully."
            : "Page created successfully.";

          await this.loadManagedPages();

          return savedPage;
        } catch (error) {
          this.validationErrors =
            getValidationErrors(error);

          this.saveError = getApiErrorMessage(
            error,
            "Unable to save the page."
          );

          return null;
        } finally {
          this.isSaving = false;
        }
      },

      async removePage(pageId) {
        if (this.isDeleting) {
          return false;
        }

        this.isDeleting = true;
        this.deleteError = "";
        this.successMessage = "";

        try {
          await deletePage(pageId);

          this.managedPages =
            this.managedPages.filter(
              (page) =>
                page.id !== Number(pageId)
            );

          this.successMessage =
            "Page deleted successfully.";

          return true;
        } catch (error) {
          this.deleteError =
            getApiErrorMessage(
              error,
              "Unable to delete the page."
            );

          return false;
        } finally {
          this.isDeleting = false;
        }
      },

      resetFormState() {
        this.editingPage = null;
        this.saveError = "";
        this.validationErrors = {};
        this.successMessage = "";
        this.deleteError = "";
      }
    }
  }
);