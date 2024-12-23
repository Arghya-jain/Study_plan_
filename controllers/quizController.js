import express from "express";
import Quiz from "../models/Quiz.js";
import Quizzes from "../models/Quizzes.js";
import generateSingle from "../constants/generateSingle.js";
import verifyToken from "../middlewares/VerifyToken.js";
const quizController = express.Router();

// =============================
// Routes for Single Quiz
// =============================

// Create a new quiz
quizController.post("/quiz", verifyToken, async (req, res) => {
    try {
      const { text } = req.body;
  
      // Generate the AI response
      const updated = await generateSingle(text);
  
      // Create the new quiz
      const newQuiz = await Quiz.create({ text: updated, createdBy: req.user.id });
  
      // Find or create the user's Quizzes collection
      let userQuizzes = await Quizzes.findOne({ userId: req.user.id });
      if (!userQuizzes) {
        userQuizzes = new Quizzes({ userId: req.user.id, quizzes: [] });
      }
  
      // Add the new quiz to the user's collection
      userQuizzes.quizzes.push({ quizId: newQuiz._id });
      await userQuizzes.save();
  
      res.status(201).json({ newQuiz, userQuizzes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get a specific quiz by ID
  quizController.get("/quiz/:id", verifyToken, async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id).populate("createdBy", "name email");
      if (!quiz || quiz.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to this quiz" });
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a specific quiz
  quizController.put("/quiz/:id", verifyToken, async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz || quiz.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to update this quiz" });
      }
  
      const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(updatedQuiz);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Delete a specific quiz
  quizController.delete("/quiz/:id", verifyToken, async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz || quiz.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this quiz" });
      }
  
      await Quiz.findByIdAndDelete(req.params.id);
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // =============================
  // Routes for Quizzes Collection
  // =============================
  
  // Get all quizzes for the authenticated user
  quizController.get("/quizzes", verifyToken, async (req, res) => {
    try {
      const userQuizzes = await Quizzes.findOne({ userId: req.user.id }).populate("quizzes.quizId");
      if (!userQuizzes) {
        return res.status(404).json({ message: "No quizzes found for this user" });
      }
      res.json(userQuizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Add a quiz to the authenticated user's collection
  quizController.post("/quizzes", verifyToken, async (req, res) => {
    try {
      const { quizId, status, score } = req.body;
  
      let userQuizzes = await Quizzes.findOne({ userId: req.user.id });
      if (!userQuizzes) {
        userQuizzes = new Quizzes({ userId: req.user.id, quizzes: [] });
      }
  
      userQuizzes.quizzes.push({ quizId, status, score });
      await userQuizzes.save();
  
      res.status(201).json(userQuizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a quiz's progress in the authenticated user's collection
  quizController.put("/quizzes/:quizId", verifyToken, async (req, res) => {
    try {
      const { status, score } = req.body;
  
      const userQuizzes = await Quizzes.findOneAndUpdate(
        { userId: req.user.id, "quizzes.quizId": req.params.quizId },
        { $set: { "quizzes.$.status": status, "quizzes.$.score": score } },
        { new: true }
      );
  
      if (!userQuizzes) {
        return res.status(404).json({ message: "Quiz not found in user's collection" });
      }
  
      res.json(userQuizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Remove a quiz from the authenticated user's collection
  quizController.delete("/quizzes/:quizId", verifyToken, async (req, res) => {
    try {
      const userQuizzes = await Quizzes.findOneAndUpdate(
        { userId: req.user.id },
        { $pull: { quizzes: { quizId: req.params.quizId } } },
        { new: true }
      );
  
      if (!userQuizzes) {
        return res.status(404).json({ message: "Quiz not found in user's collection" });
      }
  
      res.json(userQuizzes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  export default quizController;