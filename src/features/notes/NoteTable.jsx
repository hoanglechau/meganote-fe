import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmIconModal from "../../components/ConfirmIconModal";
import useAuth from "../../hooks/useAuth";

function NoteTable({ notes }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { user } = useAuth();

  // Convert the date to a more readable format
  const convertDate = createdDate => {
    return new Date(createdDate).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  function refreshPage() {
    window.location.reload(false);
  }

  // Navigate to the edit note page when the edit button is clicked
  const handleEditNote = targetNote => {
    // Admins cannot edit other admins' notes, but they can edit all other notes
    if (user.role === "Admin" && targetNote.role === "Admin") {
      if (user._id === targetNote.user) {
        navigate(`/dash/notes/${targetNote._id}`);
      } else {
        toast.error("You're not allowed to edit this note!");
      }
    }

    if (user.role === "Admin" && targetNote.role !== "Admin") {
      navigate(`/dash/notes/${targetNote._id}`);
    }

    // Managers cannot edit admins' notes and other managers' notes, but they can edit all other notes
    if (user.role === "Manager" && targetNote.role === "Manager") {
      if (user._id === targetNote.user) {
        navigate(`/dash/notes/${targetNote._id}`);
      } else {
        toast.error("You're not allowed to edit this note!");
      }
    }

    if (user.role === "Manager" && targetNote.role !== "Manager") {
      navigate(`/dash/notes/${targetNote._id}`);
    }

    // Employees can only edit their own notes
    if (user.role === "Employee") {
      if (user._id === targetNote.user) {
        navigate(`/dash/notes/${targetNote._id}`);
      } else {
        toast.error("You're not allowed to edit this note!");
      }
    }
  };

  const handleDeleteNote = async targetNote => {
    // Admins cannot delete other admins' notes, but they can delete all other notes
    // Managers cannot delete admins' notes and other managers' notes, but they can delete all other notes
    if (
      user.role === "Admin" &&
      targetNote.role === "Admin" &&
      user._id !== targetNote.user
    ) {
      toast.error("You're not allowed to delete this note!");
    } else if (
      user.role === "Manager" &&
      targetNote.role === "Manager" &&
      user._id !== targetNote.user
    ) {
      toast.error("You're not allowed to delete this note!");
    } else {
      try {
        await auth.deleteNote({ id: targetNote._id }, () => {
          navigate("/dash/notes");
          refreshPage();
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  let deleteHeader = null;
  if (user.role === "Admin" || user.role === "Manager") {
    deleteHeader = (
      <TableCell
        sx={{ display: { xs: "none", md: "table-cell" }, fontWeight: "900" }}
      >
        Delete
      </TableCell>
    );
  }

  let deleteButton = note => {
    if (user.role === "Admin" || user.role === "Manager") {
      return (
        <TableCell
          align="left"
          sx={{ display: { xs: "none", md: "table-cell" } }}
        >
          <ConfirmIconModal
            buttonIcon={<DeleteIcon />}
            title="Delete Note"
            content="Are you sure you want to delete this note?"
            handleConfirm={() => handleDeleteNote(note)}
            variant="contained"
            size="large"
            yesText="Delete"
            noText="Cancel"
          />
        </TableCell>
      );
    } else {
      return null;
    }
  };

  return (
    <Box
      component="div"
      sx={{
        minHeight: { xs: 0, sm: "60vh" },
        height: { xs: "max-content", sm: "100%" },
        maxWidth: "100%",
      }}
    >
      <TableContainer
        sx={{
          height: { xs: "50vh", sm: "56vh", lg: "60vh" },
        }}
      >
        <Table stickyHeader sx={{ height: "max-content" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ display: "table-cell", fontWeight: "900" }}>
                Ticket
              </TableCell>
              <TableCell sx={{ display: "table-cell", fontWeight: "900" }}>
                Title
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                  fontWeight: "900",
                }}
              >
                Assigned
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                  fontWeight: "900",
                }}
              >
                Role
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                  fontWeight: "900",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                  fontWeight: "900",
                }}
              >
                Created
              </TableCell>
              <TableCell
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                  fontWeight: "900",
                }}
              >
                Updated
              </TableCell>
              {deleteHeader}
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.map(note => {
              return (
                <TableRow
                  key={note._id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&.MuiTableRow-root:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{ display: "table-cell" }}
                  >
                    {note.ticket}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{
                      maxWidth: { xs: "45vw", sm: "20vw" },
                      display: "table-cell",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {note.title}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {note.username ? note.username : "Unassigned"}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {note.role ? note.role : ""}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {note.status}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {convertDate(note.createdAt)}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditNote(note)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {convertDate(note.updatedAt)}
                  </TableCell>
                  {deleteButton(note)}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default NoteTable;
