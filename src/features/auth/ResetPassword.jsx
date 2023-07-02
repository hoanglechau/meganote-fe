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
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import ColorButton from "../../components/ColorButton";
import LoadingPage from "../../components/LoadingPage";
import { FTextField, FormProvider } from "../../components/form";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(4, "Minimum 4 characters")
    .max(12, "Maximum 12 characters")
    .matches(
      /^[\w\-\S]+$/,
      "Only letters, numbers, and special characters allowed. No whitespaces"
    )
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const defaultValues = {
  password: "",
  passwordConfirmation: "",
};

/**
 * @description Reset Password page
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function ResetPassword() {
  // Custom hook to set the page title
  useTitle("Reset Password");

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const auth = useAuth();
  const { passwordResetToken } = useParams();

  // React Hook Form
  const methods = useForm({
    resolver: yupResolver(PasswordSchema),
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
    const { password } = data;

    try {
      await auth.resetPassword({ password, passwordResetToken }, () => {
        navigate("/login");
      });
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

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
            Reset Password
          </Typography>
        </Box>
        <Divider />
        <Container maxWidth="xs" sx={{ mt: 5, mb: 5 }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              {!!errors.responseError && (
                <Alert severity="error">{errors.responseError.message}</Alert>
              )}

              <Typography
                sx={{
                  textAlign: "center",
                  fontSize: { xs: "0.7rem", sm: "1rem" },
                }}
              >
                Please enter your new password
              </Typography>

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

              <FTextField
                name="passwordConfirmation"
                label="Password Confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        edge="end"
                      >
                        {showPasswordConfirmation ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alightItems: "center",
                }}
              >
                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  fullWidth
                >
                  Reset Password
                </LoadingButton>
              </Box>
            </Stack>
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

export default ResetPassword;
