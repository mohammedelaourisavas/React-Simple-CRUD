import axiosInstance from "../api/axiosInstance";

export const loginService = async (data) => {
  const response = await axiosInstance.post("/token/", data);
  return response.data; 
};
