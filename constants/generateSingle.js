import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSingle = async ( message) => {
    // Ensure only role and text are included in history entries
    

    
    const result = await model.generateContent(message);
    return result.response.text();
}
export default generateSingle;