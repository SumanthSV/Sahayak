import { onRequest } from 'firebase-functions/v2/https';
import { onCall } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const generateStory = onCall(async (request) => {
  const { prompt, language, grade, subject } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const enhancedPrompt = `
      Create an educational story in ${language} for grade ${grade} students about: ${prompt}
      
      Requirements:
      - Make it culturally relevant to Indian students
      - Use simple language appropriate for the grade level
      - Include moral values and educational content
      - Make it engaging and relatable
      - Length: 300-500 words
      - Include characters with Indian names
      - Set in familiar Indian environments (village, town, school)
      - Format with proper paragraphs and dialogue
      
      Subject context: ${subject}
      
      Structure the story with:
      1. Engaging opening
      2. Educational content woven into the narrative
      3. Character development and dialogue
      4. Clear moral or lesson
      5. Satisfying conclusion
    `;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    
    return { story: response.text() };
  } catch (error) {
    console.error('Error generating story:', error);
    throw new Error('Failed to generate story');
  }
});

export const generateWorksheet = onCall(async (request) => {
  const { subject, grade, language } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Create a comprehensive worksheet for grade ${grade} ${subject} students in ${language}.
      
      Include:
      - 8-12 questions of varying difficulty levels
      - Mix of question types: Multiple choice (4 options), Fill-in-the-blanks, Short answer, and Problem-solving
      - Clear instructions for each section
      - Proper formatting for easy printing
      - Educational and engaging content appropriate for the grade level
      - Answer key at the bottom
      - Header with subject, grade, and date fields
      
      Structure:
      1. Header with name, date, roll number fields
      2. Clear instructions
      3. Section A: Multiple Choice Questions (3-4 questions)
      4. Section B: Fill in the Blanks (2-3 questions)
      5. Section C: Short Answer Questions (2-3 questions)
      6. Section D: Problem Solving/Application (1-2 questions)
      7. Answer Key
      
      Make it practical and suitable for classroom use with appropriate difficulty for grade ${grade}.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return { worksheet: response.text() };
  } catch (error) {
    console.error('Error generating worksheet:', error);
    throw new Error('Failed to generate worksheet');
  }
});

export const generateVisualAid = onCall(async (request) => {
  const { topic, subject, grade, language } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Create a detailed visual aid guide for teaching "${topic}" to grade ${grade} ${subject} students.
      
      Include:
      - Step-by-step instructions for creating visual elements on blackboard/whiteboard
      - Simple diagrams and illustrations that can be drawn easily
      - Key points to highlight and emphasize
      - Interactive elements for student engagement
      - Color suggestions (if materials available)
      - Estimated time to create: 10-15 minutes
      - Materials needed (chalk, markers, ruler, etc.)
      
      Language: ${language}
      
      Structure the guide with:
      1. Materials needed
      2. Step-by-step creation instructions (4-5 steps)
      3. Student engagement strategies
      4. Key teaching points to emphasize
      5. Interactive elements to include
      6. Extension activities
      
      Make it practical for teachers with limited resources and focus on:
      - Clear, simple drawings that can be replicated
      - Student participation opportunities
      - Real-world connections
      - Memory aids and mnemonics
      - Time-efficient creation process
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return { visualAid: response.text() };
  } catch (error) {
    console.error('Error generating visual aid:', error);
    throw new Error('Failed to generate visual aid');
  }
});

export const explainConcept = onCall(async (request) => {
  const { question, difficulty, subject } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Explain the following concept in simple terms for ${difficulty} level students: ${question}
      
      Requirements:
      - Use age-appropriate language for ${difficulty} level
      - Include real-world examples and analogies
      - Break down complex ideas into simple steps
      - Add fun facts or interesting details
      - Suggest hands-on activities or experiments
      - Make it engaging and memorable
      - Use Indian context and examples where relevant
      
      ${subject ? `Subject context: ${subject}` : ''}
      
      Structure your explanation with:
      1. Simple definition (What is it?)
      2. Step-by-step explanation (How does it work?)
      3. Real-world examples (Where do we see this?)
      4. Fun facts (Did you know?)
      5. Simple experiment or activity suggestion (Try this!)
      6. Memory tricks or mnemonics (Remember this!)
      
      Make it conversational and engaging for young learners.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return { explanation: response.text() };
  } catch (error) {
    console.error('Error explaining concept:', error);
    throw new Error('Failed to explain concept');
  }
});

export const healthCheck = onRequest(async (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      firebase: 'connected'
    }
  });
});