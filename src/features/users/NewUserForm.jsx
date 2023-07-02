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
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import { FSelect, FTextField, FormProvider } from "../../components/form";
import { ROLES } from "../../config/roles";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

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
});

const defaultValues = {
  username: "",
  fullname: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  role: "Employee",
};

/**
 * @description The New User page, with a form for creating a new user
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function NewUserForm() {
  // Custom hook to set the page title
  useTitle("Meganote: New User");

  const theme = useTheme();
  const navigate = useNavigate();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

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

  const onSubmit = async data => {
    const { username, fullname, email, password, role } = data;
    try {
      await auth.createUser(
        { username, fullname, email, password, role },
        () => {
          navigate("/dash/users");
        }
      );
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

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
            New User
          </Typography>
        </Box>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {!!errors.responseError && (
              <Alert severity="error">{errors.responseError.message}</Alert>
            )}

            <FTextField name="username" label="Username" />
            <FTextField name="fullname" label="Full Name" />
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

            <FSelect name="role" label="Role">
              {options}
            </FSelect>
            <Box
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                alightItems: "center",
              }}
            >
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Create
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      </Paper>
    </Container>
  );
}

export default NewUserForm;
