import { Stack, Button, Grid, TextField, Typography, Link} from "@mui/material"
import { Formik, Form } from "formik"
import { RegisterSchema } from "../../Schema/RegisterFormSchema"
import { PeopleRounded } from "@mui/icons-material";

export default function RegisterPage() {
  return (
    <Stack
      maxWidth={400}
      margin="auto"
      mt={5}
      padding={4}
      boxShadow="0 0 10px rgba(0,0,0,0.1)"
      borderRadius={2}
    >
      <Typography variant="h5" textAlign="center" mb={3}>
        Register
      </Typography>

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          console.log("REGISTER DATA:", values);
          alert("Registered Successfully!");
        }}
      >
        {({ errors, touched, handleChange }) => (
          <Form>
            <Stack spacing={2}>
              {/* Name */}
              <Grid>
                <TextField
                  fullWidth
                  name="name"
                  label="Name"
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Grid>

              {/* Confirm Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  onChange={handleChange}
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Grid>

              {/* Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                >
                  Register
                </Button>
              </Grid>
            </Stack>
          </Form>
        )}
      </Formik>
      <Typography mt={2} variant="body2" textAlign="center">
        Already have an account?  
        <Link 
          href="/login"
          sx={{
            cursor:"pointer"
          }}
        >
          Login here.
        </Link>
      </Typography>
    </Stack>
  );
}