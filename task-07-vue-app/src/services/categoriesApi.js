import apiClient from "./apiClient";

export const fetchCategories = async () => {
    const response = await apiClient.get("/categories");

    return response.data.data;
};