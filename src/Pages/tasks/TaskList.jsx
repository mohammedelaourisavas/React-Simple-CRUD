import TaskCard from "../../components/TaskCard";

export default function TaskList({ tasks, onToggle, onDelete, onUpdate }) {
  return tasks.map((task) => (
    <TaskCard
      key={task.id}
      task={task}
      onToggle={onToggle}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  ));
}
