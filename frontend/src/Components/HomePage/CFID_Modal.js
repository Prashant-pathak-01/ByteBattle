import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { updateCFID } from "../../APIs/User";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AlertDialogSlide({ open, close }) {
  const [data, setData] = React.useState();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("success");
  const { user } = useUser();

  const AddCFID = async () => {
    try {
      let res = await updateCFID({
        email: user?.primaryEmailAddress.emailAddress,
        cfId: data,
      });
      if (res.data.status === 1) {
        setSnackbarMessage("Codeforces ID added successfully!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage("Failed to add Codeforces ID.");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setTimeout(() => {
        close();
      }, 2000); // Adjust delay time as needed (2000ms = 2 seconds)
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/dashboard"} />
      </SignedOut>
      <SignedIn>
        <React.Fragment>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={close}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
              style: {
                backgroundColor: "#292828",
                color: "white",
              },
            }}
          >
            <h2 className="ml-6 mt-6 font-semibold text-2xl">Codeforces ID</h2>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-slide-description"
                style={{
                  color: "white",
                  marginLeft: "20px",
                  marginBottom: "10px",
                }}
              >
                Please enter your Codeforces ID to participate in the activity.
                You cannot proceed without it.
              </DialogContentText>
              <div className="flex items-center justify-center mt-4">
                <input
                  className="p-2 pl-4 bg-Color04 rounded-md w-3/4 border-2 border-Color06 focus:outline-none font-mono text-lg"
                  onChange={(e) => setData(e.target.value)}
                  placeholder="Enter your Codeforces ID"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <button
                onClick={AddCFID}
                className="p-2 bg-blue-500 border-2 hover:scale-95 transition-all w-24 rounded-md m-4"
              >
                Add
              </button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      </SignedIn>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
