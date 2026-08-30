import { defineStore } from "pinia";
import {
    fetchAuthenticatedUser,
    loginUser,
    logoutUser
} from "../services/authApi";
import {
    AUTH_TOKEN_STORAGE_KEY,
    getApiErrorMessage,
    getValidationErrors
} from "../services/apiClient";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "",
        user: null,
        isLoading: false,
        errorMessage: "",
        validationErrors: {}
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.token)
    },

    actions: {
        async login(credentials) {
            this.isLoading = true;
            this.errorMessage = "";
            this.validationErrors = {};

            try {
                const data = await loginUser(credentials);

                this.token = data.token;
                this.user = data.user;

                localStorage.setItem(
                    AUTH_TOKEN_STORAGE_KEY,
                    data.token
                );

                return true;
            } catch (error) {
                this.validationErrors = getValidationErrors(error);
                this.errorMessage = getApiErrorMessage(
                    error,
                    "Unable to log in."
                );

                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async restoreAuthentication() {
            if (!this.token) {
                return;
            }

            this.isLoading = true;
            this.errorMessage = "";

            try {
                this.user = await fetchAuthenticatedUser();
            } catch {
                this.clearAuthentication();
            } finally {
                this.isLoading = false;
            }
        },

        async logout() {
            this.isLoading = true;
            this.errorMessage = "";

            try {
                await logoutUser();
            } catch (error) {
                this.errorMessage = getApiErrorMessage(
                    error,
                    "Unable to log out."
                );
            } finally {
                this.clearAuthentication();
                this.isLoading = false;
            }
        },

        clearAuthentication() {
            this.token = "";
            this.user = null;
            this.validationErrors = {};

            localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        }
    }
});