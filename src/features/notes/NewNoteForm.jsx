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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import * as Yup from "yup";
import LoadingScreen from "../../components/LoadingScreen";
import { FSelect, FTextField, FormProvider } from "../../components/form";
import { STATUSES } from "../../config/statuses";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import { getAllUsers } from "../users/usersSlice";

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Minimum 3 letters")
    .max(20, "Maximum 20 letters")
    .matches("[A-Za-z]", "Only letters are allowed")
    .required("Title is required"),
  text: Yup.string()
    .min(3, "Minimum 3 letters")
    .max(200, "Maximum 200 letters")
    .required("Description is required"),
});

const defaultValues = {
  title: "",
  text: "",
  status: "Open",
  user: "",
  deadline: new Date(),
};

/**
 * @description The New Note page, with a form for creating a new note
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const NewNoteForm = () => {
  // Custom hook to set the title of the page
  useTitle("Meganote: New Note");
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.users);

  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    dispatch(getAllUsers());
  }, []);

  const methods = useForm({
    resolver: yupResolver(NoteSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async data => {
    const { user, title, text, status } = data;
    try {
      await auth.createNote({ user, title, text, status }, () => {
        navigate("/dash/notes");
      });
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

  // Can only assign new notes to active users
  let activeUsers = users.filter(user => user.active !== false);

  let filteredUsers = activeUsers;
  // Employees cannot assign notes to Admins and Managers
  if (user.role === "Employee") {
    filteredUsers = activeUsers.filter(user => user.role === "Employee");
  }
  // Managers cannot assign notes to Admins
  if (user.role === "Manager") {
    filteredUsers = activeUsers.filter(user => user.role !== "Admin");
  }

  // The options in the drop-down menu for Assigned to
  const userOptions = filteredUsers.map(user => {
    return (
      <MenuItem
        key={uuidv4()}
        value={user._id}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#333333" : "#FFFFFF",
          opacity: 1,
          "&:hover": { backgroundColor: "primary.main" },
          "&&.Mui-selected": { backgroundColor: "primary.main" },
        }}
      >
        {user.fullname}
      </MenuItem>
    );
  });

  // The options in the drop-down menu for Note Statuses
  const statusOptions = Object.values(STATUSES).map(status => {
    return (
      <MenuItem
        key={uuidv4()}
        value={status}
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? "#333333" : "#FFFFFF",
          opacity: 1,
          "&:hover": { backgroundColor: "primary.main" },
          "&&.Mui-selected": { backgroundColor: "primary.main" },
        }}
      >
        {status}
      </MenuItem>
    );
  });

  if (!users?.length) return <LoadingScreen />;

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
            New Note
          </Typography>
        </Box>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            {!!errors.responseError && (
              <Alert severity="error">{errors.responseError.message}</Alert>
            )}

            <FTextField name="title" label="Title" />
            <FTextField name="text" label="Description" rows={3} multiline />

            <FSelect name="user" label="Assigned to">
              {userOptions}
            </FSelect>

            <FSelect name="status" label="Status">
              {statusOptions}
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
};

export default NewNoteForm;
