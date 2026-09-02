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
  fetchPublicPageBySlug
} from "../services/pagesApi";
import { usePagesStore } from "../stores/pages";

vi.mock("../services/pagesApi", () => ({
  fetchPublicPages: vi.fn(),
  fetchPublicPageBySlug: vi.fn(),
  fetchManagedPages: vi.fn(),
  fetchManagedPageById: vi.fn(),
  createPage: vi.fn(),
  updatePage: vi.fn(),
  deletePage: vi.fn()
}));

describe("pages store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("loads a published page dynamically by slug", async () => {
    fetchPublicPageBySlug.mockResolvedValue({
      id: 1,
      title: "About Us",
      slug: "about-us",
      content: "Dynamic page content.",
      status: "published",
      author: {
        id: 1,
        name: "Test User A"
      }
    });

    const store = usePagesStore();

    await store.loadPublicPage("about-us");

    expect(
      fetchPublicPageBySlug
    ).toHaveBeenCalledWith("about-us");

    expect(store.publicPage.title).toBe(
      "About Us"
    );
    expect(store.publicPageNotFound).toBe(
      false
    );
    expect(store.publicPageError).toBe("");
    expect(store.isPublicPageLoading).toBe(
      false
    );
  });

  it("sets the not-found state for a missing page", async () => {
    fetchPublicPageBySlug.mockRejectedValue({
      response: {
        status: 404
      }
    });

    const store = usePagesStore();

    await store.loadPublicPage(
      "missing-page"
    );

    expect(store.publicPage).toBeNull();
    expect(store.publicPageNotFound).toBe(
      true
    );
    expect(store.publicPageError).toBe("");
  });
});