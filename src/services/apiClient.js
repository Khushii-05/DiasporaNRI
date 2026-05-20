const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      message = data.error || message;
    } catch (error) {
      // Ignore JSON parse failures
    }
    throw new Error(message);
  }

  return response.json();
}

export async function apiRequestWithToken(path, token, options = {}) {
  return apiRequest(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}

export async function apiRequestWithTokenMultipart(path, token, formData) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      message = data.error || message;
    } catch (error) {
      // Ignore JSON parse failures
    }
    throw new Error(message);
  }

  return response.json();
}
