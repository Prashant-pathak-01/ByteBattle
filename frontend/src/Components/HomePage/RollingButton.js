import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const RollingButton = ({ onClose }) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          backgroundColor: "#292828",
          color: "white",
        },
      }}
    >
      <DialogTitle>
        Loading
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="flex justify-center items-center h-40">
        <CircularProgress color="inherit" />
      </DialogContent>
      + Other details
    </Dialog>
  );
};

export default RollingButton;
