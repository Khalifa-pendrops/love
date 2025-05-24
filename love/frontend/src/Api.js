import axios from "axios";

const API = axios.create({
  baseURL: "https://some-love-story.onrender.com",
});

API.interceptors.request.use((config) => {
  console.log("Making request to:", config.url);
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default API;
