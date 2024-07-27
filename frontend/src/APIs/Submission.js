import axios from "axios";
const api = "http://localhost:8000";

export const addSubmission = async (data) => {
  try {
    let res = await axios.post(`${api}/addSubmission`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const getSubmission = async (data) => {
  try {
    let res = await axios.post(`${api}/getSubmission`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};
