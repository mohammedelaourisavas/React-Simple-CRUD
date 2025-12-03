import React, { useState } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import { useTasks } from "./useTasks";
import TaskFormDialog from "./TaskFormDialog";
import TaskList from "./TaskList";

export default function TasksPage() {
  const {
    tasks,
    loading,
    error,
    addTask,
    removeTask,
    toggle,
    getOne,
    updateOne,
  } = useTasks();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  // open edit dialog
  const openEdit = async (id) => {
    const task = await getOne(id);
    setEditingTask(task);
    setEditOpen(true);
  };

  const clearAll = async () => {
    const res = await Swal.fire({
      title: "Clear all tasks?",
      icon: "warning",
      showCancelButton: true,
    });
    if (res.isConfirmed) setTasks([]);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6 }}>
      <Typography variant="h4" textAlign="center">
        Todo List
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          onClick={() => setAddOpen(true)}
        >
          Add Task
        </Button>

        <Button
          variant="outlined"
          startIcon={<ClearAllIcon />}
          fullWidth
          onClick={clearAll}
        >
          Clear All
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">Failed to load tasks.</Typography>
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={toggle}
          onDelete={removeTask}
          onUpdate={openEdit}
        />
      )}

      <TaskFormDialog
        open={addOpen}
        title="Add Task"
        onSubmit={addTask}
        onClose={() => setAddOpen(false)}
      />

      <TaskFormDialog
        open={editOpen}
        title="Edit Task"
        initialValues={editingTask || {}}
        onSubmit={(data) => updateOne(editingTask.id, data)}
        onClose={() => setEditOpen(false)}
      />

      <Button variant="contained" fullWidth sx={{ mt: 4 }} onClick={logout}>
        Logout
      </Button>
    </Box>
  );
}
