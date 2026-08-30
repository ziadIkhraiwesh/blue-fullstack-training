import apiClient from "./apiClient";

export const fetchPosts = async (params = {}) => {
    const response = await apiClient.get("/posts", {
        params
    });

    return response.data;
};

export const fetchPostById = async (postId) => {
    const response = await apiClient.get(`/posts/${postId}`);

    return response.data.data;
};

export const fetchCategories = async () => {
    const response = await apiClient.get("/categories");

    return response.data.data;
};

export const createPost = async (postData) => {
    const response = await apiClient.post("/posts", postData);

    return response.data.data;
};

export const updatePost = async (postId, postData) => {
    const response = await apiClient.put(
        `/posts/${postId}`,
        postData
    );

    return response.data.data;
};

export const deletePost = async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}`);

    return response.data;
};