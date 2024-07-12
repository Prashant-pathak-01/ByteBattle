import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/clerk-react";
import { userData } from "./../../APIs/User";
import { Box, Typography } from "@mui/material";
function Dashboard() {
  const { user, isSignedIn } = useUser();
  const [User, setUser] = useState();
  const pieParams = { height: 200, margin: { right: 5 } };
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
  }, [isSignedIn]);
  return (
    <div className="bg-Color01 md:h-screen w-full flex items-center justify-center">
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/dashboard"} />
      </SignedOut>
      <SignedIn>
        <div className="bg-Color02 md:w-2/3 m-4 p-4 md:p-6 h-4/5 rounded-lg mt-10 flex md:flex-row flex-col-reverse justify-between ">
          <div className="bg-Color04  w-full md:m-4 rounded-md border-2 border-Color06 flex flex-col">
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
                <div className="text-Color07 mt-20 text-center font-mono">
                  You haven't solved any problem yet !
                </div>
              )}
            </div>
          </div>

          <div className="bg-Color04 w-full md:m-4 mb-10 flex flex-col justify-between items-center">
            <div className="flex flex-col items-center">
              <img
                src={user?.imageUrl}
                className="rounded-full w-40 p-2 border-4 border-Color06 mt-6"
              ></img>
              <div>
                <h2 className="text-white text-sm p-2 font-sans text-center">
                  {User?.Email}
                </h2>
                <div className="flex flex-row justify-center">
                  <div className="flex items-center flex-col bg-Color05 shadow-lg text-white m-2 p-1 w-32 rounded-md">
                    <h2 className="font-semibold text-xl">{User?.Rating}</h2>
                    <h2>Points</h2>
                  </div>
                  <div className="flex items-center flex-col bg-Color05 shadow-lg text-white m-2 p-1 w-32 rounded-md">
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
              <div className="ml-4 flex md:flex-col flex-row">
                <div className="flex flex-col md:ml-10 w-20  m-2 sm:w-20 items-center rounded-md pb-1  border-2 border-green-800  bg-green-500">
                  <h className="font-bold text-sm ">{User?.Easy}</h>
                  <p className="text-xxs font-sans sm:text-xs font-semibold">
                    Easy
                  </p>
                </div>
                <div className="flex flex-col  md:ml-10 w-20  m-2 sm:w-20 items-center rounded-md pb-1 border-2 border-yellow-500  bg-yellow-300">
                  <h2 className="font-bold text-sm ">{User?.Medium}</h2>
                  <p className="text-xxs sm:text-xs font-sans font-semibold">
                    Medium
                  </p>
                </div>
                <div className="flex flex-col  md:ml-10 w-20  m-2 sm:w-20 items-center rounded-md pb-1 bg-red-400 border-2 border-red-500">
                  <h2 className="font-bold text-sm">{User?.Hard}</h2>
                  <p className="text-xxs  sm:text-xs font-sans font-semibold">
                    Hard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default Dashboard;
