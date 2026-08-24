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
  userId: 1,
  title: "A reusable post card",
  body: "This is the body of the reusable post card."
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
  it("renders important post content", () => {
    const wrapper = mountPostCard();

    expect(wrapper.text()).toContain("Post 7");
    expect(wrapper.text()).toContain(
      "A reusable post card"
    );
    expect(wrapper.text()).toContain(
      "This is the body of the reusable post card."
    );
    expect(wrapper.text()).toContain("Read More");
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