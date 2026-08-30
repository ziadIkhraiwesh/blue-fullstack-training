import apiClient from "./apiClient";

export const loginUser = async (credentials) => {
    const response = await apiClient.post("/login", credentials);

    return response.data.data;
};

export const fetchAuthenticatedUser = async () => {
    const response = await apiClient.get("/me");

    return response.data.data.user;
};

export const logoutUser = async () => {
    const response = await apiClient.post("/logout");

    return response.data;
};