import { apiRequestWithToken } from './apiClient';

export const createBackup = async (backupName, description, token) => {
  if (!token) throw new Error('No auth token found');
  try {
    const response = await apiRequestWithToken('/content/admin/backup', token, {
      method: 'POST',
      body: JSON.stringify({
        backupName,
        description
      })
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to create backup');
  }
};

export const getBackups = async (token) => {
  if (!token) throw new Error('No auth token found');
  try {
    const response = await apiRequestWithToken('/content/admin/backups', token);
    return response.backups || [];
  } catch (error) {
    throw new Error(error.message || 'Failed to load backups');
  }
};

export const restoreBackup = async (backupId, token) => {
  if (!token) throw new Error('No auth token found');
  try {
    const response = await apiRequestWithToken(`/content/admin/restore/${backupId}`, token, {
      method: 'POST',
      body: JSON.stringify({})
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to restore backup');
  }
};

export const deleteBackup = async (backupId, token) => {
  if (!token) throw new Error('No auth token found');
  try {
    const response = await apiRequestWithToken(`/content/admin/backups/${backupId}`, token, {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete backup');
  }
};
