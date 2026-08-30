import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from "vitest";
import {
  flushPromises,
  mount
} from "@vue/test-utils";
import { createPinia } from "pinia";

import {
  createPost,
  fetchCategories,
  fetchPosts
} from "../services/postsApi";
import CreatePostView from "../views/CreatePostView.vue";

vi.mock("../services/postsApi", () => ({
  fetchPosts: vi.fn(),
  fetchPostById: vi.fn(),
  fetchCategories: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn()
}));

const mountCreatePostView = () => {
  const pinia = createPinia();

  return mount(CreatePostView, {
    global: {
      plugins: [pinia]
    }
  });
};

describe("CreatePostView", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fetchCategories.mockResolvedValue([
      {
        id: 1,
        name: "Technology",
        slug: "technology"
      }
    ]);

    fetchPosts.mockResolvedValue({
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 5,
        total: 0
      }
    });
  });

  it("displays Laravel validation errors", async () => {
    createPost.mockRejectedValue({
      response: {
        status: 422,
        data: {
          message:
            "The title field is required. (and 2 more errors)",
          errors: {
            title: [
              "The title field is required."
            ],
            body: [
              "The body field is required."
            ],
            category_id: [
              "The category id field is required."
            ]
          }
        }
      }
    });

    const wrapper = mountCreatePostView();

    await flushPromises();
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(createPost).toHaveBeenCalledWith({
      title: "",
      body: "",
      status: "draft",
      category_id: null
    });

    expect(wrapper.text()).toContain(
      "The title field is required."
    );
    expect(wrapper.text()).toContain(
      "The body field is required."
    );
    expect(wrapper.text()).toContain(
      "The category id field is required."
    );
  });

  it("shows success after a Laravel post is created", async () => {
    createPost.mockResolvedValue({
      id: 101,
      title: "Testing Laravel form submission",
      body:
        "This content is persisted through the Laravel API.",
      status: "published",
      category: {
        id: 1,
        name: "Technology"
      },
      author: {
        id: 1,
        name: "Test User A"
      }
    });

    const wrapper = mountCreatePostView();

    await flushPromises();

    await wrapper
      .get("#post-title")
      .setValue("Testing Laravel form submission");

    await wrapper
      .get("#post-body")
      .setValue(
        "This content is persisted through the Laravel API."
      );

    await wrapper
      .get("#post-status")
      .setValue("published");

    await wrapper
      .get("#post-category")
      .setValue("1");

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(createPost).toHaveBeenCalledWith({
      title: "Testing Laravel form submission",
      body:
        "This content is persisted through the Laravel API.",
      status: "published",
      category_id: 1
    });

    expect(wrapper.text()).toContain(
      "Post created successfully"
    );
    expect(wrapper.text()).toContain("101");
    expect(wrapper.text()).toContain("Test User A");
    expect(wrapper.text()).toContain("Technology");
  });
});