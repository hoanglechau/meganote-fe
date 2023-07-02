import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ColorButton from "../../components/ColorButton";
import LoadingPage from "../../components/LoadingPage";
import { FTextField, FormProvider } from "../../components/form";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const defaultValues = {
  email: "",
};

/**
 * @description Forgot password page
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function ForgotPassword() {
  // Custom hook to set the page title
  useTitle("Forgot Password");

  const navigate = useNavigate();
  const auth = useAuth();

  // React Hook Form
  const methods = useForm({
    resolver: yupResolver(EmailSchema),
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
    const { email } = data;

    try {
      await auth.forgotPassword({ email }, () => {
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
            Forgot Password
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
                Please enter your registered email
              </Typography>

              <FTextField name="email" label="Email" />

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
                  Send Reset Email
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Container>
        <Divider />
        <Box component="footer" sx={{ mt: 3, textAlign: "center" }}>
          <ColorButton variant="contained" color="primary" to="/login">
            Back to Login
          </ColorButton>
        </Box>
      </Paper>
    </Container>
  );
}

export default ForgotPassword;
