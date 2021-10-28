import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default {
  getPatterns() {
    return api.get(`/patterns`);
  },
  savePattern(formData) {
    return api.post(`/file/upload`, formData);
  },
};
