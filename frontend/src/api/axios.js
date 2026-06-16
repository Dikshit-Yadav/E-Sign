import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;