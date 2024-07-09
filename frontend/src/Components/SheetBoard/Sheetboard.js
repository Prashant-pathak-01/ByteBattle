import React from "react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";

function Sheetboard() {
  return (
    <div>
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/sheet"} />
      </SignedOut>
      <SignedIn>You are logged in</SignedIn>
    </div>
  );
}

export default Sheetboard;
