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
  fetchPosts
} from "../services/postsApi";
import { usePostsStore } from "../stores/posts";

vi.mock("../services/postsApi", () => ({
  fetchPosts: vi.fn(),
  fetchPostById: vi.fn(),
  createPost: vi.fn()
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

  it("loads posts through the mocked API service", async () => {
    fetchPosts.mockResolvedValue([
      {
        id: 1,
        userId: 1,
        title: "First test post",
        body: "Test post content"
      }
    ]);

    const store = usePostsStore();

    await store.loadPosts();

    expect(fetchPosts).toHaveBeenCalledTimes(1);
    expect(store.posts).toHaveLength(1);
    expect(store.posts[0].title).toBe("First test post");
    expect(store.isLoading).toBe(false);
    expect(store.errorMessage).toBe("");
  });
});