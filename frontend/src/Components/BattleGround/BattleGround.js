import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  useUser,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "katex/dist/katex.min.css";
import Header from "./../HomePage/Header";
import {
  convertContent,
  decodeHtmlEntities,
  updateGameResult,
} from "./../../APIs/Game";
import Timer from "./Timer";
import { userData } from "./../../APIs/User";
import P1Profile from "./../../Media/Battleground/avatars/A2.png";
import P2Profile from "./../../Media/Battleground/avatars/A1.png";
import WINNER01 from "./../../Media/Battleground/trophy.png";
import WINNER02 from "./../../Media/Battleground/medal.png";
import { Skeleton, Typography } from "@mui/material";

function BattleGround() {
  const location = useLocation();
  const currentPath = location.pathname;

  const { user } = useUser();
  const [User, setUser] = useState();
  const [players, setPlayers] = useState({});
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const [socket, setSocket] = useState(null);
  const [problem, setProblem] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [inputSpecification, setInputSpecification] = useState("");
  const [outputSpecification, setOutputSpecification] = useState("");
  const [sampleInputs, setSampleInputs] = useState([]);
  const [sampleOutputs, setSampleOutputs] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://20.198.25.250:8000/");
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      setSocket(ws);
      const message = JSON.stringify({
        type: "add",
        email: userEmail,
        url: location.pathname.toString().substring(1),
      });
      ws.send(message);
    };

    ws.onmessage = async (event) => {
      const message = event.data;
      if (message == User?.CFID) {
        const win01 = document.getElementById("player01");
        win01.style.backgroundColor = "green";
        const winnerImage = win01.querySelector("img.hidden");
        winnerImage?.classList.remove("hidden");
        const loose02 = document.getElementById("player02");
        loose02.style.backgroundColor = "red";
      } else {
        const win02 = document.getElementById("player02");
        win02.style.backgroundColor = "green";
        const loose01 = document.getElementById("player01");
        loose01.style.backgroundColor = "red";
        const winnerImage = win02.querySelector("img.hidden");
        winnerImage?.classList.remove("hidden");
      }
      setWinner(message);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [userEmail, location.pathname]);

  useEffect(() => {
    const updateScore = async () => {
      if (winner == User?.CFID) {
        await updateGameResult({ email: User?.Email, result: 1 });
      } else {
        await updateGameResult({ email: User?.Email, result: -1 });
      }
    };
    if (winner != null) updateScore();
  }, [winner]);

  useEffect(() => {
    const fetchProblemData = async () => {
      if (user) {
        try {
          const response = await axios.post(
            "http://20.198.25.250:8000/getCFurl",
            {
              email: userEmail,
              location: currentPath,
            }
          );
          setPlayers({ p1: response.data.p1, p2: response.data.p2 });
          setProblem(response.data);
          const pageResponse = await axios.post(
            "http://20.198.25.250:8000/getQuestionDetails",
            {
              url: response.data.message,
            }
          );

          const {
            problemStatement,
            inputSpecification,
            outputSpecification,
            sampleInputs,
            sampleOutputs,
          } = pageResponse?.data;

          setProblemStatement(
            convertContent(decodeHtmlEntities(problemStatement) || "")
          );
          setInputSpecification(
            convertContent(
              decodeHtmlEntities(inputSpecification) || ""
            ).substring(41)
          );
          setOutputSpecification(
            convertContent(
              decodeHtmlEntities(outputSpecification) || ""
            ).substring(42)
          );
          setSampleInputs(sampleInputs[0].split("\n") || []);
          setSampleOutputs(sampleOutputs[0].split("\n") || []);
        } catch (error) {
          console.error("Error fetching problem data:", error);
        }
      }
    };
    fetchProblemData();
    const getData = async () => {
      let res = await userData({ email: userEmail });
      setUser(res?.data);
    };
    getData();
  }, [user, currentPath, userEmail]);

  const handleSubmit = async () => {
    if (problem) {
      const [_, contestId, problemId] =
        problem.message.match(/contest\/(\d+)\/problem\/(\w+)/) || [];
      window.open(
        `https://codeforces.com/contest/${contestId}/submit/${problemId}`
      );
      const message = JSON.stringify({
        type: "refresh",
        email: user,
        cfHandle: localStorage.getItem("cfHandle"),
      });
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.error("WebSocket is not open. Cannot send message.");
      }
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn redirectUrl={currentPath} />
      </SignedOut>
      <SignedIn>
        <Header />
        <div className="bg-Color01 flex md:flex-row flex-col md:h-screen">
          <div className="md:w-full flex flex-col md:m-10 m-4 bg-Color04 rounded-lg border-8 border-Color04 overflow-auto p-4 text-Color07">
            {problemStatement ? (
              <div>
                <h2 className="font-semibold text-xl">Problem Statement</h2>
                <div
                  className="font-serif m-4"
                  dangerouslySetInnerHTML={{ __html: problemStatement }}
                />
                <div>
                  <h2 className="font-semibold text-xl">Input Format</h2>
                  <div
                    className="font-serif m-4"
                    dangerouslySetInnerHTML={{ __html: inputSpecification }}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-xl">Output Format</h2>
                  <div
                    className="font-serif m-4"
                    dangerouslySetInnerHTML={{ __html: outputSpecification }}
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-xl">Sample input</h2>
                  <div className="m-4 text-sm font-mono">
                    {sampleInputs.map((input, index) => (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: input }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-xl">Sample output</h2>
                  <div className="m-4 text-sm font-mono">
                    {sampleOutputs.map((output, index) => (
                      <div
                        key={index}
                        dangerouslySetInnerHTML={{ __html: output }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <p className="w-60 m-10 h-14 mb-0">
                  <Skeleton height="100%" width={"100%"}></Skeleton>
                </p>
                <p className="flex justify-center flex-col items-center h-60 ml-10">
                  <Skeleton height="100%" width={"90%"}></Skeleton>
                </p>
                <p className="w-60 m-10 h-14 mb-0">
                  <Skeleton height="100%" width={"100%"}></Skeleton>
                </p>
                <p className="flex justify-center flex-col items-center h-60 ml-10">
                  <Skeleton height="100%" width={"90%"}></Skeleton>
                </p>
                <p className="w-60 m-10 h-14 mb-0">
                  <Skeleton height="100%" width={"100%"}></Skeleton>
                </p>
                <p className="flex justify-center flex-col items-center h-60 ml-10">
                  <Skeleton height="100%" width={"90%"}></Skeleton>
                </p>
              </div>
            )}
          </div>

          <div className="md:w-2/5 md:ml-0 m-4 bg-Color04 md:m-10 rounded-lg ">
            <div className="font-semibold font-mono justify-center text-white flex pt-10">
              <h1 className="absolute mr-40 bg-Color04  text-xl p-2 rounded-lg border-2">
                Players
              </h1>
              {players.p1 == User?.CFID ? (
                <div className="flex flex-col items-center h-60  border-2 rounded-lg p-6 w-full m-4 mt-6 pt-8">
                  <div
                    className="bg-Color06 md:text-base text-sm p-3 m-1 w-full cursor-pointer hover:bg-Color01 transition-all flex flex-row items-center rounded-lg "
                    id="player01"
                  >
                    <img src={P1Profile} className="w-10 mr-4"></img>
                    {problemStatement ? (
                      <h2>{players.p1}</h2>
                    ) : (
                      <p className="w-60 h-10 mb-0">
                        <Skeleton height="100%" width={"90%"}></Skeleton>
                      </p>
                    )}
                    <img
                      src={WINNER02}
                      className="md:w-8 w-6  md:ml-8 ml-4 hidden"
                    ></img>
                  </div>
                  <div
                    className="bg-Color06 md:text-base text-sm p-3 m-1 w-full cursor-pointer hover:bg-Color01 transition-all flex flex-row items-center rounded-lg "
                    id="player02"
                  >
                    <img src={P2Profile} className="w-10 mr-4"></img>
                    {problemStatement ? (
                      <h2>{players.p2}</h2>
                    ) : (
                      <p className="w-60 h-10 mb-0">
                        <Skeleton height="100%" width={"90%"}></Skeleton>
                      </p>
                    )}
                    <img
                      src={WINNER01}
                      className="md:w-8 w-6  md:ml-8 ml-4 hidden"
                    ></img>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center h-60 border-2 rounded-lg p-6 w-full m-4 mt-6 pt-8">
                  <div
                    className="bg-Color06 md:text-base text-sm p-3 m-1 w-full cursor-pointer hover:bg-Color01 transition-all flex flex-row items-center rounded-lg "
                    id="player02"
                  >
                    <img src={P2Profile} className="w-10 mr-4"></img>
                    {problemStatement ? (
                      <h2>{players.p2}</h2>
                    ) : (
                      <p className="w-60 h-10 mb-0">
                        <Skeleton height="100%" width={"90%"}></Skeleton>
                      </p>
                    )}
                    <img
                      src={WINNER02}
                      className="md:w-8 w-6  md:ml-8 ml-4 hidden"
                    ></img>
                  </div>
                  <div
                    className="bg-Color06 md:text-base text-sm p-3 m-1 w-full cursor-pointer hover:bg-Color01 transition-all flex flex-row items-center rounded-lg "
                    id="player01"
                  >
                    <img src={P1Profile} className="w-10 mr-4"></img>
                    {problemStatement ? (
                      <h2>{players.p1}</h2>
                    ) : (
                      <p className="w-60 h-10 mb-0">
                        <Skeleton height="100%" width={"90%"}></Skeleton>
                      </p>
                    )}
                    <img
                      src={WINNER01}
                      className="md:w-8 w-6  md:ml-8 ml-4 hidden"
                    ></img>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Timer />
            </div>
            <div className="flex justify-center">
              <div>
                <button
                  className="relative inline-block text-lg group mb-14"
                  onClick={handleSubmit}
                >
                  <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-blue-600 transition-colors duration-300 ease-out border-2 border-blue-600 rounded-lg group-hover:text-white">
                    <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-blue-50"></span>
                    <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-blue-600 group-hover:-rotate-180 ease"></span>
                    <span className="relative">Submit Code</span>
                  </span>
                  <span
                    className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-blue-600 rounded-lg group-hover:mb-0 group-hover:mr-0"
                    data-rounded="rounded-lg"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}

export default BattleGround;
