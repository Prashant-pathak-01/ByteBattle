import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import one from "./../../Media/Battleground/avatars/A1.png";
import two from "./../../Media/Battleground/avatars/A2.png";
import three from "./../../Media/Battleground/avatars/A3.png";
import four from "./../../Media/Battleground/avatars/A4.png";
import five from "./../../Media/Battleground/avatars/A5.png";
import six from "./../../Media/Battleground/avatars/A6.png";
import seven from "./../../Media/Battleground/avatars/A7.png";
import eight from "./../../Media/Battleground/avatars/A8.png";
import nine from "./../../Media/Battleground/avatars/A9.png";
import ten from "./../../Media/Battleground/avatars/A10.png";
import eleven from "./../../Media/Battleground/avatars/A11.png";

const imageUrls = [
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  ten,
  eleven,
];

const RollingButton = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          backgroundColor: "#292828",
          color: "white",
          boxShadow: "10px 10px 10px black",
          border: "4px solid grey",
          borderRadius: "14px",
        },
      }}
      disableEscapeKeyDown
      disableBackdropClick
    >
      <div className="flex flex-col justify-center items-center p-6 pt-6 shadow-lg stroke-fuchsia-50">
        <h1 className="text-2xl mb-10 font-semibold text-Color07">
          Finding Match
        </h1>
        <img
          src={imageUrls[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          style={{
            width: "150px",
            height: "150px",
            transition: "opacity 0.5s ease-in-out",
            opacity: 1,
          }}
        />
        <p className=" mt-12 mb-6 w-4/5 h-0.5 bg-red-100 opacity-15 rounded-md"></p>
        <div className="p-4 pt-0">
          <h2 className="text-xl text-slate-300 text-center">Instructions</h2>
          <ul className="mt-2 ml-6 list-disc text-sm font-thin text-slate-400">
            <li>
              Only submissions from your entered Codeforces account will be
              counted. Ensure the correct ID is entered.
            </li>
            <li>Use your personal editor to write code.</li>
            <li>Do not refresh the arena page, or you will lose connection.</li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
};

export default RollingButton;
