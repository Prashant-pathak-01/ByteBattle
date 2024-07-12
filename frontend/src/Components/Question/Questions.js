import React, { useEffect, useState } from "react";
import Discription from "./Discription";
import TestCases from "./TestCases";
import Editor from "./Editor";
import { useLocation } from "react-router-dom";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { getQuestion } from "../../APIs/questions";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Header from "../HomePage/Header";
function Questions() {
  const [question, setQuestion] = useState();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [submitted, setSubmitted] = useState("");
  const location = useLocation();
  const path = location.pathname.split("/");

  useEffect(() => {
    const getData = async () => {
      let res = await getQuestion({ id: path[path.length - 1] });
      setQuestion(res.data);
      setInput(res.data?.TestCases[0]?.input);
    };
    getData();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSubmitted("");
  };

  const getSeverity = () => {
    if (submitted === "PASSED") {
      return "success";
    } else if (submitted === "ERROR") {
      return "error";
    } else if (submitted === "FAILED") {
      return "warning";
    }
    return "info";
  };

  return (
    <div className="overflow-hidden bg-color01">
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/sheet"} />
      </SignedOut>
      <SignedIn>
        <Header></Header>

        <div className="flex md:flex-row flex-col justify-between md:h-screen bg-Color01">
          <div className="flex flex-col md:w-1/2 m-4">
            <Discription question={question}></Discription>
            <TestCases
              testcases={input}
              setTestcases={setInput}
              output={
                output?.output?.trim() != "" ? output?.output : output?.error
              }
            ></TestCases>
          </div>
          <div className="md:w-1/2 m-4">
            <Editor
              input={input}
              output={setOutput}
              question={question}
              submitted={setSubmitted}
            ></Editor>
            <Snackbar
              open={
                submitted === "PASSED" ||
                submitted === "ERROR" ||
                submitted === "FAILED"
              }
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleSnackbarClose}
                severity={getSeverity()}
              >
                {submitted === "PASSED" && "Accepted !"}
                {submitted === "ERROR" && "Error occurred."}
                {submitted === "FAILED" &&
                  "Some testcases failed. Please retry again."}
              </MuiAlert>
            </Snackbar>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default Questions;
