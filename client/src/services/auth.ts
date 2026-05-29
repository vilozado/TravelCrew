import axios from "axios";
import type { UserData } from "../types/userData";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const login = async (userData: UserData) => {
  const response = await axios.post(`${API_URL}/login`, userData, {
    withCredentials: true,
  });


  localStorage.setItem('userName', response.data.name);
  return response.data;
};

export const register = async (userData: UserData): Promise<void> => {
  await axios.post(`${API_URL}/signup`, userData, {
    withCredentials: true,
  });
};

export const logout = async () => {
  await axios.post(`${API_URL}/logout`, {}, {
    withCredentials: true,
  });

  localStorage.removeItem("userName");
};

export const currentUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    });
    return res.data.user;
  } catch {
    return null;
  }
}
