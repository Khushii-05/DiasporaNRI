import { apiRequest, apiRequestWithToken } from './apiClient';

export async function getAnnouncements() {
  const data = await apiRequest('/announcements');
  return data.announcements || [];
}

export async function getAdminAnnouncements(token) {
  const data = await apiRequestWithToken('/announcements/admin', token);
  return data.announcements || [];
}

export async function createAnnouncement(text, token) {
  const data = await apiRequestWithToken('/announcements/admin', token, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
  return data.announcement;
}

export async function deleteAnnouncement(id, token) {
  await apiRequestWithToken(`/announcements/admin/${id}`, token, { method: 'DELETE' });
}
