import { defineStore } from "pinia";
import {
  createPageBlock,
  deletePageBlock,
  fetchPageBlocks,
  reorderPageBlocks,
  updatePageBlock
} from "../services/pagesApi";
import {
  getApiErrorMessage,
  getValidationErrors
} from "../services/apiClient";

const sortByPosition = (blocks) => {
  return [...blocks].sort(
    (first, second) =>
      first.position - second.position ||
      first.id - second.id
  );
};

export const usePageBlocksStore =
  defineStore("pageBlocks", {
    state: () => ({
      blocks: [],
      isLoading: false,
      loadError: "",

      isSaving: false,
      saveError: "",
      validationErrors: {},

      isDeleting: false,
      deleteError: "",

      isReordering: false,
      reorderError: "",
      successMessage: ""
    }),

    actions: {
      async loadBlocks(pageId) {
        this.isLoading = true;
        this.loadError = "";

        try {
          const blocks =
            await fetchPageBlocks(pageId);

          this.blocks = sortByPosition(
            blocks || []
          );
        } catch (error) {
          this.loadError =
            getApiErrorMessage(
              error,
              "Unable to load content blocks."
            );
        } finally {
          this.isLoading = false;
        }
      },

      async saveBlock(
        pageId,
        blockData,
        blockId = null
      ) {
        if (this.isSaving) {
          return null;
        }

        this.isSaving = true;
        this.saveError = "";
        this.validationErrors = {};
        this.successMessage = "";

        try {
          const savedBlock = blockId
            ? await updatePageBlock(
                pageId,
                blockId,
                blockData
              )
            : await createPageBlock(
                pageId,
                blockData
              );

          const existingIndex =
            this.blocks.findIndex(
              (block) =>
                block.id === savedBlock.id
            );

          if (existingIndex === -1) {
            this.blocks.push(savedBlock);
          } else {
            this.blocks[existingIndex] =
              savedBlock;
          }

          this.blocks = sortByPosition(
            this.blocks
          );

          this.successMessage = blockId
            ? "Content block updated successfully."
            : "Content block added successfully.";

          return savedBlock;
        } catch (error) {
          this.validationErrors =
            getValidationErrors(error);

          this.saveError =
            getApiErrorMessage(
              error,
              "Unable to save the content block."
            );

          return null;
        } finally {
          this.isSaving = false;
        }
      },

      async removeBlock(
        pageId,
        blockId
      ) {
        if (this.isDeleting) {
          return false;
        }

        this.isDeleting = true;
        this.deleteError = "";
        this.successMessage = "";

        try {
          await deletePageBlock(
            pageId,
            blockId
          );

          this.blocks = this.blocks.filter(
            (block) =>
              block.id !== Number(blockId)
          );

          this.successMessage =
            "Content block deleted successfully.";

          return true;
        } catch (error) {
          this.deleteError =
            getApiErrorMessage(
              error,
              "Unable to delete the content block."
            );

          return false;
        } finally {
          this.isDeleting = false;
        }
      },

      async moveBlock(
        pageId,
        blockId,
        direction
      ) {
        if (this.isReordering) {
          return false;
        }

        const currentIndex =
          this.blocks.findIndex(
            (block) =>
              block.id === Number(blockId)
          );

        const targetIndex =
          direction === "up"
            ? currentIndex - 1
            : currentIndex + 1;

        if (
          currentIndex < 0 ||
          targetIndex < 0 ||
          targetIndex >= this.blocks.length
        ) {
          return false;
        }

        const previousBlocks = [
          ...this.blocks
        ];

        const reordered = [
          ...this.blocks
        ];

        [
          reordered[currentIndex],
          reordered[targetIndex]
        ] = [
          reordered[targetIndex],
          reordered[currentIndex]
        ];

        const payload = reordered.map(
          (block, index) => ({
            id: block.id,
            position: index + 1
          })
        );

        this.blocks = reordered.map(
          (block, index) => ({
            ...block,
            position: index + 1
          })
        );

        this.isReordering = true;
        this.reorderError = "";
        this.successMessage = "";

        try {
          const savedBlocks =
            await reorderPageBlocks(
              pageId,
              payload
            );

          this.blocks = sortByPosition(
            savedBlocks
          );

          this.successMessage =
            "Block order updated successfully.";

          return true;
        } catch (error) {
          this.blocks = previousBlocks;

          this.reorderError =
            getApiErrorMessage(
              error,
              "Unable to update block order."
            );

          return false;
        } finally {
          this.isReordering = false;
        }
      },

      resetState() {
        this.blocks = [];
        this.loadError = "";
        this.saveError = "";
        this.validationErrors = {};
        this.deleteError = "";
        this.reorderError = "";
        this.successMessage = "";
      }
    }
  });