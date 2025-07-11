import { onCall } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Enhanced Story Generation with personalization
export const generatePersonalizedStory = onCall(async (request) => {
  const { prompt, language, grade, subject, studentName, localContext, previousFeedback } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const personalizedPrompt = `
      Create an educational story in ${language} for grade ${grade} students about: ${prompt}
      
      Personalization Context:
      ${studentName ? `- Student name: ${studentName}` : ''}
      ${localContext ? `- Local context: ${localContext}` : ''}
      ${previousFeedback ? `- Previous feedback: ${previousFeedback.join(', ')}` : ''}
      
      Requirements:
      - Make it culturally relevant to Indian students
      - Use simple language appropriate for grade ${grade}
      - Include moral values and educational content
      - Make it engaging and relatable
      - Length: 400-600 words
      - Include characters with Indian names
      - Set in familiar Indian environments (village, town, school)
      - Incorporate local festivals, food, and customs
      - Use storytelling techniques that resonate with Indian culture
      
      Subject context: ${subject}
      
      Structure the story with:
      1. Engaging opening that connects to student's world
      2. Educational content woven naturally into narrative
      3. Character development with relatable challenges
      4. Clear moral or lesson that applies to daily life
      5. Satisfying conclusion with actionable takeaway
      
      Make the story memorable and encourage discussion.
    `;

    const result = await model.generateContent(personalizedPrompt);
    const response = await result.response;
    
    return { story: response.text() };
  } catch (error) {
    console.error('Error generating personalized story:', error);
    throw new Error('Failed to generate personalized story');
  }
});

// Legacy story generation for backward compatibility
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

