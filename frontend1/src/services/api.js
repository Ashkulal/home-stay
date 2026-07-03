import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
};

export const peaks = {
  getAll: (params) => API.get("/peaks", { params }),
  getOne: (id) => API.get(`/peaks/${id}`),
  create: (data) => API.post("/peaks", data),
  update: (id, data) => API.put(`/peaks/${id}`, data),
  delete: (id) => API.delete(`/peaks/${id}`),
};

export const homestays = {
  getAll: (params) => API.get("/homestays", { params }),
  getOne: (id) => API.get(`/homestays/${id}`),
  create: (data) => API.post("/homestays", data),
  delete: (id) => API.delete(`/homestays/${id}`),
};

export const bookings = {
  getAll: () => API.get("/bookings"),
  getOne: (id) => API.get(`/bookings/${id}`),
  create: (data) => API.post("/bookings", data),
  update: (id, data) => API.put(`/bookings/${id}`, data),
  delete: (id) => API.delete(`/bookings/${id}`),
};

export const gallery = {
  getAll: () => API.get("/gallery"),
  getOne: (id) => API.get(`/gallery/${id}`),
  upload: (data) => API.post("/gallery", data),
  delete: (id) => API.delete(`/gallery/${id}`),
};

export const reviews = {
  getAll: (params) => API.get("/reviews", { params }),
  create: (data) => API.post("/reviews", data),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export const profile = {
  get: () => API.get("/profile/me"),
  update: (data) => API.put("/profile/me", data),
  changePassword: (data) => API.put("/profile/me/password", data),
};

export const upload = {
  image: (formData) => API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
};

export const admin = {
  getStats: () => API.get("/admin/stats"),
  getUsers: () => API.get("/admin/users"),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  getBookings: () => API.get("/admin/bookings"),
  updateBookingStatus: (id, status) => API.put(`/admin/bookings/${id}/status`, { status }),
};

export const payments = {
  getInfo: () => API.get("/payments/info"),
  initiate: (data) => API.post("/payments", data),
  getMy: () => API.get("/payments/my"),
  updateProof: (id, data) => API.put(`/payments/${id}/proof`, data),
  getAll: () => API.get("/payments/all"),
  confirm: (id, status) => API.put(`/payments/${id}/confirm`, { status }),
};

export default API;
