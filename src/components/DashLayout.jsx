import { Box, Divider, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";
import Menu from "../features/auth/Menu";
import DashHeader from "./DashHeader";

const DashLayout = () => {
  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <DashHeader />

      <Paper
        elevation={0}
        component="div"
        sx={{ display: "flex", flex: 1, height: "100%", width: "100%" }}
      >
        <Box
          component="div"
          sx={{
            flex: 0.2,
            display: { xs: "none", lg: "flex" },
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Menu />
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", lg: "flex" } }}
        />

        <Box
          component="div"
          sx={{
            flex: 1,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Paper>
    </Box>
  );
};

export default DashLayout;
