import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { updateCFID, userData } from "./../../APIs/User";
import { Box, Typography } from "@mui/material";
import CF_LOGO from "./../../Media/Logo/code-forces.svg";
function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [User, setUser] = useState();
  const pieParams = { height: 200, margin: { right: 5 } };
  const [CFID, setCFID] = useState();
  const [updated, setUpdated] = useState(false);
  useEffect(() => {
    const getData = async () => {
      if (isSignedIn) {
        let res = await userData({
          email: user?.primaryEmailAddress.emailAddress,
          name: user?.fullName,
          profile: user?.imageUrl,
        });
        setUser(res?.data);
      }
    };
    getData();
  }, [isSignedIn, updated]);
  const updateCFid = async (cfid) => {
    let res = await updateCFID({ email: User?.Email, cfId: cfid });
    setUpdated(!updated);
  };

  return (
    <div className="bg-Color01 md:h-screen flex items-center justify-center">
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/dashboard"} />
      </SignedOut>
      <SignedIn>
        <div className="bg-Color02 m-4 p-4 md:w-4/5 w-80 md:p-6 rounded-lg mt-10 flex md:flex-row flex-col justify-between ">
          <div className="bg-Color04 md:w-1/3  md:m-4 mb-10 flex flex-col justify-between p-8 items-center">
            <h1 className="text-Color07 font-semibold text-xl w-full border-b-2 text-center pb-2 border-Color07">
              ByteBattle Sheet
            </h1>
            <div className="flex flex-col items-center">
              <img
                src={user?.imageUrl}
                className="rounded-full w-40 p-2 border-4 border-Color06 mt-6"
              ></img>
              <div>
                <h2 className="text-white text-sm p-2 font-sans text-center">
                  {User?.Email}
                </h2>
                <div className="flex flex-row justify-centerm-4">
                  <div className="flex items-center flex-col bg-Color05 shadow-lg text-white m-2 p-1 md:w-32 w-28 rounded-md">
                    <h2 className="font-semibold text-xl">{User?.Rating}</h2>
                    <h2>Points</h2>
                  </div>
                  <div className="flex items-center flex-col bg-Color05 shadow-lg text-white m-2 p-1 md:w-32 w-28 rounded-md">
                    <h2 className="font-semibold text-xl">
                      {User?.SubmissionNumber}
                    </h2>
                    <h2>Submissions</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col justify-center items-center w-full ">
              <div className="w-40">
                <Box flexGrow={1}>
                  <PieChart
                    series={[
                      {
                        data: [
                          { value: `${User?.Easy}`, color: "#33f537" },
                          { value: `${User?.Medium}`, color: "#e9fc3d" },
                          { value: `${User?.Hard}`, color: "#fc3030" },
                        ],
                      },
                    ]}
                    {...pieParams}
                  />
                </Box>
              </div>
              <div className="md:ml-4 flex md:flex-col flex-row">
                <div className="flex flex-col md:ml-10 md:w-20 w-16 text-sm  m-2 sm:w-20 items-center rounded-md pb-1  border-2 border-green-800  bg-green-500">
                  <h className="font-bold text-sm ">{User?.Easy}</h>
                  <p className="text-xxs font-sans sm:text-xs font-semibold">
                    Easy
                  </p>
                </div>
                <div className="flex flex-col  md:ml-10 md:w-20 w-16 text-sm  m-2 sm:w-20 items-center rounded-md pb-1 border-2 border-yellow-500  bg-yellow-300">
                  <h2 className="font-bold text-sm ">{User?.Medium}</h2>
                  <p className="text-xxs sm:text-xs font-sans font-semibold">
                    Medium
                  </p>
                </div>
                <div className="flex flex-col  md:ml-10 md:w-20 w-16 text-sm m-2 sm:w-20 items-center rounded-md pb-1 bg-red-400 border-2 border-red-500">
                  <h2 className="font-bold text-sm">{User?.Hard}</h2>
                  <p className="text-xxs  sm:text-xs font-sans font-semibold">
                    Hard
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-Color04 md:w-1/3 md:m-4 mb-10 flex flex-col p-8 items-center">
            <h1 className="text-Color07 font-semibold text-xl border-b-2 pb-2 w-full text-center border-Color07">
              ByteBattle Arena
            </h1>
            <div className="mt-6 flex flex-col">
              <div className="mb-2 items-center flex flex-col p-2">
                <img src={CF_LOGO} className="w-20 h-20 "></img>
                <div className="mt-4">
                  {User?.CFID == null ? (
                    <div className="flex md:flex-row flex-col items-center justify-center">
                      <input
                        className="bg-Color06 rounded-md p-1 focus:outline-none pl-4 text-white"
                        placeholder="Enter Codeforces Id"
                        onChange={(e) => setCFID(e.target.value)}
                      ></input>
                      <button
                        className="text-Color07 bg-blue-500 p-1 rounded-md ml-2 md:w-14 border-2 border-Color07 hover:scale-95 md:mt-0 mt-4 w-28"
                        onClick={() => updateCFid(CFID)}
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-row items-start">
                      <h2 className="text-white m-2">{User?.CFID}</h2>
                      <span
                        className="relative text-Color07 text-sm cursor-pointer p-1 rounded-full hover:text-blue-500"
                        onClick={() => {
                          updateCFid(null);
                        }}
                      >
                        <EditOutlinedIcon
                          className="absolute top-0 right-0 left-0 text-xs"
                          fontSize="small"
                        ></EditOutlinedIcon>
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="items-center flex justify-center flex-col w-full mt-4 h-full">
                <div className="flex flex-row md:w-72 w-64 bg-red-600 rounded-md border-2 cursor-pointer">
                  <span
                    className="bg-green-600 rounded-l-md border-2 border-green-700 hover:bg-green-700 transition-all"
                    style={{
                      width: `${
                        ((User?.Win || 0) * 100) /
                        ((User?.Win || 0) + (User?.Loose || 0))
                      }%`,
                    }}
                  >
                    .
                  </span>
                  <span
                    className="bg-red-500 rounded-r-md border-2 border-red-700 hover:bg-red-700 transition-all"
                    style={{
                      width: `${
                        ((User?.Loose || 0) * 100) /
                        ((User?.Win || 0) + (User?.Loose || 0))
                      }%`,
                    }}
                  ></span>
                </div>
                <div className="flex flex-row justify-between w-full p-8">
                  <div className="flex flex-col items-center bg-green-500 border-2 border-green-900   w-24 h-16 justify-center rounded-md ">
                    <h1 className="font-bold text-xl">{User?.Win}</h1>
                    <h1 className="text-sm font-serif">Won</h1>
                  </div>
                  <div className="flex flex-col items-center bg-red-500 border-2 border-red-700 w-24 h-16 justify-center rounded-md ">
                    <h1 className="font-bold text-xl">{User?.Loose}</h1>
                    <h1 className="text-sm font-serif">Lost</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-Color04 md:w-1/3  md:m-4 rounded-md border-2 border-Color06 flex flex-col">
            <h1 className="p-3 text-xl font-semibold text-Color07 border-b-2 rounded-t-md border-Color06">
              Solved Problems
            </h1>
            <div className="bg-Color03 rounded-b-md flex-1 overflow-y-auto">
              {User?.Solved?.length > 0 ? (
                User?.Solved.map((questionName) => (
                  <div className="bg-Color05 m-4 pl-4 p-2 rounded-sm text-white font-semibold">
                    {questionName}
                  </div>
                ))
              ) : (
                <div className="text-Color07 mt-20 mb-20 text-center font-mono">
                  You haven't solved any problem yet !
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default Dashboard;
