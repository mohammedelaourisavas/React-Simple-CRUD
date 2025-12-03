import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Checkbox,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";


const TaskCard = ({ task, onToggle, onDelete, onUpdate }) => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.id, !task.completed)}
            icon={<PendingIcon />}
            checkedIcon={<CheckCircleIcon color="success" />}
            sx={{ mr: 1 }}
          />
          <Typography
            variant="body1"
            sx={{
              textDecoration: task.completed ? "line-through" : "none",
              fontWeight: 500,
            }}
          >
            {task.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 2 }}
          >
            {task.description}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <IconButton
          aria-label="update"
          color="primary"
          onClick={() => onUpdate(task.id)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={() => onDelete(task.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
