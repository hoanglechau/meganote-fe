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
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import ConfirmModal from "../../components/ConfirmModal";
import {
  FCheckbox,
  FSelect,
  FTextField,
  FormProvider,
} from "../../components/form";
import { ROLES } from "../../config/roles";
import useAuth from "../../hooks/useAuth";

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Minimum 3 letters")
    .max(20, "Maximum 20 letters")
    .matches("[A-Za-z]", "Only letters are allowed")
    .required("Username is required"),
  password: Yup.string()
    .min(4, "Minimum 4 characters")
    .max(12, "Maximum 12 characters")
    .matches("[A-z0-9!@#$%]", "Only letters, numbers, and !@#$% are allowed")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  avatarUrl: Yup.string().url("Please enter a valid URL"),
});

const EditUserForm = ({ user }) => {
  const auth = useAuth();
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const defaultValues = {
    username: user.user.username,
    role: user.user.role,
    active: user.user.active,
    avatarUrl: user.user.avatarUrl,
    password: "",
  };

  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  // The options in the drop-down menu for User Roles
  const options = Object.values(ROLES).map(role => {
    return (
      <MenuItem
        key={uuidv4()}
        value={role}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#333333" : "#FFFFFF",
          opacity: 1,
          "&:hover": { backgroundColor: "primary.main" },
          "&&.Mui-selected": { backgroundColor: "primary.main" },
        }}
      >
        {role}
      </MenuItem>
    );
  });

  const onSaveUserClicked = async data => {
    const { username, role, active, password, avatarUrl } = data;
    try {
      await auth.updateUser(
        { id: user.user._id, username, role, active, password, avatarUrl },
        () => {
          navigate("/dash/users");
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
            Edit User
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

            <FSelect name="role" label="Role">
              {options}
            </FSelect>

            <FCheckbox name="active" label="Active" />

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
              yesText="Delete"
              noText="Cancel"
            />
          </Stack>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default EditUserForm;
