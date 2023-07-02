import DarkModeIcon from "@mui/icons-material/DarkMode";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { Box, IconButton, Paper } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ColorLink from "../components/ColorLink";
import { toggleTheme } from "../features/theme/themeSlice";
import useAuth from "../hooks/useAuth";
import ConfirmIconModal from "./ConfirmIconModal";
import LoadingScreen from "./LoadingScreen";

// Use these regex patterns to compare the location to the URL to verify which location we're on or not on -> use this to decide whether we want to display specific buttons in the header or not
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

/**
 * @description The header component for the dashboard
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const DashHeader = () => {
  // Get the user status from the useAuth custom hook
  const { user } = useAuth();
  const auth = useAuth();
  const { theme } = useSelector(state => state.theme);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Button handlers
  const onNewNoteClicked = () => navigate("/dash/notes/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNotesClicked = () => navigate("/dash/notes");
  const onUsersClicked = () => navigate("/dash/users");

  // Theme switching
  const handleChangeTheme = () => {
    dispatch(toggleTheme());
    window.localStorage.setItem("theme", theme);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await auth.logout(() => {
        navigate("/");
        setIsLoading(false);
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMenuClicked = () => {
    if (pathname.includes("/dash/menu")) {
      navigate(-1);
    }
    navigate("/dash/menu");
  };

  // Buttons and whether we want to render them depending on the path
  let newNoteButton = null;
  // Use regex patterns to check the pathname. If the pathname matches a pattern, we'll render that button
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <IconButton title="New Note" onClick={onNewNoteClicked}>
        <NoteAddIcon
          sx={{ fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" } }}
        />
      </IconButton>
    );
  }

  // Only render the 'New User' button if we're on the User List page. Here, we don't need to check whether the user is an Admin or a Manager because only admins and managers can access the 'User List' page anyway (only admins and managers can access this page and click this button to create a new user)
  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <IconButton title="New User" onClick={onNewUserClicked}>
        <PersonAddIcon
          sx={{ fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" } }}
        />
      </IconButton>
    );
  }

  let userButton = null;
  // Only render the 'User' button if the user is a manager or admin
  if (user.role === "Admin") {
    // We're making sure that we're not on the User List and the pathname includes 'dash' -> We don't want to provide the 'User' button to go to the same page that we're on. We also want to make sure that we're on the protected pages with 'dash'
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <IconButton title="Users" onClick={onUsersClicked}>
          <SupervisedUserCircleIcon
            sx={{ fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" } }}
          />
        </IconButton>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <IconButton title="Notes" onClick={onNotesClicked}>
        <DescriptionIcon
          sx={{ fontSize: { xs: "2rem", sm: "3rem", lg: "1.5rem" } }}
        />
      </IconButton>
    );
  }

  // Create the toggle theme button
  const themeButton = (
    <IconButton onClick={handleChangeTheme}>
      <DarkModeIcon
        sx={{ fontSize: { xs: "1.5rem", sm: "3rem", lg: "1.5rem" } }}
      />
    </IconButton>
  );

  const menuButton = (
    <IconButton
      onClick={handleMenuClicked}
      sx={{ display: { xs: "flex", lg: "none" } }}
    >
      <MenuIcon sx={{ fontSize: { xs: "1.4rem", sm: "3rem", lg: "1.5rem" } }} />
    </IconButton>
  );

  const buttonContent = (
    <>
      {themeButton}
      <Box component="div" sx={{ display: { xs: "none", md: "block" } }}>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
      </Box>
    </>
  );

  // Content to be rendered
  // Put the error message just above the header so that it will be rendered on top of the header, not inside the header
  const content = (
    <Paper
      variant="outlined"
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        p: { xs: 1, lg: 2 },
        maxWidth: "100%",
        borderRadius: 0,
        backgroundColor: "primary.main",
      }}
    >
      {menuButton}
      <ColorLink
        to="/dash/notes"
        className="dash-header__title"
        component={Link}
        sx={{
          fontSize: { xs: "1.4rem", sm: "3rem", lg: "2rem" },
          pl: 1,
          color: "white",
        }}
      >
        Meganote
      </ColorLink>

      <Box
        component="nav"
        sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
      >
        {buttonContent}
      </Box>
      <ConfirmIconModal
        buttonIcon={
          <LogoutIcon
            sx={{ fontSize: { xs: "1.4rem", sm: "3rem", lg: "1.5rem" } }}
          />
        }
        title="Log Out"
        content="Are you sure you want to log out of Meganote?"
        handleConfirm={handleLogout}
        variant="contained"
        size="large"
        yesText="Log out"
        noText="Cancel"
      />
    </Paper>
  );

  if (isLoading) {
    return <LoadingScreen />;
  } else {
    return content;
  }
};

export default DashHeader;
