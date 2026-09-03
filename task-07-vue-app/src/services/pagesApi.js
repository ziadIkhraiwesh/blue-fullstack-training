import apiClient from "./apiClient";

export const fetchPublicPages = async () => {
  const response = await apiClient.get("/pages");

  return response.data;
};

export const fetchPublicPageBySlug = async (
  slug
) => {
  const response = await apiClient.get(
    `/pages/${encodeURIComponent(slug)}`
  );

  return response.data.data;
};

export const fetchManagedPages = async () => {
  const response = await apiClient.get(
    "/manage/pages"
  );

  return response.data;
};

export const fetchManagedPageById = async (
  pageId
) => {
  const response = await apiClient.get(
    `/manage/pages/${pageId}`
  );

  return response.data.data;
};

export const createPage = async (pageData) => {
  const response = await apiClient.post(
    "/manage/pages",
    pageData
  );

  return response.data.data;
};

export const updatePage = async (
  pageId,
  pageData
) => {
  const response = await apiClient.put(
    `/manage/pages/${pageId}`,
    pageData
  );

  return response.data.data;
};

export const deletePage = async (pageId) => {
  const response = await apiClient.delete(
    `/manage/pages/${pageId}`
  );

  return response.data;
};
export const fetchPageBlocks = async (
  pageId
) => {
  const response = await apiClient.get(
    `/manage/pages/${pageId}/blocks`
  );

  return response.data.data;
};

export const createPageBlock = async (
  pageId,
  blockData
) => {
  const response = await apiClient.post(
    `/manage/pages/${pageId}/blocks`,
    blockData
  );

  return response.data;
};

export const updatePageBlock = async (
  pageId,
  blockId,
  blockData
) => {
  const response = await apiClient.put(
    `/manage/pages/${pageId}/blocks/${blockId}`,
    blockData
  );

  return response.data;
};

export const deletePageBlock = async (
  pageId,
  blockId
) => {
  const response = await apiClient.delete(
    `/manage/pages/${pageId}/blocks/${blockId}`
  );

  return response.data;
};

export const reorderPageBlocks = async (
  pageId,
  blocks
) => {
  const response = await apiClient.put(
    `/manage/pages/${pageId}/blocks/reorder`,
    {
      blocks
    }
  );

  return response.data.data;
};
