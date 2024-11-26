import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API); 
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const User = require('../models/User');


// Generate a study plan based on user input
const generatePlan = async (req, res) => {
  const { topic, timeConstraint, complexity } = req.body;
  const user = await User.findById(req.user.id);

  // Validate user input (optional)
  if (!topic || !timeConstraint || !complexity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Construct the prompt for the AI model
  const prompt = `Create a study plan for ${topic}. 
  Consider the following constraints: 
  - Time constraint: ${timeConstraint} hours
  - Complexity level: ${complexity}
  Provide a detailed plan with specific topics, resources, and a timeline.`;

  try {
    const result = await model.generateContent(prompt);
    const studyPlan = result.response.text();

    user.studyPlans.push({ topic, plan: studyPlan, progress: { completed: false, score: 0 } });
    await user.save();

    res.status(201).json({ studyPlan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
};

// Get a specific study plan
const getStudyPlan = async (req, res) => {
  const { planId } = req.params;
  const user = await User.findById(req.user.id);

  const studyPlan = user.studyPlans.id(planId);
  if (!studyPlan) {
    return res.status(404).json({ error: 'Study plan not found' });
  }

  res.json(studyPlan);
};

// Update a study plan (e.g., mark as completed)
const updateStudyPlan = async (req, res) => {
  const { planId, progress } = req.body;
  const user = await User.findById(req.user.id);

  const studyPlan = user.studyPlans.id(planId);
  if (!studyPlan) {
    return res.status(404).json({ error: 'Study plan not found' });
  }

  studyPlan.progress = progress;
  await user.save();

  res.json({ message: 'Study plan updated' });
};

// ... other functions for deleting plans, listing all plans, etc.

module.exports = {
  generatePlan,
  getStudyPlan,
  updateStudyPlan,
  // ... other function exports
};