const API_BASE_URL = process.env.REACT_APP_API_URL || `${window.location.origin}/api`;
const SESSION_KEY = 'schoolTransportSession';

const parseJson = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
};

const buildHeaders = (token, extra = {}) => {
  const headers = { ...extra };

  if (!(extra instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const apiRequest = async (path, options = {}) => {
  const token = options.token || getSession()?.token;
  const headers = buildHeaders(token, options.headers || {});

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseJson(response);
};

export const saveSession = (session) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const registerUser = (payload) =>
  apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchMe = () => apiRequest('/auth/me');
export const fetchStudents = () => apiRequest('/students');
export const fetchMyChildren = () => apiRequest('/students/my-child');
export const deleteStudent = (studentId) => apiRequest(`/students/${studentId}`, { method: 'DELETE' });
export const fetchRoutes = () => apiRequest('/routes');
export const fetchAssignedRoute = () => apiRequest('/routes/assigned/me');
export const fetchAttendance = (query = '') => apiRequest(`/attendance${query}`);
export const markParentAttendance = (payload) => apiRequest('/attendance/parent-mark', { method: 'POST', body: JSON.stringify(payload) });
export const updateDriverAttendance = (attendanceId, payload) => apiRequest(`/attendance/${attendanceId}/driver-status`, { method: 'PATCH', body: JSON.stringify(payload) });
export const fetchPayments = (query = '') => apiRequest(`/payments${query}`);
export const payPayment = (paymentId, payload = {}) => apiRequest(`/payments/${paymentId}/pay`, { method: 'PATCH', body: JSON.stringify(payload) });
export const fetchNotifications = () => apiRequest('/notifications/me');
export const markNotificationRead = (notificationId) => apiRequest(`/notifications/${notificationId}/read`, { method: 'PATCH' });
export const fetchLatestLocation = (driverId) => apiRequest(`/tracking/location/${driverId}`);
export const fetchParentReport = (studentId, month, year) => apiRequest(`/reports/parent/monthly/${studentId}?month=${month}&year=${year}`);
export const fetchAdminReport = (month, year) => apiRequest(`/reports/admin/monthly?month=${month}&year=${year}`);
export const fetchUsers = (role) => apiRequest(`/users${role ? `?role=${role}` : ''}`);
export const deleteUser = (userId) => apiRequest(`/users/${userId}`, { method: 'DELETE' });
