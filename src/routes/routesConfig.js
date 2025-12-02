import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../Pages/auth/LoginPage";
import RegisterPage from "../Pages/auth/RegisterPage";
import TasksPage from "../Pages/tasks/TasksPage";

export const routesConfig = [
  {
    path: "/auth",
    layout: AuthLayout,
    children: [
      { path: "/login", component: LoginPage },
      { path: "/register", component: RegisterPage },
    ],
  },

  {
    layout: MainLayout,
    children: [{ path: "/tasks", component: TasksPage }],
  },
];
