import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  createPinia,
  setActivePinia
} from "pinia";

import {
  deletePost,
  fetchPosts,
  updatePost
} from "../services/postsApi";
import { usePostsStore } from "../stores/posts";

vi.mock("../services/postsApi", () => ({
  fetchPosts: vi.fn(),
  fetchPostById: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn()
}));
vi.mock("../services/categoriesApi", () => ({
  fetchCategories: vi.fn()
}));

describe("posts store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("adds and removes a favorite post", () => {
    const store = usePostsStore();

    store.toggleFavorite(1);

    expect(store.favoritePostIds).toEqual([1]);
    expect(store.favoriteCount).toBe(1);
    expect(store.isFavorite(1)).toBe(true);

    store.toggleFavorite(1);

    expect(store.favoritePostIds).toEqual([]);
    expect(store.favoriteCount).toBe(0);
    expect(store.isFavorite(1)).toBe(false);
  });

  it("restores favorite post IDs from localStorage", () => {
    localStorage.setItem(
      "nexatech-favorite-post-ids",
      JSON.stringify([2, 5])
    );

    const store = usePostsStore();

    store.restoreFavorites();

    expect(store.favoritePostIds).toEqual([2, 5]);
    expect(store.favoriteCount).toBe(2);
  });

  it("loads paginated posts from the Laravel API service", async () => {
    fetchPosts.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "First Laravel test post",
          body: "Test post content",
          status: "published",
          category: {
            id: 1,
            name: "Technology"
          },
          author: {
            id: 1,
            name: "Test User A"
          }
        }
      ],
      meta: {
        current_page: 1,
        last_page: 2,
        per_page: 5,
        total: 6
      }
    });

    const store = usePostsStore();

    await store.loadPosts();

    expect(fetchPosts).toHaveBeenCalledTimes(1);
    expect(store.posts).toHaveLength(1);
    expect(store.posts[0].title).toBe(
      "First Laravel test post"
    );
    expect(store.pagination.currentPage).toBe(1);
    expect(store.pagination.lastPage).toBe(2);
    expect(store.pagination.total).toBe(6);
    expect(store.isLoading).toBe(false);
    expect(store.errorMessage).toBe("");
  });
  it("updates the post in Pinia state after a successful API response", async () => {
  updatePost.mockResolvedValue({
    id: 1,
    title: "Updated Task 17 Post",
    body: "Updated post content",
    status: "draft",
    category: {
      id: 1,
      name: "Technology"
    },
    author: {
      id: 1,
      name: "Test User A"
    }
  });

  const store = usePostsStore();

  store.posts = [
    {
      id: 1,
      title: "Original Post",
      body: "Original content",
      status: "published"
    }
  ];

  const updatedPost =
    await store.updateExistingPost(1, {
      title: "Updated Task 17 Post",
      body: "Updated post content",
      status: "draft",
      category_id: 1
    });

  expect(updatePost).toHaveBeenCalledWith(1, {
    title: "Updated Task 17 Post",
    body: "Updated post content",
    status: "draft",
    category_id: 1
  });

  expect(updatedPost.title).toBe(
    "Updated Task 17 Post"
  );
  expect(store.posts[0].title).toBe(
    "Updated Task 17 Post"
  );
  expect(store.currentPost.id).toBe(1);
  expect(store.operationMessage).toBe(
    "Post updated successfully."
  );
});

it("removes the deleted post and favorite ID from Pinia state", async () => {
  deletePost.mockResolvedValue({
    status: "success"
  });

  fetchPosts.mockResolvedValue({
    data: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 5,
      total: 0
    }
  });

  const store = usePostsStore();

  store.posts = [
    {
      id: 1,
      title: "Post to Delete"
    }
  ];
  store.currentPost = store.posts[0];
  store.favoritePostIds = [1];

  const wasDeleted = await store.removePost(1);

  expect(deletePost).toHaveBeenCalledWith(1);
  expect(wasDeleted).toBe(true);
  expect(store.posts).toEqual([]);
  expect(store.currentPost).toBeNull();
  expect(store.favoritePostIds).toEqual([]);
  expect(store.operationMessage).toBe(
    "Post deleted successfully."
  );
});
});