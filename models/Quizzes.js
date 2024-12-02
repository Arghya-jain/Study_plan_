import mongoose from "mongoose";
const { Schema, model } = mongoose;

const quizzesSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User who owns these quizzes
    required: true,
  },
  quizzes: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz", // Reference to individual quizzes
        required: true,
      },
      status: {
        type: String,
        enum: ["not started", "in progress", "completed"],
        default: "not started",
      },
      score: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export default model("Quizzes", quizzesSchema);