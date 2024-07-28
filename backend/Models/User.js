import mongoose from "mongoose";
const schema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Easy: {
    type: Number,
    default: 0,
  },
  Medium: {
    type: Number,
    default: 0,
  },
  Hard: {
    type: Number,
    default: 0,
  },
  SubmissionNumber: {
    type: Number,
    default: 0,
  },
  Rating: {
    type: Number,
    default: 0,
  },
  Solved: {
    type: [String],
    default: [],
  },
  Profile: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/b/b5/Windows_10_Default_Profile_Picture.svg",
  },
  Name: {
    type: String,
    default: "Unknown",
  },
  CFID: {
    type: String,
    default: null,
  },
  Win: {
    type: Number,
    default: 0,
  },
  Loose: {
    type: String,
    default: 0,
  },
});
schema.index({ Email: 1 }, { unique: true });
const user = mongoose.model("User", schema, "User");

export default user;
