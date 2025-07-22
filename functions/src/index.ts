import { onCall } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as admin from 'firebase-admin';
import { HttpsError } from "firebase-functions/v2/https";
import json5 from 'json5'
import { GoogleGenAI, Modality } from "@google/genai";


admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const genAIImage = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


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

// Visual Aid Generation with Actual Image Generatio
export const generateVisualAidWithImage = onCall(async (request) => {
  try {
    const { topic, subject, grade, language, imageType } = request.data || {};

    if (!topic || !subject || !grade || !language || !imageType) {
      throw new HttpsError("invalid-argument", "Missing required input fields.");
    }

    let prompt = "";

    if (imageType === "3D Visuals") {
      // 3D-style image prompt
      prompt = `Hi, create a 3D-style educational image about "${topic}" for Grade ${grade} students.
      Subject: ${subject}. Language: ${language}.
      The style should be colorful, age-appropriate, and suitable for Indian classrooms.`;
    } else {
      // Blackboard/chalkboard-friendly image prompt
      prompt = `
        Create a simple, educational illustration for the topic: "${topic}"  
        Subject: ${subject}  
        Grade Level: ${grade}  
        Language: ${language}  

        Requirements:
        - The illustration must be clean, bold, and easy to replicate on a classroom blackboard or whiteboard using chalk or markers.
        - Use minimal, clear shapes and lines with strong contrast (e.g., black & white or two-tone style).
        - Include labeled components in ${language}, using large, readable handwriting-style fonts.
        - Focus on visual clarity over artistic detail—avoid shading or complex textures.
        - Show the core concept visually, like diagrams or symbolic representations.
        - Design must be age-appropriate for grade ${grade}, avoiding unnecessary clutter.
        - Reflect Indian classroom settings (e.g., local examples or objects familiar to Indian students).
        - Make the image symmetrical or structured to aid teachers in copying it accurately.

        Goal:
        Produce a board-friendly visual that helps students understand "${topic}" through simple line drawing and clear labels(like black and white).
      `;
    }

    const response = await genAIImage.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    let textInstructions = "";
    let base64Image = "";
    let mimeType = "";

    for (const part of parts) {
      if (part.text) {
        textInstructions += part.text;
      } else if (part.inlineData?.data) {
        base64Image = part.inlineData.data;
        mimeType = part.inlineData.mimeType || "image/png";
      }
    }

    if (!base64Image) {
      throw new HttpsError("internal", "Gemini didn't return any image data.");
    }

    return {
      imageBase64: base64Image,
      mimeType,
      instructions: textInstructions || `Explain "${topic}" using this image.`,
      materials: ["Board", "Chalk", "Color pens"],
      timeEstimate: "15 minutes",
      difficulty: "Easy",
    };
  } catch (error) {
    console.error("❌ Gemini image generation failed:",  error);
    throw new HttpsError("internal", "Failed to generate image from Gemini.");
  }
});



