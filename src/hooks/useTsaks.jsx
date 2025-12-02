import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllTasks,
  createTask,
  getTaskById,
  deleteTask,
  toggleTaskCompletion,
} from "../services/task.service";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await getAllTasks();
      return res.data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task) => {
      const res = await createTask(task);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    },
  });
};

export const useTaskById = (id) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await getTaskById(id);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await deleteTask(id);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
};

export const useToggleTaskCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isCompleted }) => {
      const res = await toggleTaskCompletion(id, isCompleted);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });
};
