import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export default function ConfirmModal({
  buttonIcon,
  title,
  content,
  handleConfirm,
  yesText,
  noText,
  ...other
}) {
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYes = () => {
    handleClose();
    handleConfirm();
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen} {...other}>
        {buttonIcon}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor:
              theme.palette.mode === "dark" ? "#333333" : "#FFFFFF",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            {noText}
          </Button>
          <Button onClick={handleYes} color="warning">
            {yesText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
