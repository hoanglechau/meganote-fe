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
import { FSelect, FTextField, FormProvider } from "../../components/form";
import { STATUSES } from "../../config/statuses";
import useAuth from "../../hooks/useAuth";

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

const EditUserForm = ({ note, users }) => {
  const auth = useAuth();
  const { user } = useAuth();
  const theme = useTheme();

  const defaultValues = {
    title: note.note.title,
    text: note.note.text,
    status: note.note.status,
    user: note.note.user,
  };

  const navigate = useNavigate();

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
        {user.username}
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

  const onSaveNoteClicked = async data => {
    const { title, text, status, user } = data;
    try {
      await auth.updateNote(
        { id: note.note._id, user, title, text, status },
        () => {
          navigate("/dash/notes");
        }
      );
    } catch (error) {
      reset();
      setError("responseError", { message: error.message });
    }
  };

  const onDeleteNoteClicked = async e => {
    try {
      await auth.deleteNote({ id: note.note._id }, () => {
        navigate("/dash/notes");
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  let deleteButton = null;
  if (user.role === "Admin" || user.role === "Manager") {
    deleteButton = (
      <ConfirmModal
        buttonText="Delete"
        title="Delete Note"
        content="Are you sure you want to delete this note?"
        handleConfirm={onDeleteNoteClicked}
        variant="contained"
        size="large"
        yesText="Delete"
        noText="Cancel"
      />
    );
  }

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
            Edit Note #{note.note.ticket}
          </Typography>
        </Box>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(onSaveNoteClicked)}
        >
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

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>

            {deleteButton}
          </Stack>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default EditUserForm;
