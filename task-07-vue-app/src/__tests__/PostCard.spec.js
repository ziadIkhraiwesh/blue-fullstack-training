import {
  describe,
  expect,
  it
} from "vitest";
import {
  mount,
  RouterLinkStub
} from "@vue/test-utils";

import PostCard from "../components/PostCard.vue";

const testPost = {
  id: 7,
  title: "A Laravel post card",
  body: "This post was loaded from the Laravel REST API.",
  status: "published",
  category: {
    id: 1,
    name: "Technology"
  },
  author: {
    id: 1,
    name: "Test User A"
  }
};

const mountPostCard = (isFavorite = false) =>
  mount(PostCard, {
    props: {
      post: testPost,
      isFavorite
    },

    global: {
      stubs: {
        RouterLink: RouterLinkStub
      }
    }
  });

describe("PostCard", () => {
  it("renders Laravel post content", () => {
    const wrapper = mountPostCard();

    expect(wrapper.text()).toContain("Post 7");
    expect(wrapper.text()).toContain(
      "A Laravel post card"
    );
    expect(wrapper.text()).toContain(
      "This post was loaded from the Laravel REST API."
    );
    expect(wrapper.text()).toContain("published");
    expect(wrapper.text()).toContain("Technology");
    expect(wrapper.text()).toContain("Test User A");
    expect(wrapper.text()).toContain("View Details");
  });

  it("emits the post ID when the favorite button is clicked", async () => {
    const wrapper = mountPostCard();

    await wrapper
      .get(".favorite-button")
      .trigger("click");

    expect(wrapper.emitted("toggle-favorite")).toEqual([
      [7]
    ]);
  });
});