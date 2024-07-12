import React, { useEffect, useState } from "react";
import AnimationHeader from "./../../Media/Animation-Header.svg";
import ShareIcon from "@mui/icons-material/Share";
import { useUser } from "@clerk/clerk-react";
import { getNumber } from "./../../APIs/User";
import { Snackbar, Button } from "@mui/material";
import { Alert } from "@mui/material";
function SheetHeader() {
  const { user } = useUser();
  const [solved, setSolved] = useState(0);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const getData = async () => {
      try {
        let res = await getNumber({
          email: user.primaryEmailAddress.emailAddress,
          profile: user.imageUrl,
          name: user.fullName,
        });
        setSolved(res.data.SolvedNumber);
      } catch (error) {
        console.error("Error fetching solved number:", error);
      }
    };
    getData();
  }, [user]);

  const copyToClipboard = async () => {
    const textToCopy = window.location.href;
    try {
      await navigator.clipboard.writeText(textToCopy);
      handleSnackbarOpen(
        "success",
        "Sheet's link is copied to clipboard! Share with your friends! "
      );
    } catch (error) {
      console.error("Error copying text to clipboard:", error);
      handleSnackbarOpen("error", "Failed to copy text to clipboard.");
    }
  };

  const handleSnackbarOpen = (severity, message) => {
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const progressBarWidth = `${(solved / 20) * 100}%`;

  return (
    <div className="w-full mt-10 rounded h-40 bg-Color02 flex flex-row items-center relative">
      <img
        className="w-44 h-40 ml-20 hidden md:flex"
        src={AnimationHeader}
        alt="Animation Header"
      />
      <div className="flex flex-col md:ml-20 ml-10">
        <h2 className="font-serif text-2xl font-semibold text-Color07 mb-2">
          ByteBattle Sheet
        </h2>
        <div className="flex flex-row items-center">
          <div className="md:w-80 w-56 bg-blue-100 h-3 rounded-full">
            <div
              className="bg-green-700 h-3 rounded-full"
              style={{ width: progressBarWidth }}
            ></div>
          </div>
          <h3 className="ml-4 font-bold text-lg text-Color07">{solved} / 20</h3>
        </div>
      </div>
      <div
        className="absolute bottom-4 right-0 mb-20 mr-4 bg-Color04 p-2 rounded-md border-2 border-Color06 text-Color07 cursor-pointer hover:scale-90 transition-all"
        onClick={copyToClipboard}
      >
        <ShareIcon />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SheetHeader;
