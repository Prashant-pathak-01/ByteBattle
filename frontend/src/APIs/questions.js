import axios from "axios";
const api = "https://bytebattle.onrender.com";
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
