import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography, Alert, Link } from "@mui/material";
import { useLogin } from "../hooks/useLogin";

const LoginForm = () => {
  const { mutate, isLoading, isError, error } = useLogin();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string()
        .min(3, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <Box
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 6,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        background: "white",
      }}
    >
      <Typography variant="h5" mb={2} textAlign="center">
        Login
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.response?.data?.message || error?.message || "Login failed"}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          name="password"
          margin="normal"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <Typography mt={2} variant="body2" textAlign="center">
          Don't have an account?  
          <Link href="/register"
          sx={{
            cursor:"pointer",
            ml:1
          }}
          >Register here.</Link>
        </Typography>
      </form>
    </Box>
  );
};

export default LoginForm;
