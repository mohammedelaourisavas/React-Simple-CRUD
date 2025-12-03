import { useState, useCallback, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskById,
  updateTask,
} from "../../services/task.service";
import Swal from "sweetalert2";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all tasks
    useEffect(() => {
    let isMounted = true; 

    const loadTasks = async () => {
        if (!isMounted) return;
        setLoading(true);
        try {
        const res = await getAllTasks();
        if (isMounted) setTasks(res.data || []);
        } catch (err) {
        if (isMounted) setError(err);
        } finally {
        if (isMounted) setLoading(false);
        }
    };

    loadTasks();

    return () => {
        isMounted = false; 
    };
    }, []);


    const addTask = useCallback(async (payload) => {
      try {
        const res = await createTask(payload);
        const created = res?.data;
        if (created) {
          setTasks((prev) => [...prev, created]);
          Swal.fire("Success", "Task added successfully!", "success");
        } else {
          Swal.fire("Error", "Unexpected server response.", "error");
        }
      } catch (err) {
        console.error("Failed to add task", err);
        Swal.fire("Error", "Failed to add task", "error");
      }
    }, []);


  // Delete task
  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      Swal.fire("Deleted!", "Task removed.", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to delete task", err.message);
    }
  };

  // Toggle completed
  const toggle = async (id, completed) => {
    console.log(id, completed);

    try {
      const res = await toggleTaskCompletion(id, completed);
      const updatedTask = res?.data;

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? updatedTask || { ...t, completed } // fallback if backend doesn't return data
            : t
        )
      );

      Swal.fire(
        completed ? "Completed!" : "Marked Incomplete!",
        completed ? "Task completed." : "Task marked as incomplete.",
        completed ? "success" : "info"
      );
    } catch (err) {
      Swal.fire("Error", "Failed to toggle task completion", err.message);
      // fallback local update so UI remains responsive
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  };


  // Fetch one task
  const getOne = async (id) => {
    const res = await getTaskById(id);
    return res.data;
  };

  // Update task
  const updateOne = async (id, payload) => {
    const res = await updateTask(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    Swal.fire("Updated!", "Task updated.", "success");
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    removeTask,
    toggle,
    getOne,
    updateOne,
  };
}
