import DOMPurify from "dompurify";
import katex from "katex";
import axios from "axios";
const api = "http://localhost:8000";

export const getCFUrl = (data) => {
  return axios.post(`${api}/getCFurl`, data);
};

export const getQuestionDetails = (url) => {
  return axios.post(`${api}/getQuestionDetails`, {
    url,
  });
};

export const updateGameResult = async (data) => {
  try {
    let res = axios.post(`${api}/updateGameResult`, data);
    return res;
  } catch (error) {
    console.log(error.message);
  }
};

export const convertLatexToHtml = (latex) => {
  try {
    return katex.renderToString(latex.replace(/\\lt/g, "<="), {
      throwOnError: false,
    });
  } catch (error) {
    console.error("Error rendering LaTeX:", error);
    return latex;
  }
};

export const convertContent = (content) => {
  const processedContent = content.replace(
    /\$\$\$([^$]+)\$\$\$/g,
    (_, latex) => {
      return convertLatexToHtml(latex);
    }
  );

  const updatedContent = processedContent.replace(/\\lt/g, "<=");

  return DOMPurify.sanitize(updatedContent);
};

export const decodeHtmlEntities = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
};
