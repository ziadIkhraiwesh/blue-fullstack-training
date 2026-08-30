import axios from "axios";

export const AUTH_TOKEN_STORAGE_KEY = "nexatech-auth-token";

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
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getApiErrorMessage = (
    error,
    fallbackMessage = "Something went wrong."
) => {
    if (!error.response) {
        return "Unable to connect to the backend server.";
    }

    return error.response.data?.message || fallbackMessage;
};

export const getValidationErrors = (error) => {
    return error.response?.status === 422
        ? error.response.data?.errors || {}
        : {};
};

export default apiClient;