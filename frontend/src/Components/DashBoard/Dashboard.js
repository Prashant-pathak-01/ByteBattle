import React from "react";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
function Dashboard() {
  return (
    <div>
      <SignedOut>
        <RedirectToSignIn redirectUrl={"/dashboard"} />
      </SignedOut>
      <SignedIn>You are logged in</SignedIn>
    </div>
  );
}

export default Dashboard;
