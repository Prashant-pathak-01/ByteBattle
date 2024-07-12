import Questions from "./../Models/Question.js";
export const getQuestions = async (req, res) => {
  try {
    let questions = await Questions.find({});
    return res.status(200).json(questions);
  } catch (error) {
    return res.status(500).json("Couldn't find questions");
  }
};

export const getQuestion = async (req, res) => {
  try {
    let question = await Questions.findOne({ Number: req.body.id });
    return res.status(200).json(question);
  } catch (error) {
    return res.status(500).json("Couldn't find questions");
  }
};
