import React, { useEffect, useState } from "react";
import { getSubmission } from "../../APIs/Submission";
import { useUser } from "@clerk/clerk-react";
import ShowSubmission from "./ShowSubmission";
import { Box, Skeleton } from "@mui/material";

function Submissions() {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissionId, setShowSubmissionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        let res = await getSubmission({
          email: user?.primaryEmailAddress?.emailAddress,
        });
        setSubmissions(res.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [user]);

  const handleSubmissionClick = (id) => {
    setShowSubmissionId(id);
  };

  const handleCloseModal = () => {
    setShowSubmissionId(null);
  };

  return (
    <div className="bg-Color02 h-80 w-72 rounded-lg mb-10 border-2 border-Color06">
      <h1 className="text-xl bg-Color05 text-white p-4 font-semibold rounded-t-lg border-b-2 border-Color06">
        Recent Submissions
      </h1>
      <div>
        {isLoading ? (
          <div className="text-yellow-200 font-mono m-4 text-center">
            <Box sx={{ width: "100%", height: "50px" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                sx={{ marginTop: "10px", borderRadius: "5px" }}
                animation="wave"
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                sx={{ marginTop: "10px", borderRadius: "5px" }}
                width="100%"
                height={40}
              />
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="100%"
                sx={{ marginTop: "10px", borderRadius: "5px" }}
                height={40}
              />
            </Box>
          </div>
        ) : submissions.length > 0 ? (
          submissions.map((submission) => (
            <div
              key={submission._id} // Assuming `_id` is a unique identifier for submissions
              className="flex justify-between m-2 rounded-md bg-Color04 text-white font-mono p-2"
            >
              <button
                className="cursor-pointer text-blue-400 underline ml-6"
                onClick={() => handleSubmissionClick(submission._id)}
              >
                {Math.abs(new Date(submission.createdAt).getTime() % 1000000)}
              </button>

              {showSubmissionId === submission._id && (
                <ShowSubmission
                  close={handleCloseModal}
                  data={submission}
                ></ShowSubmission>
              )}
              {submission.Status === "Passed" ? (
                <h1 className="text-green-400 mr-4">Passed</h1>
              ) : (
                <h1 className="text-red-500 mr-4">Failed</h1>
              )}
            </div>
          ))
        ) : (
          <div className="text-yellow-200 font-mono m-8 text-center">
            You haven't submitted any code yet!
          </div>
        )}
      </div>
    </div>
  );
}

export default Submissions;
