import apiClient from "./client";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/Auth/login", {
    email,
    password,
  });

  return response.data;
};

export const register = async (
  fullName: string,
  email: string,
  password: string,
  phone: string,
  gender: string
) => {
  const response = await apiClient.post("/Auth/register", {
    fullName,
    email,
    password,
    phone,
    gender,
  });

  return response.data;
};