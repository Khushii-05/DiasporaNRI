import { apiRequest, apiRequestWithToken, apiRequestWithTokenMultipart } from './apiClient';

export async function getAchievements() {
  const data = await apiRequest('/achievements');
  const items = data.achievements || [];
  return items.map(item => ({
    ...item,
    id: item.id || item._id
  }));
}

export async function addAchievement(payload, file, token) {
  const formData = new FormData();
  formData.append('title', payload.title);
  formData.append('description', payload.description);
  formData.append('date', payload.date);
  if (file) {
    formData.append('file', file);
  }

  const data = await apiRequestWithTokenMultipart('/achievements/admin', token, formData);
  return data.achievement;
}

export async function deleteAchievement(id, token) {
  await apiRequestWithToken(`/achievements/admin/${id}`, token, { method: 'DELETE' });
}
