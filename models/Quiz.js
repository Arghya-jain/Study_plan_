import mongoose from "mongoose";
const { Schema, model } = mongoose;

const quizSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who created the quiz
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
export default model("Quiz", quizSchema);