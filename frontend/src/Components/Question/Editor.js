import React, { useState, useEffect, useRef } from "react";
import Compile from "./../../APIs/Compiler";
import RadioButtonChecked from "@mui/icons-material/RadioButtonChecked";
import LanguageSelector from "./LanguageSelector";
import LOADING from "./../../Media/loading.svg";
import { addSubmission } from "../../APIs/Submission";
import { useUser } from "@clerk/clerk-react";

import { useLocation,useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { updateUser, updateSubmission } from "./../../APIs/User";
import { stringify } from "qs";

const Editor = ({ input, output, submitted, question,solve }) => {
  
  const location = useLocation(); 
  const [code, setCode] = useState("");
  
  const [socket, setSocket] = useState(null);
  const [language, setLanguage] = useState("");
  const textAreaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState([]);
  const { user } = useUser();
  console.log(solve+" hah ")
  useEffect(() => {
    
    const ws = new WebSocket('ws://localhost:8080/');
    setSocket(ws);
    const lines = code.split("\n").length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
      console.log("connectedddd");
      ws.onmessage = (event) => {
        var dup=event.data;
        toast(dup);
        alert(dup);
      };
   
  ws.onopen = () => {
      const message = JSON.stringify({
        type: 'add',
        email: user,
        url: (location.pathname.toString().substring(1)).toString()
      });
      console.log(location.pathname)
    ws.send(message); // Send the message
  }; return () => {
    ws.close();
}
  }, [user,code]);

  const handleScroll = () => {
    if (textAreaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textAreaRef.current.scrollTop;
    }
  };

  const runCode = async () => {
    const element = document.getElementById("runButton");
    const load = document.getElementById("loading");
    if (element && load) {
      element.style.cursor = "not-allowed";
      element.style.transform = "scale(0.9)";
      load.style.display = "flex";
    }
    if (!language) {
      alert("Please select a valid language !");
      if (element) {
        element.style.cursor = "pointer";
        element.style.transform = "scale(1)";
        load.style.display = "none";
      }
      return;
    }
    try {
      const res = await Compile({ code, language, input });
      await output(res);
    } catch (error) {
      console.error("Error compiling code:", error);
      output({ status: 500, message: "Some error occurred!" });
    } finally {
      if (element) {
        element.style.cursor = "pointer";
        element.style.transform = "scale(1)";
        load.style.display = "none";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const newValue =
        code.substring(0, selectionStart) + "\t" + code.substring(selectionEnd);
      setCode(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
      }, 0);
    }
  };
  const submitCode = async () => {
    const element = document.getElementById("submitButton");
    const load = document.getElementById("loading");

    const setLoadingState = (isLoading) => {
      if (element && load) {
        element.style.cursor = isLoading ? "not-allowed" : "pointer";
        element.style.transform = isLoading ? "scale(0.9)" : "scale(1)";
        load.style.display = isLoading ? "flex" : "none";
      }
    };

    setLoadingState(true);

    if (!language) {
      alert("Please select a valid language !");
      setLoadingState(false);
      return;
    }

    let res = true;
    if(!solve){try {
      let tested = false;
      if (question?.TestCases && question?.TestCases.length > 0) {
        const promises = question.TestCases.map((test) =>
          Compile({ code, language, input: test.input })
        );
        const results = await Promise.all(promises);

        results.forEach((result, index) => {
          if (
            result.output.trim() !== question.TestCases[index].output.trim()
          ) {
            res = false;
          }
        });
        tested = true;
      }

      if (res && question && tested) {
        let res = await updateSubmission({
          email: user?.primaryEmailAddress.emailAddress,
          profile: user?.imageUrl,
          name: user?.fullName,
        });
        let updation = await updateUser({
          email: user?.primaryEmailAddress.emailAddress,
          profile: user?.imageUrl,
          name: user?.fullName,
          rating: question?.Rating,
          name: question?.Name,
          number: question?.Number,
          lavel: question?.Lavel,
        });
        if (updation.status !== 500) {
          submitted("PASSED");
        } else {
          submitted("ERROR");
        }
      } else {
        submitted("FAILED");
      }
    } catch (error) {
      console.error("Error compiling code for TestCases:", error);
      submitted("ERROR");
    } finally {
      setLoadingState(false);
      await addSubmission({
        Email: user.primaryEmailAddress.emailAddress,
        Code: code,
        Language: language,
        Status: res ? "Passed" : "Failed",
      });
    }}else{
      const [_, contestId, problemId] = solve.match(/contest\/(\d+)\/problem\/(\w+)/) || [];
      window.open(`https://codeforces.com/contest/${contestId}/submit/${problemId}`)
      
      console.log('sent 1 ');
      const message = JSON.stringify({
        type: 'refresh',
        email: user,
        cfHandle: localStorage.getItem('cfHandle')
      });
      socket.send(message)
    }
  };

  return (
    <div className="bg-Color02 h-full rounded-lg border-2 border-Color06">
      <div className="bg-Color05 border-b-2 border-Color06 rounded-t-lg h-14 flex flex-row justify-between items-center md:p-8 p-2">
        <div className="md:w-32">
          <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>
        <img
          className="w-20 h-10 scale-110 hidden"
          id="loading"
          src={LOADING}
          alt="Loading"
        />
        <div className="flex flex-row">
          <button
            id="runButton"
            className="p-2 bg-green-700 border-2 text-white md:w-20 w-16 rounded-md mr-4 font-semibold cursor-pointer"
            onClick={runCode}
          >
            Run
          </button>
          <button
            id="submitButton"
            className="p-2 bg-orange-500 border-2 text-white rounded-lg md:w-20 w-18 font-semibold cursor-pointer"
            onClick={submitCode}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="flex md:h-full h-screen mt-10 md:m-6 m-2 md:p-4 p-0">
        <div className="relative flex w-full h-4/5 bg-white rounded-lg overflow-hidden">
          <div
            className="absolute top-0 left-0 w-6 md:w-12 bg-Color04 text-gray-500 p-2 text-right select-none h-full overflow-hidden pt-4"
            ref={lineNumbersRef}
          >
            {lineNumbers.map((lineNumber) => (
              <div
                key={lineNumber}
                className="flex justify-center items-center p-1"
              >
                <RadioButtonChecked
                  style={{ fontSize: "12px", margin: "2px" }}
                />
              </div>
            ))}
          </div>
          <textarea
            id="textbox"
            ref={textAreaRef}
            className="flex-1 p-4 md:pl-16 pl-8 resize-none outline-none overflow-y-scroll h-full bg-Color01 text-Color07 font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            style={{minHeight:'80vh'}}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Editor;
