import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Container,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
});

/**
 * @description The form for editing a user's details
 * @param {object} user The user object
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const EditUserForm = ({ user }) => {
  const auth = useAuth();
  const theme = useTheme();

  const defaultValues = {
    username: user.user.username,
    fullname: user.user.fullname,
    email: user.user.email,
    role: user.user.role,
    active: user.user.active,
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
    const { username, fullname, email, role, active } = data;
    try {
      await auth.updateUser(
        {
          id: user.user._id,
          username,
          fullname,
          email,
          role,
          active,
        },
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
            <FTextField name="fullname" label="Full Name" />
            <FTextField name="email" label="Email" />

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
