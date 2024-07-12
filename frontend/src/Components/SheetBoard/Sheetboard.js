import React, { useEffect } from "react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Ranking from "./Ranking";
import Submissions from "./Submissions";
import QuestionsList from "./QuestionsList";
import SheetHeader from "./SheetHeader";
import Header from "../HomePage/Header";
function Sheetboard() {
  return (
    <div>
      <Header></Header>
      <div className="flex justify-center items-center mx-auto bg-Color01 min-h-screen">
        <SignedOut>
          <RedirectToSignIn redirectUrl={"/sheet"} />
        </SignedOut>
        <SignedIn>
          <div className="w-full max-w-screen-lg px-4">
            <SheetHeader />
            <div className="mt-4">
              <div className="mb-4 md:flex md:space-x-4">
                <div className="w-full md:w-4/5 p-6">
                  <QuestionsList />
                </div>
                <div className="flex flex-col items-center p-6">
                  <Submissions />
                  <Ranking />
                </div>
              </div>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}

export default Sheetboard;
