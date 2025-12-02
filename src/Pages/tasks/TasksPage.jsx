// src/pages/TasksPage.jsx
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Swal from "sweetalert2";

import {
  getAllTasks,
  createTask,
  deleteTask,
  toggleTaskCompletion,
  getTaskById,
  updateTask,
} from "../../services/task.service";

import TaskCard from "../../components/TaskCard";

const PRIORITIES = ["High", "Medium", "Low"];

/**
 * Reusable dialog component used for both Add and Edit
 * Props:
 * - open, title, initialValues { title, priority }
 * - onClose, onSubmit({ title, priority })
 */
function TaskFormDialog({
  open,
  title,
  initialValues = {},
  onClose,
  onSubmit,
}) {
  const [taskTitle, setTaskTitle] = useState(initialValues.title || "");
  const [taskPriority, setTaskPriority] = useState(
    initialValues.priority || "Medium"
  );
  const [submitting, setSubmitting] = useState(false);

  // sync initial values when opening for edit
  useEffect(() => {
    if (open) {
      setTaskTitle(initialValues.title || "");
      setTaskPriority(initialValues.priority || "Medium");
    }
  }, [open, initialValues]);

  const handleSubmit = async () => {
    if (!taskTitle.trim()) {
      await Swal.fire(
        "Missing Title",
        "Task title cannot be empty.",
        "warning"
      );
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ title: taskTitle.trim(), priority: taskPriority });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          fullWidth
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Priority"
          fullWidth
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          {PRIORITIES.map((p) => (
            <MenuItem key={p} value={p}>
              {p}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const TasksPage = () => {
  const [tasks, setTasks] = useState([]); // always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // dialog states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingInitialValues, setEditingInitialValues] = useState({});

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllTasks();
      const data = res?.data;
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        // Safety: backend returned unexpected shape
        console.warn("getAllTasks returned non-array:", data);
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      setError(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add task
  const handleAddTask = useCallback(async (payload) => {
    try {
      const res = await createTask({ ...payload, completed: false });
      const created = res?.data;
      if (created && typeof created === "object") {
        setTasks((prev) => [...prev, created]);
        await Swal.fire("Success", "Task added successfully!", "success");
        setAddOpen(false);
      } else {
        // Unexpected response
        console.warn("createTask returned:", res);
        await Swal.fire("Error", "Unexpected server response.", "error");
      }
    } catch (err) {
      console.error("Failed to add task", err);
      await Swal.fire("Error", "Failed to add task", "error");
    }
  }, []);

  // Delete task
  const handleDelete = useCallback(async (id) => {
    const confirmation = await Swal.fire({
      title: "Delete Task?",
      text: "You will not be able to recover this task.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const res = await deleteTask(id);
      // If backend returns 204 (no content) or a message/object, we simply remove locally
      if (res?.status === 204 || !res?.data) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else if (Array.isArray(res.data)) {
        // If backend returns full list
        setTasks(res.data);
      } else if (res.data && typeof res.data === "object") {
        // If returns updated single object or message, just remove locally
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } else {
        // fallback
        setTasks((prev) => prev.filter((t) => t.id !== id));
      }

      await Swal.fire("Deleted!", "Task has been removed.", "success");
    } catch (err) {
      console.error("Failed to delete task", err);
      await Swal.fire("Error", "Failed to delete task", "error");
    }
  }, []);

  // Toggle completion - expects server returns updated task object
  const handleToggle = useCallback(async (id) => {
    try {
      const res = await toggleTaskCompletion(id);
      const updated = res?.data;
      if (updated && typeof updated === "object") {
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      } else {
        // fallback: toggle locally
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
      }
    } catch (err) {
      console.error("Failed to toggle task", err);
      // fallback local toggle so UI remains responsive
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      await Swal.fire(
        "Error",
        "Failed to toggle task on server. Changed locally.",
        "warning"
      );
    }
  }, []);

  // Open edit dialog (load single task from API)
  const openEditDialog = useCallback(async (id) => {
    try {
      const res = await getTaskById(id);
      const data = res?.data;
      if (data && typeof data === "object") {
        setEditingTaskId(id);
        setEditingInitialValues({
          title: data.title,
          priority: data.priority || "Medium",
        });
        setEditOpen(true);
      } else {
        Swal.fire("Error", "Failed to load task for editing", "error");
      }
    } catch (err) {
      console.error("Failed to fetch task", err);
      await Swal.fire("Error", "Failed to load task for editing", "error");
    }
  }, []);

  // Submit update
  const submitUpdate = useCallback(
    async (payload) => {
      if (!editingTaskId) return;
      try {
        const res = await updateTask(editingTaskId, payload);
        const updated = res?.data;
        if (updated && typeof updated === "object") {
          setTasks((prev) =>
            prev.map((t) => (t.id === editingTaskId ? updated : t))
          );
        } else {
          // fallback: update locally
          setTasks((prev) =>
            prev.map((t) => (t.id === editingTaskId ? { ...t, ...payload } : t))
          );
        }

        setEditOpen(false);
        setEditingTaskId(null);
        setEditingInitialValues({});
        await Swal.fire("Updated!", "Task updated successfully.", "success");
      } catch (err) {
        console.error("Failed to update task", err);
        await Swal.fire("Error", "Failed to update task", "error");
      }
    },
    [editingTaskId]
  );

  // Clear all
  const handleClearAll = useCallback(async () => {
    const result = await Swal.fire({
      title: "Clear All Tasks?",
      text: "This will remove all tasks permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Clear All",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      setTasks([]);
      await Swal.fire("Cleared!", "All tasks have been removed.", "success");
    }
  }, []);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Tasks
      </Typography>

      {/* Controls */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          onClick={() => setAddOpen(true)}
        >
          Add Task
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearAllIcon />}
          fullWidth
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </Box>

      {/* Loading / Empty / List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          Failed to load tasks.
        </Typography>
      ) : tasks.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No tasks available.
        </Typography>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={openEditDialog}
          />
        ))
      )}

      {/* Add dialog */}
      <TaskFormDialog
        open={addOpen}
        title="Add New Task"
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddTask}
      />

      {/* Edit dialog */}
      <TaskFormDialog
        open={editOpen}
        title="Update Task"
        initialValues={editingInitialValues}
        onClose={() => {
          setEditOpen(false);
          setEditingTaskId(null);
          setEditingInitialValues({});
        }}
        onSubmit={submitUpdate}
      />
    </Box>
  );
};

export default TasksPage;
