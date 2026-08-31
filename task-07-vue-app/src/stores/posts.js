import { defineStore } from "pinia";
import {
    createPost,
    deletePost,
    fetchPostById,
    fetchPosts,
    updatePost
} from "../services/postsApi";
import {
    fetchCategories
} from "../services/categoriesApi";
import {
    getApiErrorMessage,
    getValidationErrors
} from "../services/apiClient";

const FAVORITES_STORAGE_KEY = "nexatech-favorite-post-ids";

export const usePostsStore = defineStore("posts", {
    state: () => ({
        posts: [],
        isLoading: false,
        errorMessage: "",

        filters: {
            search: "",
            status: "",
            category_id: "",
            sort_by: "created_at",
            sort_direction: "desc"
        },

        pagination: {
            currentPage: 1,
            lastPage: 1,
            perPage: 5,
            total: 0
        },

        categories: [],
        isCategoriesLoading: false,
        categoriesError: "",

        currentPost: null,
        isPostLoading: false,
        postErrorMessage: "",

        favoritePostIds: [],

        isSubmitting: false,
        submitError: "",
        validationErrors: {},
        createdPost: null,

        isUpdating: false,
        updateError: "",
        updateValidationErrors: {},

        isDeleting: false,
        deleteError: "",
        operationMessage: ""
    }),

    getters: {
        favoriteCount: (state) =>
            state.favoritePostIds.length,

        favoritePosts: (state) =>
            state.posts.filter((post) =>
                state.favoritePostIds.includes(post.id)
            ),

        isFavorite: (state) => (postId) =>
            state.favoritePostIds.includes(Number(postId))
    },

    actions: {
        async loadPosts(options = {}) {
            if (this.isLoading) {
                return;
            }

            const page =
                Number(options.page) ||
                this.pagination.currentPage ||
                1;

            const updatedFilters = {
                ...this.filters,
                ...options
            };

            delete updatedFilters.page;

            this.filters = updatedFilters;
            this.isLoading = true;
            this.errorMessage = "";

            const params = {
                page,
                per_page: this.pagination.perPage,
                search: this.filters.search || undefined,
                status: this.filters.status || undefined,
                category_id:
                    this.filters.category_id || undefined,
                sort_by: this.filters.sort_by,
                sort_direction: this.filters.sort_direction
            };

            try {
                const response = await fetchPosts(params);

                this.posts = response.data || [];

                this.pagination = {
                    currentPage:
                        response.meta?.current_page || page,
                    lastPage:
                        response.meta?.last_page || 1,
                    perPage:
                        response.meta?.per_page ||
                        this.pagination.perPage,
                    total:
                        response.meta?.total ||
                        this.posts.length
                };
            } catch (error) {
                this.errorMessage = getApiErrorMessage(
                    error,
                    "Unable to load posts."
                );
            } finally {
                this.isLoading = false;
            }
        },

        async retryLoadPosts() {
            await this.loadPosts({
                page: this.pagination.currentPage
            });
        },

        async loadCategories() {
            if (
                this.isCategoriesLoading ||
                this.categories.length > 0
            ) {
                return;
            }

            this.isCategoriesLoading = true;
            this.categoriesError = "";

            try {
                this.categories = await fetchCategories();
            } catch (error) {
                this.categoriesError = getApiErrorMessage(
                    error,
                    "Unable to load categories."
                );
            } finally {
                this.isCategoriesLoading = false;
            }
        },

        async loadFavoritePosts() {
            const missingFavoriteIds =
                this.favoritePostIds.filter(
                    (favoriteId) =>
                        !this.posts.some(
                            (post) => post.id === favoriteId
                        )
                );

            if (missingFavoriteIds.length === 0) {
                return;
            }

            this.isLoading = true;
            this.errorMessage = "";

            try {
                const missingPosts = await Promise.all(
                    missingFavoriteIds.map((postId) =>
                        fetchPostById(postId)
                    )
                );

                missingPosts.forEach((post) => {
                    if (
                        !this.posts.some(
                            (item) => item.id === post.id
                        )
                    ) {
                        this.posts.push(post);
                    }
                });
            } catch (error) {
                this.errorMessage = getApiErrorMessage(
                    error,
                    "Unable to load favorite posts."
                );
            } finally {
                this.isLoading = false;
            }
        },

        async loadPostById(postId) {
            const numericPostId = Number(postId);

            this.currentPost = null;
            this.postErrorMessage = "";

            if (
                !Number.isInteger(numericPostId) ||
                numericPostId <= 0
            ) {
                this.postErrorMessage =
                    "The requested post could not be found.";
                return;
            }

            this.isPostLoading = true;

            try {
                this.currentPost =
                    await fetchPostById(numericPostId);
            } catch (error) {
                this.postErrorMessage =
                    error.response?.status === 404
                        ? "The requested post could not be found."
                        : getApiErrorMessage(
                            error,
                            "Unable to load the requested post."
                        );
            } finally {
                this.isPostLoading = false;
            }
        },

        async submitPost(postData) {
            if (this.isSubmitting) {
                return null;
            }

            this.isSubmitting = true;
            this.submitError = "";
            this.validationErrors = {};
            this.createdPost = null;
            this.operationMessage = "";

            try {
                this.createdPost =
                    await createPost(postData);

                this.operationMessage =
                    "Post created successfully.";

                await this.loadPosts({
                    page: 1
                });

                return this.createdPost;
            } catch (error) {
                this.validationErrors =
                    getValidationErrors(error);

                this.submitError = getApiErrorMessage(
                    error,
                    "Unable to create the post."
                );

                return null;
            } finally {
                this.isSubmitting = false;
            }
        },

        async updateExistingPost(postId, postData) {
            if (this.isUpdating) {
                return null;
            }

            this.isUpdating = true;
            this.updateError = "";
            this.updateValidationErrors = {};
            this.operationMessage = "";

            try {
                const updatedPost = await updatePost(
                    postId,
                    postData
                );

                const postIndex = this.posts.findIndex(
                    (post) => post.id === updatedPost.id
                );

                if (postIndex !== -1) {
                    this.posts[postIndex] = updatedPost;
                }

                this.currentPost = updatedPost;
                this.operationMessage =
                    "Post updated successfully.";

                return updatedPost;
            } catch (error) {
                this.updateValidationErrors =
                    getValidationErrors(error);

                this.updateError =
                    error.response?.status === 403
                        ? "You are not allowed to update this post."
                        : getApiErrorMessage(
                            error,
                            "Unable to update the post."
                        );

                return null;
            } finally {
                this.isUpdating = false;
            }
        },

        async removePost(postId) {
            if (this.isDeleting) {
                return false;
            }

            this.isDeleting = true;
            this.deleteError = "";
            this.operationMessage = "";

            try {
                await deletePost(postId);

                this.posts = this.posts.filter(
                    (post) => post.id !== Number(postId)
                );

                this.favoritePostIds =
                    this.favoritePostIds.filter(
                        (id) => id !== Number(postId)
                    );

                this.saveFavorites();

                if (
                    this.currentPost?.id === Number(postId)
                ) {
                    this.currentPost = null;
                }

                this.operationMessage =
                    "Post deleted successfully.";

                const targetPage =
                    this.posts.length === 0 &&
                    this.pagination.currentPage > 1
                        ? this.pagination.currentPage - 1
                        : this.pagination.currentPage;

                await this.loadPosts({
                    page: targetPage
                });

                return true;
            } catch (error) {
                this.deleteError =
                    error.response?.status === 403
                        ? "You are not allowed to delete this post."
                        : getApiErrorMessage(
                            error,
                            "Unable to delete the post."
                        );

                return false;
            } finally {
                this.isDeleting = false;
            }
        },

        restoreFavorites() {
            try {
                const savedFavorites = JSON.parse(
                    localStorage.getItem(
                        FAVORITES_STORAGE_KEY
                    ) || "[]"
                );

                this.favoritePostIds =
                    Array.isArray(savedFavorites)
                        ? savedFavorites
                            .map(Number)
                            .filter(
                                (id) =>
                                    Number.isInteger(id) &&
                                    id > 0
                            )
                        : [];
            } catch {
                this.favoritePostIds = [];
            }
        },

        saveFavorites() {
            localStorage.setItem(
                FAVORITES_STORAGE_KEY,
                JSON.stringify(this.favoritePostIds)
            );
        },

        toggleFavorite(postId) {
            const numericPostId = Number(postId);

            if (
                !Number.isInteger(numericPostId) ||
                numericPostId <= 0
            ) {
                return;
            }

            const favoriteIndex =
                this.favoritePostIds.indexOf(numericPostId);

            if (favoriteIndex === -1) {
                this.favoritePostIds.push(numericPostId);
            } else {
                this.favoritePostIds.splice(
                    favoriteIndex,
                    1
                );
            }

            this.saveFavorites();
        },

        resetSubmission() {
            this.submitError = "";
            this.validationErrors = {};
            this.createdPost = null;
            this.operationMessage = "";
        }
    }
});