import axios from "axios";
const api = "http://localhost:8000";

export const userData = async (data) => {
  try {
    let res = await axios.post(`${api}/user`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (data) => {
  try {
    let res = await axios.post(`${api}/updateUser`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const updateSubmission = async (data) => {
  try {
    let res = await axios.post(`${api}/updateSubmission`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const getNumber = async (data) => {
  try {
    let res = await axios.post(`${api}/getNumber`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const getRanking = async (data) => {
  try {
    let res = await axios.post(`${api}/getRanking`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};
