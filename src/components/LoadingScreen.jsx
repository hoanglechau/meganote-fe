import { CircularProgress, Paper } from "@mui/material";

function LoadingScreen() {
  return (
    <Paper
      sx={{
        position: "absolute",
        minHeight: "80vh",
        width: { xs: "100vw", lg: "80vw" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
      elevation={0}
    >
      <CircularProgress color="primary" />
    </Paper>
  );
}

export default LoadingScreen;
