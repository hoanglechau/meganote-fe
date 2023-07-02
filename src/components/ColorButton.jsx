import { Button } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * @description A button component that works with react-router-dom
 * @param {string} variant
 * @param {string} color
 * @param {string} to
 * @param {*} children
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
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
