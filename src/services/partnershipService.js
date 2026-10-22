import { apiRequestWithToken, apiBaseUrl } from './apiClient';

export async function submitPartnershipApplication(formData, token) {
  try {
    const response = await fetch(`${apiBaseUrl}/partnership`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data.partnership;
  } catch (error) {
    console.error('Partnership submission error:', error);
    throw error;
  }
}

export async function getPartnershipApplications(token) {
  const data = await apiRequestWithToken('/partnership', token);
  return data.partnerships || [];
}

export async function getPartnershipApplication(token, id) {
  const data = await apiRequestWithToken(`/partnership/${id}`, token);
  return data.partnership;
}

export async function updatePartnershipStatus(token, id, updateData) {
  try {
    const response = await fetch(`${apiBaseUrl}/partnership/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data.partnership;
  } catch (error) {
    console.error('Partnership status update error:', error);
    throw error;
  }
}

export async function markPartnershipAsRead(token, id) {
  try {
    const response = await fetch(`${apiBaseUrl}/partnership/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data.partnership;
  } catch (error) {
    console.error('Partnership read error:', error);
    throw error;
  }
}

export async function deletePartnershipApplication(token, id) {
  try {
    const response = await fetch(`${apiBaseUrl}/partnership/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data.success;
  } catch (error) {
    console.error('Partnership deletion error:', error);
    throw error;
  }
}
