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
import { v4 as uuidv4 } from "uuid";
import ConfirmIconModal from "../../components/ConfirmIconModal";
import useAuth from "../../hooks/useAuth";

function UserTable({ users }) {
  const navigate = useNavigate();
  const auth = useAuth();

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

  // Navigate to the edit user page when the edit button is clicked
  const handleEditUser = targetUser =>
    navigate(`/dash/users/${targetUser._id}`);

  const handleDeleteUser = async targetUser => {
    try {
      await auth.deleteUser({ id: targetUser._id }, () => {
        navigate("/dash/users");
        refreshPage();
      });
    } catch (error) {
      toast.error(error.message);
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
                Username
              </TableCell>
              <TableCell sx={{ display: "table-cell", fontWeight: "900" }}>
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
              <TableCell
                sx={{
                  display: { xs: "none", md: "table-cell" },
                  fontWeight: "900",
                }}
              >
                Delete
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => {
              return (
                <TableRow
                  key={uuidv4()}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&.MuiTableRow-root:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  <TableCell
                    onClick={() => handleEditUser(user)}
                    align="left"
                    sx={{ display: "table-cell" }}
                  >
                    {user.username}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditUser(user)}
                    align="left"
                    sx={{ display: "table-cell" }}
                  >
                    {user.role}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditUser(user)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {user.active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditUser(user)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {convertDate(user.createdAt)}
                  </TableCell>
                  <TableCell
                    onClick={() => handleEditUser(user)}
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {convertDate(user.updatedAt)}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    <ConfirmIconModal
                      buttonIcon={<DeleteIcon />}
                      title="Delete User"
                      content="Are you sure you want to delete this user?"
                      handleConfirm={() => handleDeleteUser(user)}
                      variant="contained"
                      size="large"
                      yesText="Delete"
                      noText="Cancel"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserTable;
