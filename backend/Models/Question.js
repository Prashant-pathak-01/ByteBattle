import mongoose from "mongoose";

const schema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Number: {
    type: Number,
    required: true,
  },
  Constrains: {
    type: [String],
    required: true,
  },
  Details: {
    type: String,
    required: true,
  },
  InputFormat: {
    type: String,
    required: true,
  },
  OutputFormat: {
    type: String,
    required: true,
  },
  Example: {
    Input: {
      type: String,
      required: true,
    },
    Output: {
      type: String,
      required: true,
    },
  },
  TestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],
  Lavel: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
  },
});

const Questions = mongoose.model("Questions", schema, "Questions");
export default Questions;
