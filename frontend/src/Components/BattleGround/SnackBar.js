import React from "react";
import Snackbar from "@mui/material/Snackbar";
import SnackbarContent from "@mui/material/SnackbarContent";
import { styled } from "@mui/system";
import ErrorIcon from "@mui/icons-material/Error";

const StyledSnackbarContent = styled(SnackbarContent)(({ theme }) => ({
  backgroundColor: "#f44336", // Error color
  display: "flex",
  alignItems: "center",
}));

const CustomSnackbar = ({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose}>
      <StyledSnackbarContent
        message={
          <span style={{ display: "flex", alignItems: "center" }}>
            <ErrorIcon style={{ marginRight: 8 }} />
            {message}
          </span>
        }
      />
    </Snackbar>
  );
};

export default CustomSnackbar;
