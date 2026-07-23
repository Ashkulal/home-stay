import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5002/api",
});

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
