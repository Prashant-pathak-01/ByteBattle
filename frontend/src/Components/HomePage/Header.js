import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";
import LOGO from "./../../Media/Logo/logo.gif";

function Header() {
  return (
    <div>
      <header className="bg-Color02 shadow-b-lg shadow-black text-white py-4 px-8 flex justify-between items-center">
        <div>
          <Link to="/" className="text-xl font-bold">
            <img
              src={LOGO}
              className="md:w-40 w-28 scale-150 md:ml-10 rounded-lg"
            ></img>
          </Link>
        </div>
        <div className="flex items-center">
          <SignedOut>
            <div className="flex ">
              <Link to="/login" className="text-white hover:text-gray-300">
                <button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    LogIn
                  </span>
                </button>
              </Link>
              <Link to="/signup" className="text-white hover:text-gray-300">
                <button class="relative inline-flex items-center justify-center p-0.5 mb-2  overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                  <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    SignUp
                  </span>
                </button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <div>
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                <button class="relative inline-flex  items-center justify-center p-0.5 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                  <span class="relative px-5 py-2.5  transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    Dashboard
                  </span>
                </button>
              </Link>
            </div>
            <div className="border-2 border-Color07  rounded-full p-1">
              <UserButton className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" />
            </div>
          </SignedIn>
        </div>
      </header>
    </div>
  );
}

export default Header;
