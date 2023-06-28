import { CircularProgress, Paper } from "@mui/material";

function LoadingPage() {
  return (
    <Paper
      sx={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
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

export default LoadingPage;
