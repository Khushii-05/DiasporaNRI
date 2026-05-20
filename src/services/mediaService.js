import { apiRequest, apiRequestWithToken, apiRequestWithTokenMultipart } from './apiClient';

export async function getMedia() {
  const data = await apiRequest('/media');
  const items = data.media || [];
  return items.map(item => ({
    ...item,
    id: item.id || item._id
  }));
}

export async function addMedia(payload, file, token) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('type', payload.type || 'image');
  if (file) {
    formData.append('file', file);
  }

  const data = await apiRequestWithTokenMultipart('/media/admin', token, formData);
  return data.media;
}

export async function deleteMedia(id, token) {
  await apiRequestWithToken(`/media/admin/${id}`, token, { method: 'DELETE' });
}
