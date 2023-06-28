import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const ColorButton = ({ variant, color, to, children }) => {
  const linkStyle = {
    color: "#FFFFFF",
    textDecoration: "none",
    cursor: "pointer",
    borderRadius: "8px",
  };

  return (
    <Button
      variant={variant}
      color={color}
      component={Link}
      to={to}
      style={linkStyle}
    >
      {children}
    </Button>
  );
};

export default ColorButton;
