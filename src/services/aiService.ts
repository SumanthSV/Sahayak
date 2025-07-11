import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export interface StoryRequest {
  prompt: string;
  language: string;
  grade: string;
  subject: string;
  studentName?: string;
  localContext?: string;
  previousFeedback?: string[];
}

export interface WorksheetRequest {
  imageData?: string;
  topic: string;
  subject: string;
  grades: string[];
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  includeVisuals: boolean;
}

export interface VisualAidRequest {
  topic: string;
  subject: string;
  grade: string;
  language: string;
  includeImage: boolean;
}

export interface ConceptRequest {
  question: string;
  difficulty: string;
  subject?: string;
  language: string;
  studentLevel?: string;
  previousQuestions?: string[];
  learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
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

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
  style?: 'educational' | 'cartoon' | 'realistic' | 'diagram';
  language?: string;
}

export class AIService {
  // Firebase Functions - All AI processing happens on backend
  private static generatePersonalizedStoryFunction = httpsCallable(functions, 'generatePersonalizedStory');
  private static generateDifferentiatedWorksheetFunction = httpsCallable(functions, 'generateDifferentiatedWorksheet');
  private static generateVisualAidWithImageFunction = httpsCallable(functions, 'generateVisualAidWithImage');
  private static explainConceptAdaptivelyFunction = httpsCallable(functions, 'explainConceptAdaptively');
  private static synthesizeSpeechFunction = httpsCallable(functions, 'synthesizeSpeech');
  private static recognizeSpeechFunction = httpsCallable(functions, 'recognizeSpeech');
  private static generateEducationalImageFunction = httpsCallable(functions, 'generateEducationalImage');
  private static translateContentFunction = httpsCallable(functions, 'translateContent');

  // Story Generation
  static async generateStory(request: StoryRequest): Promise<string> {
    try {
      const result = await this.generatePersonalizedStoryFunction(request);
      return (result.data as any).story;
    } catch (error) {
      console.error('Error generating story:', error);
      throw new Error('Failed to generate story. Please check your connection and try again.');
    }
  }

  static async generatePersonalizedStory(request: StoryRequest): Promise<string> {
    try {
      const result = await this.generatePersonalizedStoryFunction(request);
      return (result.data as any).story;
    } catch (error) {
      console.error('Error generating personalized story:', error);
      throw new Error('Failed to generate personalized story. Please check your connection and try again.');
    }
  }

  // Worksheet Generation
  static async generateWorksheet(request: Omit<WorksheetRequest, 'grades' | 'difficulty' | 'includeVisuals'> & { 
    imageData?: string; 
    subject: string; 
    grade: string; 
    language: string; 
  }): Promise<string> {
    try {
      const enhancedRequest: WorksheetRequest = {
        ...request,
        grades: [request.grade],
        difficulty: 'medium',
        includeVisuals: true
      };
      const result = await this.generateDifferentiatedWorksheetFunction(enhancedRequest);
      const worksheets = (result.data as any).worksheets;
      return worksheets[request.grade] || Object.values(worksheets)[0];
    } catch (error) {
      console.error('Error generating worksheet:', error);
      throw new Error('Failed to generate worksheet. Please check your connection and try again.');
    }
  }

  static async generateDifferentiatedWorksheet(request: WorksheetRequest): Promise<{ [grade: string]: string }> {
    try {
      const result = await this.generateDifferentiatedWorksheetFunction(request);
      return (result.data as any).worksheets;
    } catch (error) {
      console.error('Error generating differentiated worksheet:', error);
      throw new Error('Failed to generate differentiated worksheet. Please check your connection and try again.');
    }
  }

  // Visual Aid Generation
  static async generateVisualAid(request: Omit<VisualAidRequest, 'includeImage'>): Promise<string> {
    try {
      const enhancedRequest: VisualAidRequest = {
        ...request,
        includeImage: false
      };
      const result = await this.generateVisualAidWithImageFunction(enhancedRequest);
      return (result.data as any).instructions;
    } catch (error) {
      console.error('Error generating visual aid:', error);
      throw new Error('Failed to generate visual aid. Please check your connection and try again.');
    }
  }

  static async generateVisualAidWithImage(request: VisualAidRequest): Promise<{
    instructions: string;
    imageUrl?: string;
    materials: string[];
    timeEstimate: string;
    difficulty: string;
  }> {
    try {
      const result = await this.generateVisualAidWithImageFunction(request);
      return (result.data as any);
    } catch (error) {
      console.error('Error generating visual aid with image:', error);
      throw new Error('Failed to generate visual aid with image. Please check your connection and try again.');
    }
  }

  // Concept Explanation
  static async explainConcept(request: Omit<ConceptRequest, 'language' | 'studentLevel' | 'previousQuestions' | 'learningStyle'>): Promise<string> {
    try {
      const enhancedRequest: ConceptRequest = {
        ...request,
        language: 'english',
        studentLevel: 'beginner',
        previousQuestions: [],
        learningStyle: 'visual'
      };
      const result = await this.explainConceptAdaptivelyFunction(enhancedRequest);
      return (result.data as any).explanation;
    } catch (error) {
      console.error('Error explaining concept:', error);
      throw new Error('Failed to explain concept. Please check your connection and try again.');
    }
  }

  static async explainConceptAdaptively(request: ConceptRequest): Promise<{
    explanation: string;
    visualAids: string[];
    activities: string[];
    assessmentQuestions: string[];
    nextTopics: string[];
  }> {
    try {
      const result = await this.explainConceptAdaptivelyFunction(request);
      return (result.data as any);
    } catch (error) {
      console.error('Error explaining concept adaptively:', error);
      throw new Error('Failed to explain concept adaptively. Please check your connection and try again.');
    }
  }

  // Speech Services
  static async synthesizeSpeech(request: SpeechRequest): Promise<string> {
    try {
      const result = await this.synthesizeSpeechFunction(request);
      return (result.data as any).audioUrl;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      throw new Error('Failed to synthesize speech. Please check your connection and try again.');
    }
  }

  static async recognizeSpeech(request: SpeechRecognitionRequest): Promise<string> {
    try {
      const result = await this.recognizeSpeechFunction(request);
      return (result.data as any).transcript;
    } catch (error) {
      console.error('Error recognizing speech:', error);
      throw new Error('Failed to recognize speech. Please check your connection and try again.');
    }
  }

  // Image Generation
  static async generateEducationalImage(request: ImageGenerationRequest): Promise<string> {
    try {
      const result = await this.generateEducationalImageFunction(request);
      return (result.data as any).imageBase64;
    } catch (error) {
      console.error('Error generating educational image:', error);
      throw new Error('Failed to generate educational image. Please check your connection and try again.');
    }
  }

  // Translation
  static async translateContent(text: string, targetLanguage: string): Promise<string> {
    try {
      const result = await this.translateContentFunction({ text, targetLanguage });
      return (result.data as any).translatedText;
    } catch (error) {
      console.error('Error translating content:', error);
      throw new Error('Failed to translate content. Please check your connection and try again.');
    }
  }
}