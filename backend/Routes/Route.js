import express from "express";
import { getQuestions, getQuestion } from "../Controllers/questions.js";
import {
  user,
  updateUser,
  updateSubmission,
  getNumber,
  getRanking,
  updateCFID,
} from "../Controllers/user.js";
import { addSubmission, getSubmission } from "../Controllers/submissions.js";
import {
  getQuestionDetails,
  getCFurl,
  updateGameResult,
} from "../Controllers/game.js";

const route = express.Router();
route.get("/getQuestions", getQuestions);
route.post("/getQuestion", getQuestion);

route.post("/user", user);
route.post("/updateUser", updateUser);
route.post("/updateSubmission", updateSubmission);
route.post("/getNumber", getNumber);
route.post("/getRanking", getRanking);
route.post("/updateCFID", updateCFID);

route.post("/addSubmission", addSubmission);
route.post("/getSubmission", getSubmission);

route.post("/getQuestionDetails", getQuestionDetails);
route.post("/getCFurl", getCFurl);
route.post("/updateGameResult", updateGameResult);

export default route;
