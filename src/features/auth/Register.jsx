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
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import ColorButton from "../../components/ColorButton";
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
  role: "Admin",
};

/**
 * @description The Register page component
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
function Register() {
  // Custom hook to set the page title
  useTitle("Meganote: Register");

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
      await auth.register({ username, fullname, email, password, role }, () => {
        navigate("/login");
      });
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
          backgroundColor: "primary.main",
          opacity: 1,
          "&:hover": { backgroundColor: "primary.dark" },
          "&&.Mui-selected": { backgroundColor: "primary.dark" },
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
            color="primary"
            sx={{
              textAlign: "center",
              mb: 3,
              fontSize: { xs: "1.5rem", sm: "2.5rem", lg: "2.5rem" },
            }}
          >
            Register (For Demo)
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
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  fullWidth
                >
                  Register
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

export default Register;
