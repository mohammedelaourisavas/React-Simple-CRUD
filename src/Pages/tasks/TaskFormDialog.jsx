import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function TaskFormDialog({
  open,
  title,
  initialValues = { title: "", description: "", completed: false },
  onClose,
  onSubmit,
}) {

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    completed: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormValues({
        title: initialValues.title || "",
        description: initialValues.description || "",
        completed: initialValues.completed || false,
      });
    }
  }, [open]);

  const handleChange = (field) => (e) => {
    const value = field === "completed" ? e.target.checked : e.target.value;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

    const handleSubmit = async () => {
    if (!formValues.title.trim()) return;
      console.log("Submitting form with values:", formValues);
    setLoading(true);
    try {
        await onSubmit(formValues);
        onClose(); 
    } finally {
        setLoading(false);
    }
    };

    const handleClose = () => {
      setFormValues({ title: "", description: "", completed: false });
      onClose();
    };



  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          fullWidth
          value={formValues.title}
          onChange={handleChange("title")}
        />

        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={formValues.description}
          onChange={handleChange("description")}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formValues.completed}
              onChange={handleChange("completed")}
            />
          }
          label="Completed"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {loading ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
