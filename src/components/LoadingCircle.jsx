import { CircularProgress, Paper } from "@mui/material";

const LoadingCircle = () => {
  return (
    <Paper
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "transparent",
        minHeight: { xs: 0, sm: "60vh" },
        height: { xs: "max-content", sm: "100%" },
        maxWidth: "100%",
      }}
      elevation={0}
    >
      <CircularProgress color="primary" />
    </Paper>
  );
};

export default LoadingCircle;
