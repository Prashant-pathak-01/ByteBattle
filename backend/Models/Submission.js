import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    Email: {
      type: String,
      required: true,
    },
    Code: {
      type: String,
      required: true,
    },
    Language: {
      type: String,
      required: true,
    },
    Status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const res = mongoose.model("Submission", schema, "Submission");
export default res;
