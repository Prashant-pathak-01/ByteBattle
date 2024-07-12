import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { border, borderRadius, minHeight, minWidth } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "40%",
  minHeight: "60%",
  bgcolor: "grey.900",
  borderRadius: "10px",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ close, data }) {
  console.log(data);
  return (
    <div>
      <Modal
        open={true}
        onClose={() => close(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
            <h1 className="border-b-2 pb-2 mb-6 font-bold pl-2 text-white  p-1 text-xl">
              {Math.abs(new Date(data?.createdAt).getTime() % 1000000)}
            </h1>
            <div className="flex flex-row justify-between">
              <h1 className="text-lg text-yellow-300 font-semibold ml-4">
                Language - {data?.Language}
              </h1>
              {data?.Status === "Failed" ? (
                <h1 className="text-md text-red-500 font-semibold mr-6">
                  {" "}
                  Failed
                </h1>
              ) : (
                <h1 className="text-md text-green-600 font-semibold mr-6">
                  Passed
                </h1>
              )}
            </div>
          </div>
          <div
            style={{
              overflowY: "auto",
              backgroundColor: "#2D2D2D",
              color: "white",
              padding: "1rem",
              borderRadius: "5px",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              marginTop: "1rem",
            }}
          >
            <pre>
              <code>{data?.Code}</code>
            </pre>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
