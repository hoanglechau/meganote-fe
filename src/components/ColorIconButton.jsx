import { IconButton, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

const ColorIconButton = ({ variant, color, to, children, ...other }) => {
  const theme = useTheme();

  const linkStyle = {
    color: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
    cursor: "pointer",
    borderRadius: "8px",
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  };

  const iconStyle = {
    p: { xs: 0.5, lg: 1 },
    "&:hover": { backgroundColor: "primary.main" },
    fontSize: { xs: "1.3rem", sm: "2rem", lg: "1.2rem" },
  };

  return (
    <IconButton
      variant={variant}
      color={color}
      component={Link}
      to={to}
      style={linkStyle}
      sx={iconStyle}
      size="small"
      {...other}
    >
      {children}
    </IconButton>
  );
};

export default ColorIconButton;
