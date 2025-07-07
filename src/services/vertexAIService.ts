import { VertexAI } from '@google-cloud/vertexai';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { SpeechClient } from '@google-cloud/speech';

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: import.meta.env.VITE_GOOGLE_CLOUD_PROJECT_ID,
  location: 'asia-south1',
});

const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: 'gemini-1.5-pro-preview-0409',
});

const imageModel = vertex_ai.preview.getGenerativeModel({
  model: 'imagegeneration@006',
});

// Initialize Speech services
const ttsClient = new TextToSpeechClient();
const speechClient = new SpeechClient();

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
  style?: 'educational' | 'cartoon' | 'realistic' | 'diagram';
  language?: string;
}

export interface SpeechRequest {
  text: string;
  languageCode: string;
  voiceName?: string;
}

export interface SpeechRecognitionRequest {
  audioContent: string;
  languageCode: string;
}

export class VertexAIService {
  // Enhanced Story Generation with personalization
  static async generatePersonalizedStory(request: {
    prompt: string;
    language: string;
    grade: string;
    subject: string;
    studentName?: string;
    localContext?: string;
    previousFeedback?: string[];
  }): Promise<string> {
    try {
      const personalizedPrompt = `
        Create an educational story in ${request.language} for grade ${request.grade} students about: ${request.prompt}
        
        Personalization Context:
        ${request.studentName ? `- Student name: ${request.studentName}` : ''}
        ${request.localContext ? `- Local context: ${request.localContext}` : ''}
        ${request.previousFeedback ? `- Previous feedback: ${request.previousFeedback.join(', ')}` : ''}
        
        Requirements:
        - Make it culturally relevant to Indian students
        - Use simple language appropriate for grade ${request.grade}
        - Include moral values and educational content
        - Make it engaging and relatable
        - Length: 400-600 words
        - Include characters with Indian names
        - Set in familiar Indian environments (village, town, school)
        - Incorporate local festivals, food, and customs
        - Use storytelling techniques that resonate with Indian culture
        
        Subject context: ${request.subject}
        
        Structure the story with:
        1. Engaging opening that connects to student's world
        2. Educational content woven naturally into narrative
        3. Character development with relatable challenges
        4. Clear moral or lesson that applies to daily life
        5. Satisfying conclusion with actionable takeaway
        
        Make the story memorable and encourage discussion.
      `;

      const result = await generativeModel.generateContent(personalizedPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating personalized story:', error);
      throw new Error('Failed to generate personalized story');
    }
  }

  // Enhanced Worksheet Generation with differentiation
  static async generateDifferentiatedWorksheet(request: {
    imageData?: string;
    topic: string;
    subject: string;
    grades: string[];
    language: string;
    difficulty: 'easy' | 'medium' | 'hard';
    includeVisuals: boolean;
  }): Promise<{ [grade: string]: string }> {
    try {
      const worksheets: { [grade: string]: string } = {};
      
      for (const grade of request.grades) {
        const prompt = `
          Create a comprehensive worksheet for grade ${grade} ${request.subject} students in ${request.language}.
          Topic: ${request.topic}
          Difficulty: ${request.difficulty}
          
          Include:
          - 10-15 questions of varying types appropriate for grade ${grade}
          - Mix of question types: Multiple choice, Fill-in-the-blanks, Short answer, Problem-solving, Creative thinking
          - Clear instructions in ${request.language}
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
        `;

        const result = await generativeModel.generateContent(prompt);
        const response = await result.response;
        worksheets[grade] = response.text();
      }
      
      return worksheets;
    } catch (error) {
      console.error('Error generating differentiated worksheet:', error);
      throw new Error('Failed to generate differentiated worksheet');
    }
  }

  // Image Generation for Visual Aids
  static async generateEducationalImage(request: ImageGenerationRequest): Promise<string> {
    try {
      const enhancedPrompt = `
        Educational illustration: ${request.prompt}
        Style: Clean, simple, educational diagram suitable for classroom use
        Requirements: 
        - Clear, bold lines that are visible from distance
        - Minimal text, focus on visual elements
        - Appropriate for Indian classroom context
        - Easy to understand for students
        - Professional educational quality
        - ${request.style || 'diagram'} style
        Language context: ${request.language || 'universal'}
      `;

      const imageRequest = {
        instances: [{
          prompt: enhancedPrompt,
          parameters: {
            sampleCount: 1,
            aspectRatio: request.aspectRatio || '4:3',
            safetyFilterLevel: 'block_some',
            personGeneration: 'dont_allow'
          }
        }],
      };

      const [response] = await imageModel.predict(imageRequest);
      
      if (response.predictions && response.predictions[0]) {
        return response.predictions[0].bytesBase64Encoded;
      }
      
      throw new Error('No image generated');
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate educational image');
    }
  }

  // Text-to-Speech for multiple languages
  static async synthesizeSpeech(request: SpeechRequest): Promise<string> {
    try {
      const [response] = await ttsClient.synthesizeSpeech({
        input: { text: request.text },
        voice: {
          languageCode: request.languageCode,
          name: request.voiceName,
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.9,
          pitch: 0,
        },
      });

      if (response.audioContent) {
        const audioBase64 = Buffer.from(response.audioContent).toString('base64');
        return `data:audio/mp3;base64,${audioBase64}`;
      }
      
      throw new Error('No audio content generated');
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw new Error('Failed to synthesize speech');
    }
  }

  // Speech-to-Text for voice input
  static async recognizeSpeech(request: SpeechRecognitionRequest): Promise<string> {
    try {
      const [response] = await speechClient.recognize({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: request.languageCode,
          enableAutomaticPunctuation: true,
          model: 'latest_long',
        },
        audio: {
          content: request.audioContent,
        },
      });

      if (response.results && response.results[0] && response.results[0].alternatives) {
        return response.results[0].alternatives[0].transcript || '';
      }
      
      return '';
    } catch (error) {
      console.error('Error recognizing speech:', error);
      throw new Error('Failed to recognize speech');
    }
  }

