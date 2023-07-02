import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * @description A link component that works with react-router-dom
 * @param {string} variant
 * @param {string} color
 * @param {string} to
 * @param {*} children
 * @param {object} other
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const ColorLink = ({ variant, to, color, children, ...other }) => {
  const theme = useTheme();

  const linkStyle = {
    color:
      theme.palette.mode === "dark"
        ? theme.palette.text.dark
        : theme.palette.text.light,
    textDecoration: "none",
    cursor: "pointer",
  };

  return (
    <Typography
      variant={variant}
      color={color}
      component={Link}
      to={to}
      style={linkStyle}
      {...other}
    >
      {children}
    </Typography>
  );
};

export default ColorLink;
