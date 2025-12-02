import { useMutation } from "@tanstack/react-query";
import { loginService } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/storage";

export const useLogin = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      console.log("Login successful", data);
      Object.keys(data).forEach(key => setToken(key, data[key]));
      navigate("/tasks");
    },
    onError: (err) => {
      console.error("Login error", err);
    },
  });
};