  // Enhanced Concept Explanation with adaptive learning
  static async explainConceptAdaptively(request: {
    question: string;
    difficulty: string;
    subject?: string;
    language: string;
    studentLevel?: string;
    previousQuestions?: string[];
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  }): Promise<{
    explanation: string;
    visualAids: string[];
    activities: string[];
    assessmentQuestions: string[];
    nextTopics: string[];
  }> {
    try {
      const prompt = `
        Provide a comprehensive, adaptive explanation for: ${request.question}
        
        Context:
        - Difficulty level: ${request.difficulty}
        - Subject: ${request.subject || 'general'}
        - Language: ${request.language}
        - Student level: ${request.studentLevel || 'beginner'}
        - Learning style preference: ${request.learningStyle || 'mixed'}
        - Previous questions: ${request.previousQuestions?.join(', ') || 'none'}
        
        Provide a JSON response with the following structure:
        {
          "explanation": "Detailed explanation adapted to the student's level and learning style",
          "visualAids": ["List of visual aids that would help explain this concept"],
          "activities": ["Hands-on activities to reinforce learning"],
          "assessmentQuestions": ["Questions to check understanding"],
          "nextTopics": ["Related topics to explore next"]
        }
        
        Requirements:
        - Use age-appropriate language for ${request.difficulty} level
        - Include cultural context relevant to Indian students
        - Provide real-world examples from Indian context
        - Adapt explanation style to ${request.learningStyle} learning preference
        - Build upon previous knowledge indicated by previous questions
        - Include memory techniques and mnemonics
        - Suggest practical applications
      `;

      const result = await generativeModel.generateContent(prompt);
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
  }

  // Generate Visual Aid Instructions with Image
  static async generateVisualAidWithImage(request: {
    topic: string;
    subject: string;
    grade: string;
    language: string;
    includeImage: boolean;
  }): Promise<{
    instructions: string;
    imageUrl?: string;
    materials: string[];
    timeEstimate: string;
    difficulty: string;
  }> {
    try {
      // Generate instructions
      const instructionsPrompt = `
        Create detailed visual aid instructions for teaching "${request.topic}" to grade ${request.grade} ${request.subject} students.
        Language: ${request.language}
        
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
        
        Make it practical for teachers with limited resources.
      `;

      const instructionsResult = await generativeModel.generateContent(instructionsPrompt);
      const instructionsResponse = await instructionsResult.response;
      
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(instructionsResponse.text());
      } catch {
        parsedResponse = {
          instructions: instructionsResponse.text(),
          materials: ['Blackboard', 'Chalk', 'Ruler'],
          timeEstimate: '15 minutes',
          difficulty: 'Medium'
        };
      }

      // Generate image if requested
      let imageUrl;
      if (request.includeImage) {
        try {
          const imagePrompt = `Educational diagram for ${request.topic}, simple line drawing style, suitable for blackboard recreation, clear labels, educational illustration`;
          imageUrl = await this.generateEducationalImage({
            prompt: imagePrompt,
            aspectRatio: '4:3',
            style: 'diagram',
            language: request.language
          });
        } catch (error) {
          console.warn('Image generation failed, continuing without image:', error);
        }
      }

      return {
        ...parsedResponse,
        imageUrl
      };
    } catch (error) {
      console.error('Error generating visual aid with image:', error);
      throw new Error('Failed to generate visual aid with image');
    }
  }

  // Language Translation
  static async translateContent(text: string, targetLanguage: string): Promise<string> {
    try {
      const prompt = `
        Translate the following educational content to ${targetLanguage}.
        Maintain the educational context and cultural appropriateness.
        Keep technical terms accurate and age-appropriate.
        
        Content to translate:
        ${text}
        
        Provide only the translation, maintaining the original formatting.
      `;

      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error translating content:', error);
      throw new Error('Failed to translate content');
    }
  }

  // Personalized Learning Path Generation
  static async generateLearningPath(request: {
    studentProfile: {
      grade: string;
      subjects: string[];
      strengths: string[];
      challenges: string[];
      interests: string[];
    };
    language: string;
    duration: string; // 'week' | 'month' | 'term'
  }): Promise<{
    path: Array<{
      week: number;
      topics: string[];
      activities: string[];
      assessments: string[];
      resources: string[];
    }>;
    adaptations: string[];
    parentGuidance: string[];
  }> {
    try {
      const prompt = `
        Create a personalized learning path for a grade ${request.studentProfile.grade} student.
        
        Student Profile:
        - Subjects: ${request.studentProfile.subjects.join(', ')}
        - Strengths: ${request.studentProfile.strengths.join(', ')}
        - Challenges: ${request.studentProfile.challenges.join(', ')}
        - Interests: ${request.studentProfile.interests.join(', ')}
        
        Duration: ${request.duration}
        Language: ${request.language}
        
        Provide a JSON response with a structured learning path that:
        - Builds on student strengths
        - Addresses challenges with appropriate support
        - Incorporates student interests
        - Follows Indian curriculum guidelines
        - Includes cultural context
        - Provides differentiated activities
        - Suggests assessment methods
        - Includes parent involvement strategies
      `;

      const result = await generativeModel.generateContent(prompt);
      const response = await result.response;
      
      try {
        return JSON.parse(response.text());
      } catch {
        throw new Error('Failed to parse learning path response');
      }
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw new Error('Failed to generate personalized learning path');
    }
  }
}