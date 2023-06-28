import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { AppBar, Avatar, Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ColorIconButton from "../../components/ColorIconButton";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";

const Menu = () => {
  const { user } = useAuth();
  // Custom hook to set the page title
  useTitle(`Meganote: ${user.username}`);

  const { pathname } = useLocation();

  const accountUrl = `/dash/account/${user._id}`;

  let profileButton = null;
  if (pathname.includes("/dash/account")) {
    profileButton = (
      <ColorIconButton
        variant="text"
        component={Link}
        to={accountUrl}
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          fontSize: { xs: "1.3rem", sm: "2rem", lg: "1.2rem" },
          p: 1,
        }}
      >
        <AccountCircleIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        My Profile
      </ColorIconButton>
    );
  } else {
    profileButton = (
      <ColorIconButton variant="text" component={Link} to={accountUrl}>
        <AccountCircleIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        My Profile
      </ColorIconButton>
    );
  }

  let notesButton = null;
  if (pathname.includes("/dash/notes") && !pathname.includes("new")) {
    notesButton = (
      <ColorIconButton
        variant="text"
        component={Link}
        to="/dash/notes"
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          fontSize: { xs: "1.3rem", sm: "2rem", lg: "1.2rem" },
          p: 1,
        }}
      >
        <DescriptionIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        View Notes
      </ColorIconButton>
    );
  } else {
    notesButton = (
      <ColorIconButton variant="text" component={Link} to="/dash/notes">
        <DescriptionIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        View Notes
      </ColorIconButton>
    );
  }

  let newNotesButton = null;
  if (pathname.includes("/dash/notes/new")) {
    newNotesButton = (
      <ColorIconButton
        variant="text"
        component={Link}
        to="/dash/notes/new"
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          fontSize: { xs: "1.3rem", sm: "2rem", lg: "1.2rem" },
          p: 1,
        }}
      >
        <NoteAddIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        New Note
      </ColorIconButton>
    );
  } else {
    newNotesButton = (
      <ColorIconButton variant="text" component={Link} to="/dash/notes/new">
        <NoteAddIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        New Note
      </ColorIconButton>
    );
  }

  let usersButton = null;
  if (pathname.includes("/dash/users") && !pathname.includes("new")) {
    usersButton = (
      <ColorIconButton
        variant="text"
        component={Link}
        to="/dash/users"
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          fontSize: { xs: "1.3rem", sm: "2rem", lg: "1.2rem" },
          p: 1,
        }}
      >
        <SupervisedUserCircleIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        View Users
      </ColorIconButton>
    );
  } else {
    usersButton = (
      <ColorIconButton variant="text" component={Link} to="/dash/users">
        <SupervisedUserCircleIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        View Users
      </ColorIconButton>
    );
  }

  let newUsersButton = null;
  if (pathname.includes("/dash/users/new")) {
    newUsersButton = (
      <ColorIconButton
        variant="text"
        component={Link}
        to="/dash/users/new"
        sx={{
          backgroundColor: "primary.main",
          "&:hover": { backgroundColor: "primary.dark" },
          fontSize: { xs: "1.3rem", sm: "2rem", lg: "1.2rem" },
          p: 1,
        }}
      >
        <PersonAddIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        New User
      </ColorIconButton>
    );
  } else {
    newUsersButton = (
      <ColorIconButton variant="text" component={Link} to="/dash/users/new">
        <PersonAddIcon
          sx={{
            mr: { xs: 3, sm: 3, lg: 2 },
            fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" },
          }}
        />
        New User
      </ColorIconButton>
    );
  }

  // Only Admins can see the buttons to view users and add new users
  let buttonGroup = null;
  if (user.role === "Admin") {
    buttonGroup = (
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContents: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {profileButton}
        {notesButton}
        {newNotesButton}
        {usersButton}
        {newUsersButton}
      </Box>
    );
  } else {
    buttonGroup = (
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContents: "flex-start",
          alignItems: "flex-start",
        }}
      >
        {profileButton}
        {notesButton}
        {newNotesButton}
      </Box>
    );
  }

  // Content to be rendered
  // Only show the "View User Settings" and "Add New User" links if the user is a manager or admin
  const content = (
    <AppBar
      position="sticky"
      color="background"
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "fit-content",
        gap: "0.8rem",
        p: 2,
      }}
    >
      <Box component="div">
        <Avatar
          alt="User Avatar"
          src={user.avatarUrl}
          variant="rounded"
          sx={{
            width: { xs: "12rem", sm: "20rem", lg: "9rem" },
            height: { xs: "12rem", sm: "20rem", lg: "9rem" },
            mt: { xs: 0, lg: 2 },
            mb: { xs: 1.5, sm: 1, lg: 0 },
          }}
        />
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.3rem", sm: "2rem", lg: "1rem" },
            mt: { sm: 1.5, lg: 1.2 },
            mb: { xs: 0.5, sm: 1, lg: 0.5 },
          }}
        >
          {user.username}
        </Typography>
        <Typography sx={{ fontSize: { xs: "1.3rem", sm: "2rem", lg: "1rem" } }}>
          {user.role}
        </Typography>
      </Box>
      {buttonGroup}
    </AppBar>
  );

  return content;
};

export default Menu;
