import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuestions } from "../../APIs/questions";
import { Skeleton, Typography } from "@mui/material";

export const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        let res = await getQuestions();
        setQuestions(res.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="border-2 border-Color06 rounded-lg">
      <h2 className="rounded-t-lg p-4 text-white text-lg font-semibold bg-Color05 border-b-2 border-Color06 cursor-pointer">
        Questions list
      </h2>
      {questions.length > 0 ? (
        <div className="flex flex-col p-8">
          {questions.map((question) => (
            <Link key={question._id} to={`/sheet/${question?.Number}`}>
              <div className="p-4 mb-6 bg-Color03 text-white cursor-pointer rounded w-full hover:bg-Color05 transition-all hover:scale-105 flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                  <h1 className="font-bold mr-2 text-lg">
                    {question?.Number}.
                  </h1>
                  <h1> {question?.Name}</h1>
                </div>
                {question?.Lavel == "Easy" ? (
                  <p className="w-20 text-center text-green-600">Easy</p>
                ) : question?.Lavel == "Medium" ? (
                  <p className="w-20 text-center text-yellow-500">Medium</p>
                ) : (
                  <p className="w-20 text-center text-red-500">Hard</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          <Typography variant="h1">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                sx={{
                  bgcolor: "grey.800",
                  margin: "30px",
                  borderRadius: "5px",
                }}
                variant="rectangular"
                width="md:90%"
                height={50}
              />
            ))}
          </Typography>
        </>
      )}
    </div>
  );
};

export default QuestionsList;
