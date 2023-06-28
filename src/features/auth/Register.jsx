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

const defaultValues = {
  username: "",
  password: "",
  passwordConfirmation: "",
  role: "Admin",
};

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
    const { username, password, role, avatarUrl } = data;
    try {
      await auth.register({ username, password, role, avatarUrl }, () => {
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