// Differentiated Worksheet Generation
export const generateDifferentiatedWorksheet = onCall(async (request) => {
  const { imageData, topic, subject, grades, language, difficulty, includeVisuals } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const worksheets: { [grade: string]: string } = {};
    
    for (const grade of grades) {
      const prompt = `
        Create a comprehensive worksheet for grade ${grade} ${subject} students in ${language}.
        Topic: ${topic}
        Difficulty: ${difficulty}
        
        Include:
        - 10-15 questions of varying types appropriate for grade ${grade}
        - Mix of question types: Multiple choice, Fill-in-the-blanks, Short answer, Problem-solving, Creative thinking
        - Clear instructions in ${language}
        - Proper formatting for easy printing
        - Cultural context relevant to Indian students
        - Real-world applications and examples
        - Answer key with explanations
        - Extension activities for advanced learners
        - Support activities for struggling learners
        
        Structure:
        1. Header with student information fields
        2. Learning objectives
        3. Instructions section
        4. Multiple sections with different question types
        5. Reflection questions
        6. Answer key with detailed explanations
        7. Teacher notes for differentiation
        
        Make it engaging, practical, and suitable for multi-grade classroom use.
        Ensure questions are culturally sensitive and locally relevant.
        ${includeVisuals ? 'Include suggestions for visual elements and diagrams.' : ''}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      worksheets[grade] = response.text();
    }
    
    return { worksheets };
  } catch (error) {
    console.error('Error generating differentiated worksheet:', error);
    throw new Error('Failed to generate differentiated worksheet');
  }
});

// Legacy worksheet generation
export const generateWorksheet = onCall(async (request) => {
  const { imageData, subject, grade, language } = request.data;
  
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

// Visual Aid Generation with Image Support
export const generateVisualAidWithImage = onCall(async (request) => {
  const { topic, subject, grade, language, includeImage } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const instructionsPrompt = `
      Create detailed visual aid instructions for teaching "${topic}" to grade ${grade} ${subject} students.
      Language: ${language}
      
      Provide a JSON response with:
      {
        "instructions": "Step-by-step instructions for creating the visual aid",
        "materials": ["List of materials needed"],
        "timeEstimate": "Estimated time to create",
        "difficulty": "Difficulty level for teacher",
        "teachingTips": ["Tips for effective use in classroom"],
        "studentEngagement": ["Ways to involve students"],
        "variations": ["Adaptations for different learning styles"]
      }
      
      Make it practical for teachers with limited resources and focus on:
      - Clear, simple drawings that can be replicated
      - Student participation opportunities
      - Real-world connections
      - Memory aids and mnemonics
      - Time-efficient creation process
    `;

    const instructionsResult = await model.generateContent(instructionsPrompt);
    const instructionsResponse = await instructionsResult.response;
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(instructionsResponse.text());
    } catch {
      parsedResponse = {
        instructions: instructionsResponse.text(),
        materials: ['Blackboard', 'Chalk', 'Ruler'],
        timeEstimate: '15 minutes',
        difficulty: 'Medium',
        teachingTips: ['Practice drawing before class'],
        studentEngagement: ['Ask students to help with drawing'],
        variations: ['Use colors if available']
      };
    }

    // Note: Image generation would require additional setup with image generation models
    // For now, we'll return without image
    return {
      ...parsedResponse,
      imageUrl: includeImage ? null : undefined
    };
  } catch (error) {
    console.error('Error generating visual aid:', error);
    throw new Error('Failed to generate visual aid');
  }
});

// Legacy visual aid generation
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

// Adaptive Concept Explanation
export const explainConceptAdaptively = onCall(async (request) => {
  const { question, difficulty, subject, language, studentLevel, previousQuestions, learningStyle } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Provide a comprehensive, adaptive explanation for: ${question}
      
      Context:
      - Difficulty level: ${difficulty}
      - Subject: ${subject || 'general'}
      - Language: ${language}
      - Student level: ${studentLevel || 'beginner'}
      - Learning style preference: ${learningStyle || 'mixed'}
      - Previous questions: ${previousQuestions?.join(', ') || 'none'}
      
      Provide a JSON response with the following structure:
      {
        "explanation": "Detailed explanation adapted to the student's level and learning style",
        "visualAids": ["List of visual aids that would help explain this concept"],
        "activities": ["Hands-on activities to reinforce learning"],
        "assessmentQuestions": ["Questions to check understanding"],
        "nextTopics": ["Related topics to explore next"]
      }
      
      Requirements:
      - Use age-appropriate language for ${difficulty} level
      - Include cultural context relevant to Indian students
      - Provide real-world examples from Indian context
      - Adapt explanation style to ${learningStyle} learning preference
      - Build upon previous knowledge indicated by previous questions
      - Include memory techniques and mnemonics
      - Suggest practical applications
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      return JSON.parse(response.text());
    } catch {
      // Fallback if JSON parsing fails
      return {
        explanation: response.text(),
        visualAids: [],
        activities: [],
        assessmentQuestions: [],
        nextTopics: []
      };
    }
  } catch (error) {
    console.error('Error explaining concept adaptively:', error);
    throw new Error('Failed to explain concept adaptively');
  }
});

// Legacy concept explanation
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

// Text-to-Speech Synthesis
export const synthesizeSpeech = onCall(async (request) => {
  const { text, languageCode, voiceName } = request.data;
  
  try {
    // Note: This would require Google Cloud Text-to-Speech API setup
    // For now, return a mock response
    console.log('Text-to-Speech request:', { text, languageCode, voiceName });
    
    // In a real implementation, you would:
    // 1. Initialize Text-to-Speech client
    // 2. Create synthesis request
    // 3. Generate audio
    // 4. Return audio URL or base64 data
    
    return { 
      audioUrl: 'data:audio/mp3;base64,mock-audio-data',
      message: 'Text-to-Speech not fully implemented yet'
    };
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw new Error('Failed to synthesize speech');
  }
});

// Speech Recognition
export const recognizeSpeech = onCall(async (request) => {
  const { audioContent, languageCode } = request.data;
  
  try {
    // Note: This would require Google Cloud Speech-to-Text API setup
    // For now, return a mock response
    console.log('Speech recognition request:', { languageCode });
    
    // In a real implementation, you would:
    // 1. Initialize Speech-to-Text client
    // 2. Create recognition request
    // 3. Process audio content
    // 4. Return transcript
    
    return { 
      transcript: 'Mock transcript - Speech recognition not fully implemented yet',
      message: 'Speech-to-Text not fully implemented yet'
    };
  } catch (error) {
    console.error('Error recognizing speech:', error);
    throw new Error('Failed to recognize speech');
  }
});

// Educational Image Generation
export const generateEducationalImage = onCall(async (request) => {
  const { prompt, aspectRatio, style, language } = request.data;
  
  try {
    // Note: This would require image generation model setup
    // For now, return a mock response
    console.log('Image generation request:', { prompt, aspectRatio, style, language });
    
    // In a real implementation, you would:
    // 1. Initialize image generation model
    // 2. Create generation request
    // 3. Generate image
    // 4. Return image base64 or URL
    
    return { 
      imageBase64: 'mock-image-base64-data',
      message: 'Image generation not fully implemented yet'
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate educational image');
  }
});

// Content Translation
export const translateContent = onCall(async (request) => {
  const { text, targetLanguage } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Translate the following educational content to ${targetLanguage}.
      Maintain the educational context and cultural appropriateness.
      Keep technical terms accurate and age-appropriate.
      
      Content to translate:
      ${text}
      
      Provide only the translation, maintaining the original formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return { translatedText: response.text() };
  } catch (error) {
    console.error('Error translating content:', error);
    throw new Error('Failed to translate content');
  }
});

// Health Check Endpoint
export const healthCheck = onRequest(async (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      firebase: 'connected',
      functions: 'operational'
    },
    endpoints: [
      'generatePersonalizedStory',
      'generateStory',
      'generateDifferentiatedWorksheet',
      'generateWorksheet',
      'generateVisualAidWithImage',
      'generateVisualAid',
      'explainConceptAdaptively',
      'explainConcept',
      'synthesizeSpeech',
      'recognizeSpeech',
      'generateEducationalImage',
      'translateContent'
    ]
  });
});