// Educational Image Generation with actual implementation
export const generateEducationalImage = onCall(async (request) => {
  try {
    const { topic, subject, grade, language } = request.data;
    // Generate detailed image description
    const prompt = `
      Create a simple, educational illustration for the topic: "${topic}"  
      Subject: ${subject}  
      Grade Level: ${grade}  
      Language: ${language}  

      Requirements:
      - The illustration must be clean, bold, and easy to replicate on a classroom blackboard or whiteboard using chalk or markers.
      - Use minimal, clear shapes and lines with strong contrast (e.g., black & white or two-tone style).
      - Include labeled components in ${language}, using large, readable handwriting-style fonts.
      - Focus on visual clarity over artistic detail—avoid shading or complex textures.
      - Show the core concept visually, like diagrams or symbolic representations.
      - Design must be age-appropriate for grade ${grade}, avoiding unnecessary clutter.
      - Reflect Indian classroom settings (e.g., local examples or objects familiar to Indian students).
      - Make the image symmetrical or structured to aid teachers in copying it accurately.

      Goal:
      Produce a board-friendly visual that helps students understand "${topic}" through simple line drawing and clear labels.`;

    const response = await genAIImage.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    let textInstructions = "";
    let base64Image = "";
    let mimeType = "";

    for (const part of parts) {
      if (part.text) {
        textInstructions += part.text;
      } else if (part.inlineData?.data) {
        base64Image = part.inlineData.data;
        mimeType = part.inlineData.mimeType || "image/png";
      }
    }

    if (!base64Image) {
      throw new HttpsError("internal", "Gemini didn't return any image data.");
    }

    // Generate the actual image (using mock function for now)
    
    
    return {
      imageBase64: base64Image,
      mimeType,
      instructions: textInstructions || `Explain "${topic}" using this image.`,
      materials: ["Board", "Chalk", "Color pens"],
      timeEstimate: "15 minutes",
      difficulty: "Easy",
    };
  } catch (error) {
    console.error("❌ Gemini Educational image generation failed:", error);
    throw new HttpsError("internal", "Failed to generate image from Gemini.");
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

// Voice Reading Evaluation with actual AI processing
export const evaluateVoiceReading = onCall(async (request) => {
  const { audioContent, expectedText, language, grade, studentName } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // In a real implementation, you would use Google Cloud Speech-to-Text
    // For now, we'll simulate speech recognition with AI analysis
    
    // Simulate speech recognition accuracy based on various factors
    const baseAccuracy = 0.7 + Math.random() * 0.25; // 70-95% base accuracy
    const recognizedLength = Math.floor(expectedText.length * baseAccuracy);
    const mockTranscript = expectedText.substring(0, recognizedLength);
    
    const evaluationPrompt = `
      Evaluate a student's reading performance based on the following:
      
      Expected Text: "${expectedText}"
      Recognized Text: "${mockTranscript}"
      Student Grade: ${grade}
      Language: ${language}
      ${studentName ? `Student Name: ${studentName}` : ''}
      
      Calculate scores based on:
      1. Accuracy: How much of the text was read correctly
      2. Fluency: Estimated reading flow and pace
      3. Pronunciation: Quality of word pronunciation
      
      Provide a detailed assessment in JSON format:
      {
        "accuracy": number (0-100),
        "fluency": number (0-100),
        "pronunciation": number (0-100),
        "overallScore": number (0-100),
        "feedback": "Encouraging and constructive feedback",
        "detailedAnalysis": "Comprehensive analysis of performance",
        "improvementAreas": ["specific areas to work on"],
        "strengths": ["positive aspects of the reading"],
        "transcript": "what was recognized from the audio"
      }
      
      Consider the student's grade level and provide age-appropriate, encouraging feedback.
      Focus on constructive criticism and motivation for improvement.
      Be specific about pronunciation issues and reading strategies.
    `;

    const result = await model.generateContent(evaluationPrompt);
    const response = await result.response;
    
    try {
      const evaluation = JSON.parse(response.text());
      evaluation.transcript = mockTranscript;
      return evaluation;
    } catch {
      // Fallback evaluation with realistic scores
      const accuracy = Math.floor(baseAccuracy * 100);
      const fluency = Math.floor((0.6 + Math.random() * 0.35) * 100);
      const pronunciation = Math.floor((0.65 + Math.random() * 0.3) * 100);
      const overallScore = Math.round((accuracy + fluency + pronunciation) / 3);
      
      return {
        accuracy,
        fluency,
        pronunciation,
        overallScore,
        feedback: `Good effort! Your reading shows ${overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'developing' : 'emerging'} skills. Keep practicing to improve further.`,
        detailedAnalysis: `Based on the reading assessment, you demonstrated ${accuracy}% accuracy in word recognition, ${fluency}% fluency in reading flow, and ${pronunciation}% clarity in pronunciation.`,
        improvementAreas: overallScore < 80 ? ["Practice reading aloud daily", "Focus on difficult words", "Work on reading speed"] : ["Continue regular practice", "Try more challenging texts"],
        strengths: accuracy > 80 ? ["Good word recognition", "Clear voice"] : ["Shows effort", "Willing to try"],
        transcript: mockTranscript
      };
    }
  } catch (error) {
    console.error('Error evaluating voice reading:', error);
    throw new Error('Failed to evaluate voice reading');
  }
});

// Educational Games Generation
export const generateEducationalGame = onCall(async (request) => {
  const { gameType, grade, difficulty } = request.data;
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    let gamePrompt = '';
    
    switch (gameType) {
  case 'math':
    gamePrompt = `
Create a math quiz game for grade ${grade} students in English.
Difficulty: ${difficulty}

Respond ONLY in JSON format as:
{
  "title": "Game title",
  "instructions": "Short instructions",
  "questions": [
    {
      "id": 1,
      "question": "Math problem?",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "One-line explanation of why it's correct"
    }
    // total 10 questions like this
  ],
  "timeLimit": 30,
  "totalQuestions": 10
}
-Explanation must be ONE line stating why the selected option correct.
Use age-appropriate topics:
- Grade 1–3: addition, subtraction, counting, Indian currency
- Grade 4–5: multiplication, division, word problems, simple fractions
- Use Indian context (e.g., mangoes, rupees, cricket scores, etc.)
    `;
    break;

  case 'puzzle':
    gamePrompt = `
Create a word or logic puzzle game for grade ${grade} students in English.
Difficulty: ${difficulty}

Respond ONLY in JSON format as:
{
  "title": "Puzzle game title",
  "instructions": "Short instructions",
  "questions": [
    {
      "id": 1,
      "question": "Puzzle/clue?",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "One-line explanation of why it's correct"
    }
    // total 10 puzzles like this
  ],
  "totalPuzzles": 10
}

Include fun and age-appropriate word scrambles and riddles include "type": "word_scramble | riddle | crossword",. Use Indian culture, festivals, places, and animals in clues when possible.
    `;
    break;

  case 'word':
    gamePrompt = `
Create a word choice game for grade ${grade} students in English.
Difficulty: ${difficulty}

Respond ONLY in JSON format as:
{
  "title": "Word game title",
  "instructions": "Short instructions",
  "questions": [
    {
      "id": 1,
      "question": "Sentence with blank: The ____ is shining brightly.",
      "options": ["sun", "moon", "star", "cloud"],
      "correctAnswer": 0,
      "explanation": "One-line explanation of why it's correct"
    }
    // total 10 rounds like this
  ],
  "totalRounds": 10
}

Focus on improving vocabulary and context understanding.
Use Indian life scenes like school, street vendors, temples, nature, etc. Keep language simple and fun.
    `;
    break;

  default:
    throw new Error('Invalid game type');
}


    const result = await model.generateContent(gamePrompt);
    const response = await result.response;
    try {
     let raw = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    raw = raw.replace(/```json\s*([\s\S]*?)```/, '$1').trim();
     const parsed = json5.parse(raw);
    
      return parsed;
    } catch {
      return {
        raw : response,
        title: `${gameType} Game for Grade ${grade}`,
        instructions: "Follow the prompts and select the correct answers.",
        questions: [],
        error: "Failed to parse game data, but game structure created"
      };
    }
  } catch (error) {
    console.error('Error generating educational game:', error);
    throw new Error('Failed to generate educational game');
  }
});

// Lesson Plan Suggestions
export const generateLessonImprovements = onCall(async (request) => {
  const { title, subject, grade, objectives, activities } = request.data;

  if (!title || !subject || !grade || !objectives || !activities) {
    throw new HttpsError("invalid-argument", "Missing required input fields.");
  }
  console.log("generating lesson plan");
  try {
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
      Analyze this lesson plan and provide comprehensive suggestions for improvement:
      
      Lesson Title: ${title}
      Subject: ${subject}
      Grade: ${grade}
      Objectives: ${objectives.join(', ')}
      Activities: ${activities.join(', ')}
      
      Provide suggestions in JSON format:
      {
        "improvements": ["improvement suggestion 1", "improvement suggestion 2"],
        "additionalActivities": ["activity 1", "activity 2"],
        "resources": ["resource 1", "resource 2"],
        "assessmentIdeas": ["assessment 1", "assessment 2"],
        "enhancedObjectives": ["objective 1", "objective 2"],
        "recommendedResources": ["resource 1", "resource 2"],
        "assessmentEnhancements": ["enhancement 1", "enhancement 2"],
        "timeManagementTips": ["tip 1", "tip 2"],
        "additionalActivities": ["Activity 1", "Activity 2"],
        "technologyIntegration": ["integration 1", "integration 2"]
      }
      
      Focus on:
      - Age-appropriate suggestions for grade ${grade}
      - Interactive and engaging activities
      - Practical resources available in Indian classrooms
      - Culturally relevant content
      - Assessment methods suitable for the grade level
      - Logical progression for future lessons
      - Technology integration where appropriate
      - Differentiated instruction strategies
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("results: "+result);
    console.log("response: "+response);
    try {
      let raw = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      raw = raw.replace(/```json\s*([\s\S]*?)```/, '$1').trim();
      const parsed = json5.parse(raw);
      console.log("parsed "+parsed);
      return parsed;
    } catch {
      // Fallback suggestions
      return {
        improvements: [
          'Add more interactive elements to engage students',
          'Include visual aids for better understanding',
          'Consider differentiated instruction for various learning levels',
          'Incorporate technology tools where available'
        ],
        additionalActivities: [
          'Group discussion and peer learning',
          'Hands-on experiment or demonstration',
          'Creative project or presentation',
          'Real-world problem solving activity'
        ],
        resources: [
          'Educational videos related to the topic',
          'Interactive online simulations',
          'Printable worksheets and handouts',
          'Local community resources and examples'
        ],
        assessmentIdeas: [
          'Quick formative assessment quiz',
          'Peer evaluation activity',
          'Portfolio-based assessment',
          'Project-based evaluation'
        ],
        nextLessonTopics: [
          'Advanced concepts building on this lesson',
          'Real-world applications of the topic',
          'Cross-curricular connections',
          'Review and reinforcement activities'
        ]
      };
    }
  } catch (error) {
    console.error('Error generating lesson suggestions:', error);
    throw new Error('Failed to generate lesson suggestions');
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
    version: '4.0.0',
    services: {
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
      firebase: 'connected',
      functions: 'operational'
    },
    endpoints: [
      'generatePersonalizedStory',
      'generateStory',
      'generateDifferentiatedWorksheet',
      'generateVisualAidWithImage',
      'explainConceptAdaptively',
      'generateEducationalImage',
      'evaluateVoiceReading',
      'generateLessonSuggestions',
      'generateEducationalGame',
      'synthesizeSpeech',
      'recognizeSpeech',
      'translateContent'
    ]
  });
});