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
import ConfirmModal from "../../components/ConfirmModal";
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
  fullname: Yup.string()
    .min(3, "Minimum 3 letters")
    .max(20, "Maximum 20 letters")
    .matches(/^[a-z\s]+$/i, "Only letters are allowed")
    .required("Full name is required"),
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
  avatarUrl: Yup.string().url("Please enter a valid URL"),
});

const EditProfileForm = ({ user }) => {
  const auth = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const defaultValues = {
    username: user.user.username,
    fullname: user.user.fullname,
    email: user.user.email,
    avatarUrl: user.user.avatarUrl,
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
    const { username, fullname, email, password, avatarUrl } = data;
    try {
      await auth.updateAccount(
        { id: user.user._id, username, fullname, email, password, avatarUrl },
        () => {
          navigate("/dash/notes");
        }
      );
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

  const onDeleteUserClicked = async e => {
    try {
      await auth.deleteUser({ id: user.user._id }, () => {
        navigate("/dash/users");
      });
    } catch (error) {
      toast.error(error.message);
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
          p: 5,
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
            Edit Profile
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
            <FTextField name="fullname" label="Full Name" />
            <FTextField name="email" label="Email" />
            <FTextField name="avatarUrl" label="Avatar URL" />

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

            <ConfirmModal
              buttonText="Delete"
              title="Delete User"
              content="Are you sure you want to delete this user?"
              handleConfirm={onDeleteUserClicked}
              variant="contained"
              size="large"
            />
          </Stack>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default EditProfileForm;
