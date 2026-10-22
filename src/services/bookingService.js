import { apiRequestWithToken } from './apiClient';

export async function createBooking(bookingData, token) {
  const data = await apiRequestWithToken('/booking', token, {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
  return data.booking;
}

export async function getMyBookings(token) {
  const data = await apiRequestWithToken('/booking/my-bookings', token);
  return data.bookings || [];
}

export async function getBooking(id, token) {
  const data = await apiRequestWithToken(`/booking/${id}`, token);
  return data.booking;
}

export async function cancelBooking(id, token) {
  const data = await apiRequestWithToken(`/booking/${id}/cancel`, token, {
    method: 'PATCH'
  });
  return data.booking;
}

export async function getAllBookings(token, filter = 'all') {
  const data = await apiRequestWithToken(`/booking/admin/all?filter=${encodeURIComponent(filter)}`, token);
  return data.bookings || [];
}

export async function updateBooking(id, updates, token) {
  const data = await apiRequestWithToken(`/booking/admin/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(updates)
  });
  return data.booking;
}

export async function deleteBooking(id, token) {
  await apiRequestWithToken(`/booking/admin/${id}`, token, {
    method: 'DELETE'
  });
}
