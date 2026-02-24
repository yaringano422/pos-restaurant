import api from './client';
import type { Category, Product, Order, RestaurantTable, InventoryItem, InventoryMovement, DashboardSummary, User } from '../types';

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (data: any) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  getProfile: () =>
    api.get<User>('/auth/profile'),
};

// Dashboard API
export const dashboardApi = {
  getSummary: () =>
    api.get<DashboardSummary>('/dashboard/summary'),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) => api.put<Category>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Products API
export const productsApi = {
  getAll: (categoryId?: string) =>
    api.get<Product[]>('/products', { params: categoryId ? { categoryId } : {} }),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: any) => api.post<Product>('/products', data),
  update: (id: string, data: any) => api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { status?: string; date?: string }) =>
    api.get<Order[]>('/orders', { params }),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  create: (data: any) => api.post<Order>('/orders', data),
  addItems: (id: string, items: any[]) =>
    api.post<Order>(`/orders/${id}/items`, { items }),
  pay: (id: string, data: any) => api.post<Order>(`/orders/${id}/pay`, data),
  updateStatus: (id: string, status: string) =>
    api.patch<Order>(`/orders/${id}/status`, { status }),
  cancel: (id: string) => api.post(`/orders/${id}/cancel`),
};

// Tables API
export const tablesApi = {
  getAll: () => api.get<RestaurantTable[]>('/tables'),
  create: (data: any) => api.post<RestaurantTable>('/tables', data),
  update: (id: string, data: any) => api.put<RestaurantTable>(`/tables/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch<RestaurantTable>(`/tables/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/tables/${id}`),
};

// Inventory API
export const inventoryApi = {
  getAll: () => api.get<InventoryItem[]>('/inventory'),
  getLowStock: () => api.get<InventoryItem[]>('/inventory/low-stock'),
  restock: (id: string, data: { quantity: number; notes?: string }) =>
    api.post(`/inventory/${id}/restock`, data),
  adjust: (id: string, data: { quantity: number; notes?: string }) =>
    api.post(`/inventory/${id}/adjust`, data),
  getMovements: (id: string) =>
    api.get<InventoryMovement[]>(`/inventory/${id}/movements`),
};

// Users API
export const usersApi = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: string) => api.get<User>(`/users/${id}`),
  update: (id: string, data: any) => api.put<User>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
