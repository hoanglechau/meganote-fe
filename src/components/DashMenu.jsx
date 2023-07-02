import { Container, Paper } from "@mui/material";
import Menu from "../features/auth/Menu";

/**
 * @description The navigation menu for tablets and mobile devices
 * @author [Hoang Le Chau](https://github.com/hoanglechau)
 */
const DashMenu = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: { xs: "87vh", sm: "87vh", lg: "87vh" },
        maxHeight: { xs: "90vh", sm: "87vh", lg: "87vh" },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 3, sm: 5, lg: 2.5 },
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: { xs: 0, sm: 2, lg: 3 },
          border: "1px solid #ccc",
          boxShadow: "none",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Menu />
      </Paper>
    </Container>
  );
};

export default DashMenu;
