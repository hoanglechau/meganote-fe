import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ColorButton from "../../components/ColorButton";
import LoadingPage from "../../components/LoadingPage";
import { FCheckbox, FTextField, FormProvider } from "../../components/form";
import useAuth from "../../hooks/useAuth";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const defaultValues = {
  username: "",
  password: "",
  persist: true,
};

/**
 * @description Login page for users to login to their account
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function Login() {
  // Custom hook to set the page title
  useTitle("User Login");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();

  // For persistent login
  const [persist, setPersist] = usePersist();

  // React Hook Form
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  // Form submit handler
  const onSubmit = async data => {
    const { username, password } = data;

    try {
      await auth.login({ username, password }, () => {
        navigate("/dash/notes");
      });
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

  // Handle the toggle of persistent login
  // Set the value of 'persist' to the opposite of its current value (for the checkbox)
  const handleToggle = () => setPersist(prev => !prev);

  // Loading screen when the 'login' function is called
  if (isSubmitting) {
    return <LoadingPage />;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, sm: 5, lg: 2.5 },
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 5,
          border: "1px solid #ccc",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Box component="header">
          <Typography
            variant="h3"
            color="primary"
            sx={{
              textAlign: "center",
              mb: 3,
              fontSize: { xs: "1.5rem", sm: "2.5rem", lg: "2.5rem" },
            }}
          >
            User Login
          </Typography>
        </Box>
        <Divider />
        <Container maxWidth="xs" sx={{ mt: 5, mb: 5 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}

              <FTextField name="username" label="Username" />

              <FTextField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              sx={{ my: 2 }}
            >
              <FCheckbox
                name="persist"
                label="Stay Logged In"
                onChange={handleToggle}
                checked={persist}
              />
            </Stack>

            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alightItems: "center",
                gap: 2,
              }}
            >
              <LoadingButton
                size="medium"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                fullWidth
              >
                Log in
              </LoadingButton>

              <ColorButton
                variant="contained"
                color="primary"
                to="/forgotpassword"
              >
                Forgot Password?
              </ColorButton>
            </Box>
          </FormProvider>
        </Container>
        <Divider />
        <Box component="footer" sx={{ mt: 3, textAlign: "center" }}>
          <ColorButton variant="contained" color="primary" to="/">
            Back to Home
          </ColorButton>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
