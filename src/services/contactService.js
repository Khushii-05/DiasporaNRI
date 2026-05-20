import { apiRequest, apiRequestWithToken } from './apiClient';

export async function submitContact(formData) {
  // formData is now FormData object with file, so don't stringify
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  
  try {
    const response = await fetch(`${apiBaseUrl}/contact`, {
      method: 'POST',
      body: formData // FormData - don't stringify, no Content-Type header
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    return data.submission;
  } catch (error) {
    console.error('Contact submission error:', error);
    throw error;
  }
}

export async function getContactSubmissions(token, filter = 'all') {
  const data = await apiRequestWithToken(`/contact/admin?filter=${encodeURIComponent(filter)}`, token);
  return data.submissions || [];
}

export async function updateContactRead(id, read, token) {
  const data = await apiRequestWithToken(`/contact/admin/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify({ read })
  });
  return data.submission;
}

export async function deleteContactSubmission(id, token) {
  await apiRequestWithToken(`/contact/admin/${id}`, token, {
    method: 'DELETE'
  });
}
