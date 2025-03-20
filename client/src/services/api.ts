import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getUsers = async (
  page: number = 1,
  limit: number = 5,
  search: string = ""
) => {
  return axios.get(`${API_URL}/users`, {
    params: {
      page,
      limit,
      search,
    },
  });
};

export const getUser = async (id: string) => {
  return axios.get(`${API_URL}/users/${id}`);
};

export const createUser = async (user: any) => {
  return axios.post(`${API_URL}/users`, user);
};

export const updateUser = async (id: string, user: any) => {
  return axios.put(`${API_URL}/users/${id}`, user);
};

export const deleteUser = async (id: string) => {
  return axios.delete(`${API_URL}/users/${id}`);
};
