import axios from "axios";

export const AUTH_TOKEN_STORAGE_KEY =
    "nexatech-auth-token";

export const AUTH_UNAUTHORIZED_EVENT =
    "nexatech:unauthorized";

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(
        AUTH_TOKEN_STORAGE_KEY
    );

    if (token) {
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,

    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(
                AUTH_TOKEN_STORAGE_KEY
            );

            if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent(
                        AUTH_UNAUTHORIZED_EVENT,
                        {
                            detail: {
                                message:
                                    "Your session has expired. Please log in again."
                            }
                        }
                    )
                );
            }
        }

        return Promise.reject(error);
    }
);

export const getApiErrorMessage = (
    error,
    fallbackMessage = "Something went wrong."
) => {
    if (!error.response) {
        return "Unable to connect to the backend server.";
    }

    const status = error.response.status;

    if (status === 401) {
        return "Your session has expired. Please log in again.";
    }

    if (status === 403) {
        return "You are not allowed to perform this action.";
    }

    if (status === 404) {
        return "The requested resource could not be found.";
    }

    if (status >= 500) {
        return "The server encountered an error. Please try again later.";
    }

    return (
        error.response.data?.message ||
        fallbackMessage
    );
};

export const getValidationErrors = (error) => {
    return error.response?.status === 422
        ? error.response.data?.errors || {}
        : {};
};

export default apiClient;