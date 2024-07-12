import React from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { Skeleton } from "@mui/material";

function Discription({ question }) {
  return (
    <div className="rounded-lg bg-Color02 h-3/5 mb-4 p-8 overflow-y-auto">
      {question ? (
        <div>
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-Color07 font-bold text-3xl ">
              {question?.Number}. {question?.Name}
            </h1>
            {question?.Lavel == "Easy" ? (
              <h1 className="font-semibold bg-green-500 w-20 text-center p-1 rounded-full bg-opacity-15 text-green-600">
                Easy
              </h1>
            ) : question?.Lavel == "Medium" ? (
              <h1 className="font-semibold bg-yellow-400 w-20 text-center p-1 rounded-full bg-opacity-15 text-yellow-500">
                Medium
              </h1>
            ) : (
              <h1 className="font-semibold bg-red-500 w-20 text-center p-1 rounded-full bg-opacity-15 text-red-500">
                Hard
              </h1>
            )}
          </div>
          <p className="text-Color07 p-4 mt-4">{question?.Details}</p>
          <div className="text-Color07 p-4">
            <h2 className="text-xl font-semibold">Input Format :</h2>
            <p className="ml-4 mt-2">{question?.InputFormat}</p>
          </div>
          <div className="text-Color07 p-4">
            <h2 className="text-xl font-semibold">Output Format :</h2>
            <p className="ml-4 mt-2">{question?.OutputFormat}</p>
          </div>
          <div className="text-Color07 p-4">
            <h2 className="text-xl font-semibold">Example :</h2>
            <p className="pl-4 mt-2"> Input -: {question?.Example.Input}</p>
            <p className="pl-4 mt-2"> Output -: {question?.Example.Output}</p>
          </div>
          <div className="text-Color07 p-4">
            <h2 className="text-xl font-semibold">Constrains :</h2>
            <p className="pl-4 mt-2">{question?.Constrains}</p>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <Skeleton
              sx={{
                bgcolor: "grey.900",
                borderRadius: "5px",
                backgroundColor: "grey.700",
              }}
              variant="rectangular"
              width="70%"
              height={50}
            />
          </div>
          <div className="mt-10 w-full flex justify-center">
            <Skeleton
              sx={{ bgcolor: "grey.800", borderRadius: "5px" }}
              variant="rectangular"
              width="90%"
              height={118}
            />
          </div>
          <div className="mt-10 flex justify-center">
            <Skeleton
              sx={{ bgcolor: "grey.800", borderRadius: "5px" }}
              variant="rectangular"
              width="90%"
              height={118}
            />
          </div>
          <div className="mt-10 flex justify-center">
            <Skeleton
              sx={{ bgcolor: "grey.800", borderRadius: "5px" }}
              variant="rectangular"
              width="90%"
              height={118}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Discription;
