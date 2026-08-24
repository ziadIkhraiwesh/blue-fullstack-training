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
  createPost
} from "../services/postsApi";
import CreatePostView from "../views/CreatePostView.vue";

vi.mock("../services/postsApi", () => ({
  fetchPosts: vi.fn(),
  fetchPostById: vi.fn(),
  createPost: vi.fn()
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
  });

  it("blocks an empty submission and displays field errors", async () => {
    const wrapper = mountCreatePostView();

    await wrapper.get("form").trigger("submit");

    expect(wrapper.text()).toContain(
      "Title is required."
    );
    expect(wrapper.text()).toContain(
      "Post content is required."
    );
    expect(wrapper.text()).toContain(
      "User ID is required."
    );
    expect(createPost).not.toHaveBeenCalled();
  });

  it("shows the success state after a valid mocked submission", async () => {
    createPost.mockResolvedValue({
      id: 101,
      title: "Testing Vue form submission",
      body: "This is valid content for the mocked post request.",
      userId: 1
    });

    const wrapper = mountCreatePostView();

    await wrapper
      .get("#post-title")
      .setValue("Testing Vue form submission");

    await wrapper
      .get("#post-body")
      .setValue(
        "This is valid content for the mocked post request."
      );

    await wrapper
      .get("#post-user-id")
      .setValue("1");

    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(createPost).toHaveBeenCalledWith({
      title: "Testing Vue form submission",
      body: "This is valid content for the mocked post request.",
      userId: 1
    });

    expect(wrapper.text()).toContain(
      "Post created successfully"
    );
    expect(wrapper.text()).toContain("101");
  });
});