import axios, { type AxiosError } from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  UpdateProfileRequest,
  FileMetadata,
  Page,
  ApiError,
} from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const apiClient = axios.create({
  baseURL: BASE_URL || undefined,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth token injection ─────────────────────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Error normalisation ──────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiError>) => {
    // Only auto-redirect on 401 for non-auth endpoints (token expiry)
    const url = err.config?.url ?? '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    if (err.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/api/v1/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<User>('/api/v1/auth/register', data).then((r) => r.data),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  me: () => apiClient.get<User>('/api/v1/users/me').then((r) => r.data),

  updateMe: (data: UpdateProfileRequest) =>
    apiClient.put<User>('/api/v1/users/me', data).then((r) => r.data),

  deleteMe: () => apiClient.delete('/api/v1/users/me'),

  getById: (id: string) =>
    apiClient.get<User>(`/api/v1/users/${id}`).then((r) => r.data),

  list: (page = 0, size = 20) =>
    apiClient
      .get<Page<User>>('/api/v1/users', { params: { page, size } })
      .then((r) => r.data),
};

// ─── Files ────────────────────────────────────────────────────────────────────

export const filesApi = {
  upload: (file: File, onProgress?: (pct: number) => void) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient
      .post<FileMetadata>('/api/v1/files/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      })
      .then((r) => r.data);
  },

  downloadUrl: (storedName: string) =>
    `/api/v1/files/${storedName}/download`,

  mine: (page = 0, size = 20) =>
    apiClient
      .get<Page<FileMetadata>>('/api/v1/files/mine', { params: { page, size } })
      .then((r) => r.data),

  delete: (fileId: string) => apiClient.delete(`/api/v1/files/${fileId}`),
};

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  listUsers: (page = 0, size = 20) =>
    apiClient
      .get<Page<User>>('/api/v1/admin/users', { params: { page, size } })
      .then((r) => r.data),

  enableUser: (userId: string) =>
    apiClient.patch(`/api/v1/admin/users/${userId}/enable`),

  disableUser: (userId: string) =>
    apiClient.patch(`/api/v1/admin/users/${userId}/disable`),

  assignRole: (userId: string, roleName: string) =>
    apiClient.post(`/api/v1/admin/users/${userId}/roles/${roleName}`),

  revokeRole: (userId: string, roleName: string) =>
    apiClient.delete(`/api/v1/admin/users/${userId}/roles/${roleName}`),

  deleteUser: (userId: string) =>
    apiClient.delete(`/api/v1/admin/users/${userId}`),
};
