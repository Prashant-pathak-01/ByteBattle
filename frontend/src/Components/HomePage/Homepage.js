import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
  UserProfile,
} from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <SignedOut>
        <Link to="/login">
          <button>Login Button</button>
        </Link>
        <Link to="/signup">
          <button>Signup Button</button>
        </Link>
      </SignedOut>
      <SignedIn>
        <h1>DashBoard</h1>
        <UserButton></UserButton>
      </SignedIn>
    </div>
  );
}

export default Home;
