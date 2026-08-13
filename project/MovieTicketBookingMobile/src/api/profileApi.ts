import apiClient from "./client";

export type ProfileData = {
  fullName: string;
  phone: string;
  gender: string;
};

export const getProfile = async (userId: number) => {
  const response = await apiClient.get(`/Profile/${userId}`);
  return response.data;
};

export const updateProfile = async (userId: number, data: ProfileData) => {
  const response = await apiClient.put(`/Profile/${userId}`, data);
  return response.data;
};
