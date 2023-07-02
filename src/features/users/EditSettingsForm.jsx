import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FTextField, FormProvider } from "../../components/form";
import useAuth from "../../hooks/useAuth";

const UserSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Minimum 3 letters")
    .max(20, "Maximum 20 letters")
    .matches(
      /^[\w\-\\S]+$/i,
      "Only letters, numbers, hyphens, and underscores are allowed. No whitespaces"
    )
    .required("Username is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
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

/**
 * @description Edit user settings form
 * @param {object} user - User object
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const EditSettingsForm = ({ user }) => {
  const auth = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const defaultValues = {
    username: user.user.username,
    email: user.user.email,
    password: "",
  };

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSaveUserClicked = async data => {
    const { username, email, password } = data;
    try {
      await auth.updateAccount(
        { id: user.user._id, username, email, password },
        () => {
          navigate("/dash/notes");
        }
      );
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "87vh",
        maxHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, sm: 5, lg: 2.5 },
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: { xs: 2, sm: 5 },
          border: "1px solid #ccc",
          boxShadow: "none",
          width: "100%",
        }}
      >
        <Box className="form__title-row">
          <Typography
            variant="h4"
            color="primary"
            sx={{
              mb: 3,
              textAlign: "center",
              fontSize: { xs: "1.5rem", sm: "2.5rem", lg: "2.5rem" },
            }}
          >
            Edit Settings
          </Typography>
        </Box>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSaveUserClicked)}
        >
          <Stack spacing={2}>
            {!!errors.responseError && (
              <Alert severity="error">{errors.responseError.message}</Alert>
            )}

            <FTextField name="username" label="Username" />
            <FTextField name="email" label="Email" />

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

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default EditSettingsForm;
