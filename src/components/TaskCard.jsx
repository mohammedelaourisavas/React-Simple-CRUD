import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Checkbox,
  Box,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TaskCard = ({ task, onToggle, onDelete, onUpdate }) => {
  const isCompleted = task.completed;

  return (
    <Card
      sx={{
        my: 2,
        borderRadius: 3,
        p: 1,
        background: isCompleted ? "#F1FFF1" : "#F9FAFB",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          {/* Checkbox */}
          <Checkbox
            checked={isCompleted}
            onChange={() => onToggle(task.id, !task.completed)}
            icon={<PendingIcon />}
            checkedIcon={<CheckCircleIcon color="success" />}
            sx={{ mt: 0.5 }}
          />

          {/* Title + Description */}
          <Box flex={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  textDecoration: isCompleted ? "line-through" : "none",
                }}
              >
                {task.title}
              </Typography>

              {/* Status Chip */}
              <Chip
                label={isCompleted ? "Completed" : "Pending"}
                color={isCompleted ? "success" : "warning"}
                size="small"
              />
            </Stack>

            {/* Description */}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {task.description}
            </Typography>

            {/* Due Date */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Due: {new Date(task.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <Divider />

      {/* Action Buttons */}
      <CardActions sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
        <IconButton color="primary" onClick={() => onUpdate(task.id)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={() => onDelete(task.id)}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
