import { SignUp } from "@clerk/clerk-react";
import React from "react";
import IMAGE from "./../../../Media/Auth/signup.jpg";

function signUp() {
  return (
    <div className="h-screen flex flex-row md:justify-between justify-center items-center bg-blue-100">
      <div className="shadow-xl md:flex hidden">
        <img src={IMAGE} className="w-full h-screen md:block hidden"></img>
      </div>
      <div className="flex justify-center items-center md:w-2/3">
        <SignUp />
      </div>
    </div>
  );
}

export default signUp;
