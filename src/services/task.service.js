import axiosInstance from "../api/axiosInstance";

export const getAllTasks = () => {
  return axiosInstance.get("/get-all/");
};

export const getTaskById = (id) => {
  return axiosInstance.get(`/get/${id}/`);
};

export const createTask = (taskData) => {
  console.log("API call to create task:", taskData);
  return axiosInstance.post("/create/", taskData);
};

export const updateTask = (id, taskData) => {
  return axiosInstance.put(`/update/${id}/`, taskData);
};

export const deleteTask = (id) => {
  return axiosInstance.delete(`/delete/${id}/`);
};

export const toggleTaskCompletion = (id, completed) => {
  return axiosInstance.put(`/update/${id}/`, { completed });
};
