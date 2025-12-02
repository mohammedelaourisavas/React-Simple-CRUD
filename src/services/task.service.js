import axiosInstance from "../api/axiosInstance";

export const getAllTasks=()=>{
    return axiosInstance.get("/get-all/");
}

export const getTaskById=(id)=>{
    return axiosInstance.get(`/get/${id}/`);
}

export const createTask=(taskData)=>{
    return axiosInstance.post("/create/", taskData);
}

export const updateTask=(id, taskData)=>{
    return axiosInstance.put(`/update/${id}/`, taskData);
}

export const deleteTask=(id)=>{
    return axiosInstance.delete(`/delete/${id}/`);
}

export const toggleTaskCompletion=(id, isCompleted)=>{
    return axiosInstance.patch(`/tasks/${id}/toggle/`, { isCompleted });
}   