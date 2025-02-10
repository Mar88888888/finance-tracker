import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

export const resetAuth = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  window.location.href = "/login";
};

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      resetAuth();
    }
    return Promise.reject(error);
  }
);

export default API;
