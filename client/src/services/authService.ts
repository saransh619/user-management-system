import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  if (response.data.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }

  console.log("response.data.data", response.data.data);
  return response.data.data;
};

export const register = async (userData: any) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);

  if (response.data.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const user = getCurrentUser();
      console.log("user", user);
      if (user && user.token) {
        config.headers["Authorization"] = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
