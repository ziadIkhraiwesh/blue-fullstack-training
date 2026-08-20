import { defineStore } from "pinia";
import {
    createPost,
    fetchPostById,
    fetchPosts
} from "../services/postsApi";

const FAVORITES_STORAGE_KEY = "nexatech-favorite-post-ids";

export const usePostsStore = defineStore("posts", {
    state: () => ({
        posts: [],
        isLoading: false,
        errorMessage: "",

        currentPost: null,
        isPostLoading: false,
        postErrorMessage: "",

        favoritePostIds: [],

        isSubmitting: false,
        submitError: "",
        createdPost: null
    }),

    getters: {
        favoriteCount: (state) => state.favoritePostIds.length,

        favoritePosts: (state) =>
            state.posts.filter((post) =>
                state.favoritePostIds.includes(post.id)
            ),

        isFavorite: (state) => (postId) =>
            state.favoritePostIds.includes(Number(postId))
    },

    actions: {
        async loadPosts() {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;
            this.errorMessage = "";

            try {
                this.posts = await fetchPosts();
            } catch (error) {
                this.errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unable to load posts.";
            } finally {
                this.isLoading = false;
            }
        },

        async retryLoadPosts() {
            await this.loadPosts();
        },
        async loadFavoritePosts() {
            if (this.posts.length === 0) {
                await this.loadPosts();
            }

            const missingFavoriteIds = this.favoritePostIds.filter(
                (favoriteId) =>
                    !this.posts.some((post) => post.id === favoriteId)
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
                    if (!this.posts.some((item) => item.id === post.id)) {
                        this.posts.push(post);
                    }
                });
            } catch (error) {
                this.errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unable to load favorite posts.";
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
                numericPostId <= 0 ||
                numericPostId > 100
            ) {
                this.postErrorMessage = "The requested post could not be found.";
                return;
            }

            const existingPost = this.posts.find(
                (post) => post.id === numericPostId
            );

            if (existingPost) {
                this.currentPost = existingPost;
                return;
            }

            this.isPostLoading = true;

            try {
                const post = await fetchPostById(numericPostId);
                this.currentPost = post;

                if (!this.posts.some((item) => item.id === post.id)) {
                    this.posts.push(post);
                }
            } catch (error) {
                this.postErrorMessage =
                    error instanceof Error
                        ? error.message
                        : "Unable to load the requested post.";
            } finally {
                this.isPostLoading = false;
            }
        },

        restoreFavorites() {
            try {
                const savedFavorites = JSON.parse(
                    localStorage.getItem(FAVORITES_STORAGE_KEY) || "[]"
                );

                this.favoritePostIds = Array.isArray(savedFavorites)
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

            if (!Number.isInteger(numericPostId) || numericPostId <= 0) {
                return;
            }

            const favoriteIndex =
                this.favoritePostIds.indexOf(numericPostId);

            if (favoriteIndex === -1) {
                this.favoritePostIds.push(numericPostId);
            } else {
                this.favoritePostIds.splice(favoriteIndex, 1);
            }

            this.saveFavorites();
        },

        async submitPost(postData) {
            if (this.isSubmitting) {
                return null;
            }

            this.isSubmitting = true;
            this.submitError = "";
            this.createdPost = null;

            try {
                this.createdPost = await createPost(postData);
                return this.createdPost;
            } catch (error) {
                this.submitError =
                    error instanceof Error
                        ? error.message
                        : "Unable to create the post.";

                return null;
            } finally {
                this.isSubmitting = false;
            }
        },

        resetSubmission() {
            this.submitError = "";
            this.createdPost = null;
        }
    }
});