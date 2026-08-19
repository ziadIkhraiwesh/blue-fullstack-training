import { ref } from "vue";

const POSTS_API_BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const requestJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    const requestError = new Error(
      `Request failed with status ${response.status}`
    );

    requestError.status = response.status;
    throw requestError;
  }

  return response.json();
};

export const usePosts = () => {
  const posts = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const loadPosts = async () => {
    isLoading.value = true;
    errorMessage.value = "";
    posts.value = [];

    try {
      const data = await requestJson(POSTS_API_BASE_URL);

      posts.value = Array.isArray(data)
        ? data.slice(0, 9)
        : [];
    } catch (error) {
      errorMessage.value =
        "We could not load the latest posts. Please try again.";
    } finally {
      isLoading.value = false;
    }
  };

  return {
    posts,
    isLoading,
    errorMessage,
    loadPosts
  };
};

export const usePost = () => {
  const post = ref(null);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const isNotFound = ref(false);

  const loadPost = async (postId) => {
    const normalizedId = Number(postId);

    post.value = null;
    errorMessage.value = "";
    isNotFound.value = false;

    if (
      !Number.isInteger(normalizedId) ||
      normalizedId < 1 ||
      normalizedId > 100
    ) {
      isNotFound.value = true;
      return;
    }

    isLoading.value = true;

    try {
      post.value = await requestJson(
        `${POSTS_API_BASE_URL}/${normalizedId}`
      );
    } catch (error) {
      if (error.status === 404) {
        isNotFound.value = true;
      } else {
        errorMessage.value =
          "We could not load this post. Please try again.";
      }
    } finally {
      isLoading.value = false;
    }
  };

  return {
    post,
    isLoading,
    errorMessage,
    isNotFound,
    loadPost
  };
};