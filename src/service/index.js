import axios from "axios";

const api = axios.create({
  baseURL: "https://picsum.photos",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default {
  getPatterns({ currentPage, pageSize }) {
    return api.get(`/v2/list?page=${currentPage}&limit=${pageSize}`);
  },
  savePattern(formData) {
    return api.post(`/file/upload`, formData);
  },
};
