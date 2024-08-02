import axios from "axios";
const api = "http://localhost:8000";

export const getQuestions = (data) => {
  try {
    let res = axios.get(`${api}/getQuestions`, data);
    return res;
  } catch (error) {
    console.log("Error !!");
  }
};

export const getQuestion = (data) => {
  try {
    let res = axios.post(`${api}/getQuestion`, data);
    return res;
  } catch (error) {
    console.log("Error !!");
  }
};
