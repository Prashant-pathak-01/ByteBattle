import axios from "axios";
import qs from "qs";

const compile = async (data) => {
  const requestData = qs.stringify({
    code: data.code,
    language: data.language,
    input: data.input,
  });

  const config = {
    method: "post",
    url: "https://api.codex.jaagrav.in",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: requestData,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return error;
  }
};

export default compile;
