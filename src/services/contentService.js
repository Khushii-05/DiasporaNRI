import { apiRequest, apiRequestWithToken } from './apiClient';

export async function getPageContent(page) {
  const data = await apiRequest(`/content?page=${encodeURIComponent(page)}`);
  const blocks = data.blocks || [];
  // Ensure each block has an id property
  return blocks.map(block => ({
    ...block,
    id: block._id || block.id
  }));
}

export async function getAdminPageContent(page, token) {
  const data = await apiRequestWithToken(`/content/admin?page=${encodeURIComponent(page)}`, token);
  const blocks = data.blocks || [];
  // Ensure each block has an id property for admin UI
  return blocks.map(block => ({
    ...block,
    id: block._id || block.id
  }));
}

export async function upsertContentBlock(payload, token) {
  const data = await apiRequestWithToken('/content/admin', token, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  // Ensure returned block has id property
  return {
    ...data.block,
    id: data.block._id || data.block.id
  };
}

export async function deleteContentBlock(id, token) {
  await apiRequestWithToken(`/content/admin/${id}`, token, {
    method: 'DELETE'
  });
}

export function mapBlocksToValues(blocks) {
  return blocks.reduce((acc, block) => {
    acc[block.key] = block.value;
    return acc;
  }, {});
}
