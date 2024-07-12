import express from "express";
import { getQuestions, getQuestion } from "../Controllers/questions.js";
import {
  user,
  updateUser,
  updateSubmission,
  getNumber,
  getRanking,
} from "../Controllers/user.js";
import { addSubmission, getSubmission } from "../Controllers/Submissions.js";
const route = express.Router();
route.get("/getQuestions", getQuestions);
route.post("/getQuestion", getQuestion);

route.post("/user", user);
route.post("/updateUser", updateUser);
route.post("/updateSubmission", updateSubmission);
route.post("/getNumber", getNumber);
route.post("/getRanking", getRanking);

route.post("/addSubmission", addSubmission);
route.post("/getSubmission", getSubmission);

export default route;
