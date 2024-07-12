import Submission from "./../Models/Submission.js";

export const addSubmission = async (req, res) => {
  try {
    let submission = new Submission(req.body);
    submission.save();
    return res.status(200).json({ message: "Submitted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Some error occured", error: error });
  }
};

export const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.find({ Email: req.body.email })
      .sort({ createdAt: -1 })
      .limit(5);
    return res.status(200).json(submission);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Some error occured", error: error });
  }
};
