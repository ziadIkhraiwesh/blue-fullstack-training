const DEFAULT_API_BASE_URL =
  "https://jsonplaceholder.typicode.com";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  DEFAULT_API_BASE_URL
).replace(/\/$/, "");

const POSTS_API_URL = `${API_BASE_URL}/posts`;
const requestJson = async (url, options = {}) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json();
};

export const fetchPosts = async () => {
  const posts = await requestJson(POSTS_API_URL);

  return posts.slice(0, 9);
};

export const fetchPostById = async (postId) => {
  return requestJson(`${POSTS_API_URL}/${postId}`);
};

export const createPost = async (postData) => {
  return requestJson(POSTS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });
};