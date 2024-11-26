import mongoose from 'mongoose'
import { Schema, model } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  studyPlans: [{
    topic: String,
    plan: Object,
    progress: {
      completed: Boolean,
      score: Number
    }
  }]
});

export default model("User", userSchema);