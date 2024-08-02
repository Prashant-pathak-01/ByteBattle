import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage/Homepage";
import SheetBoard from "./Components/SheetBoard/Sheetboard";
import DashBoard from "./Components/DashBoard/Dashboard";
import Login from "./Components/HomePage/Authentication/Login";
import SignIn from "./Components/HomePage/Authentication/Signup";
import Question from "./Components/Question/Questions";
import BattleGround from "./Components/BattleGround/BattleGround.js";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage></HomePage>
              </>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <>
                <Login></Login>
              </>
            }
          ></Route>
          <Route
            path="/signup"
            element={
              <>
                <SignIn></SignIn>
              </>
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <>
                <DashBoard></DashBoard>
              </>
            }
          ></Route>
          <Route
            path="/sheet"
            element={
              <>
                <SheetBoard></SheetBoard>
              </>
            }
          ></Route>
          <Route
            path="/sheet/:id"
            element={
              <>
                <Question></Question>
              </>
            }
          ></Route>

          <Route path="/:wildcard" element={<BattleGround />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
