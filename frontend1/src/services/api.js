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
  getMe: () => API.get("/auth/me"),
};

export const homestays = {
  getAll: (params) => API.get("/homestays", { params }),
  getOne: (id) => API.get(`/homestays/${id}`),
};

export const peaks = {
  getAll: (params) => API.get("/peaks", { params }),
  getOne: (id) => API.get(`/peaks/${id}`),
};

export const gallery = {
  getAll: () => API.get("/gallery"),
};

export const contact = {
  submit: (data) => API.post("/contact", data),
};

export default API;
