import { geminiModel } from '../config/gemini';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export interface StoryRequest {
  prompt: string;
  language: string;
  grade: string;
  subject: string;
}

export interface WorksheetRequest {
  imageData: string;
  subject: string;
  grade: string;
  language: string;
}

export interface VisualAidRequest {
  topic: string;
  subject: string;
  grade: string;
  language: string;
}

export interface ConceptRequest {
  question: string;
  difficulty: string;
  subject?: string;
}

export class AIService {
  // Firebase Functions for production
  private static generateStoryFunction = httpsCallable(functions, 'generateStory');
  private static generateWorksheetFunction = httpsCallable(functions, 'generateWorksheet');
  private static generateVisualAidFunction = httpsCallable(functions, 'generateVisualAid');

  static async generateStory(request: StoryRequest): Promise<string> {
    try {
      // Try Firebase Function first (production)
      if (import.meta.env.PROD) {
        const result = await this.generateStoryFunction(request);
        return (result.data as any).story;
      }

      // Fallback to direct Gemini API (development)
      const prompt = `
        Create an educational story in ${request.language} for grade ${request.grade} students about: ${request.prompt}
        
        Requirements:
        - Make it culturally relevant to Indian students
        - Use simple language appropriate for the grade level
        - Include moral values and educational content
        - Make it engaging and relatable
        - Length: 300-500 words
        - Include characters with Indian names
        - Set in familiar Indian environments (village, town, school)
        
        Subject context: ${request.subject}
        
        Format the story with proper paragraphs and make it engaging for children.
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating story:', error);
      return this.getMockStory(request);
    }
  }

  static async generateWorksheet(request: WorksheetRequest): Promise<string> {
    try {
      // Try Firebase Function first (production)
      if (import.meta.env.PROD) {
        const result = await this.generateWorksheetFunction(request);
        return (result.data as any).worksheet;
      }

      // Fallback to direct Gemini API (development)
      const prompt = `
        Create a comprehensive worksheet for grade ${request.grade} ${request.subject} students in ${request.language}.
        
        Include:
        - 8-12 questions of varying difficulty levels
        - Mix of question types: Multiple choice (4 options), Fill-in-the-blanks, Short answer, and Problem-solving
        - Clear instructions for each section
        - Proper formatting for easy printing
        - Educational and engaging content
        - Answer key at the bottom
        
        Structure:
        1. Header with subject, grade, and date fields
        2. Instructions section
        3. Multiple sections with different question types
        4. Answer key
        
        Make it practical and suitable for classroom use.
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating worksheet:', error);
      return this.getMockWorksheet(request);
    }
  }

  static async generateVisualAid(request: VisualAidRequest): Promise<string> {
    try {
      // Try Firebase Function first (production)
      if (import.meta.env.PROD) {
        const result = await this.generateVisualAidFunction(request);
        return (result.data as any).visualAid;
      }

      // Fallback to direct Gemini API (development)
      const prompt = `
        Create a detailed visual aid guide for teaching "${request.topic}" to grade ${request.grade} ${request.subject} students.
        
        Include:
        - Step-by-step instructions for creating visual elements on blackboard/whiteboard
        - Simple diagrams and illustrations that can be drawn easily
        - Key points to highlight and emphasize
        - Interactive elements for student engagement
        - Color suggestions (if materials available)
        - Estimated time to create: 10-15 minutes
        - Materials needed (chalk, markers, ruler, etc.)
        
        Language: ${request.language}
        
        Make it practical for teachers with limited resources and focus on:
        - Clear, simple drawings
        - Student participation opportunities
        - Real-world connections
        - Memory aids and mnemonics
        
        Format as a step-by-step teaching guide.
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating visual aid:', error);
      return this.getMockVisualAid(request);
    }
  }

  static async explainConcept(request: ConceptRequest): Promise<string> {
    try {
      const prompt = `
        Explain the following concept in simple terms for ${request.difficulty} level students: ${request.question}
        
        Requirements:
        - Use age-appropriate language
        - Include real-world examples and analogies
        - Break down complex ideas into simple steps
        - Add fun facts or interesting details
        - Suggest hands-on activities or experiments
        - Make it engaging and memorable
        
        ${request.subject ? `Subject context: ${request.subject}` : ''}
        
        Structure your explanation with:
        1. Simple definition
        2. Step-by-step explanation
        3. Real-world examples
        4. Fun facts
        5. Simple experiment or activity suggestion
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error explaining concept:', error);
      return this.getMockExplanation(request);
    }
  }

  // Enhanced mock methods with better content
  private static getMockStory(request: StoryRequest): string {
    const stories = {
      hindi: `**${request.subject} की अद्भुत कहानी - कक्षा ${request.grade}**

एक छोटे से गांव में राम नाम का एक जिज्ञासु बच्चा रहता था। राम को हमेशा नई चीजें सीखने का शौक था। एक दिन स्कूल में शिक्षक जी ने ${request.prompt} के बारे में पढ़ाया।

राम ने बहुत ध्यान से सुना और सोचा, "यह तो बहुत दिलचस्प है!" उसने अपने दोस्त श्याम से कहा, "चलो इसके बारे में और जानते हैं।"

दोनों दोस्तों ने मिलकर इस विषय पर खोजबीन की। उन्होंने पाया कि यह उनके दैनिक जीवन से कैसे जुड़ा हुआ है। राम की दादी माँ ने भी उन्हें इस बारे में पुरानी कहानियां सुनाईं।

अंत में, राम और श्याम ने समझा कि ज्ञान सबसे बड़ी संपत्ति है। उन्होंने अपने गांव के अन्य बच्चों के साथ भी यह जानकारी साझा की।

**शिक्षा:** हमें हमेशा सीखते रहना चाहिए और अपने ज्ञान का उपयोग समाज की भलाई के लिए करना चाहिए।`,
      
      english: `**The Amazing Story of ${request.subject} - Grade ${request.grade}**

Once upon a time, in a small village in India, there lived a curious boy named Arjun. Arjun loved learning new things and always asked "Why?" and "How?" about everything around him.

One sunny morning at school, his teacher Mrs. Sharma taught the class about ${request.prompt}. Arjun's eyes sparkled with excitement as he listened carefully to every word.

"This is fascinating!" thought Arjun. After school, he ran to his friend Priya and said, "Let's explore this topic together!"

The two friends spent the afternoon discovering how this concept connected to their daily lives. They observed examples in their village, asked their grandparents for wisdom, and even conducted simple experiments.

By evening, Arjun and Priya had not only understood the concept but also shared their knowledge with other children in the village.

**Moral:** Curiosity and sharing knowledge makes learning joyful and helps everyone grow together.`
    };

    return stories[request.language as keyof typeof stories] || stories.english;
  }

  private static getMockWorksheet(request: WorksheetRequest): string {
    return `**${request.subject.toUpperCase()} WORKSHEET - GRADE ${request.grade}**
**Language: ${request.language}**

**Name: _________________ Date: _________ Roll No: _____**

**Instructions: Read each question carefully and write your answer in the space provided.**

**Section A: Multiple Choice Questions (Choose the correct answer)**

1. Which of the following is correct about the topic?
   a) Option A    b) Option B    c) Option C    d) Option D

2. The main characteristic is:
   a) Statement 1    b) Statement 2    c) Statement 3    d) Statement 4

3. An example of this concept is:
   a) Example A    b) Example B    c) Example C    d) Example D

**Section B: Fill in the Blanks**

4. The process of _____________ is important because _____________.

5. We can observe this in our daily life when _____________.

6. The main components are _____________ and _____________.

**Section C: Short Answer Questions**

7. Explain in your own words what you understand about this topic. (3 marks)
   _________________________________________________
   _________________________________________________
   _________________________________________________

8. Give three examples from your surroundings. (3 marks)
   1. _____________________________________________
   2. _____________________________________________
   3. _____________________________________________

9. Why is this concept important in our daily life? (2 marks)
   _________________________________________________
   _________________________________________________

**Section D: Problem Solving**

10. Draw a simple diagram and label the important parts. (5 marks)
    [Space for drawing]

11. If you had to explain this to a younger student, what would you say? (3 marks)
    _________________________________________________
    _________________________________________________
    _________________________________________________

**Section E: Creative Thinking**

12. How can we use this knowledge to help our community? (4 marks)
    _________________________________________________
    _________________________________________________
    _________________________________________________

**ANSWER KEY:**
1. b) 2. a) 3. c) 4. [Sample answer] 5. [Sample answer] 6. [Sample answer]
7. [Detailed explanation] 8. [Three examples] 9. [Importance explanation]
10. [Diagram description] 11. [Simple explanation] 12. [Community application]

**Total Marks: 25 | Time: 45 minutes**
**Teacher's Comments: ________________________________**`;
  }

  private static getMockVisualAid(request: VisualAidRequest): string {
    return `**VISUAL AID GUIDE: ${request.topic.toUpperCase()}**
**Subject: ${request.subject} | Grade: ${request.grade} | Language: ${request.language}**

**Materials Needed:**
- Blackboard/Whiteboard
- Colored chalk/markers (white, yellow, blue, green, red)
- Ruler or straight edge
- Eraser
- Optional: Chart paper for permanent display

**STEP-BY-STEP CREATION GUIDE:**

**Step 1: Main Framework (3 minutes)**
- Draw the central concept in the middle of the board
- Use a large circle or rectangle as the main container
- Write the topic name clearly at the top
- Leave space around for supporting elements

**Step 2: Core Components (5 minutes)**
- Add 3-4 key elements around the main concept
- Use different shapes for different types of information
- Connect with arrows to show relationships
- Use colors to categorize information:
  * Blue for processes
  * Green for natural elements
  * Red for important warnings/key points
  * Yellow for examples

**Step 3: Interactive Elements (4 minutes)**
- Add blank spaces for student input
- Include question marks where students can contribute
- Create "Before" and "After" sections if applicable
- Add a "Real-life Examples" corner

**Step 4: Enhancement Details (3 minutes)**
- Add simple icons or symbols
- Include measurement scales if relevant
- Draw arrows to show direction/flow
- Add a legend explaining symbols used

**STUDENT ENGAGEMENT STRATEGIES:**

**During Creation:**
- Ask students to suggest colors for different parts
- Have volunteers come forward to add labels
- Let students draw simple elements under guidance
- Encourage questions throughout the process

**After Completion:**
- Students take turns explaining different sections
- Ask for additional real-world examples
- Have students copy the diagram in their notebooks
- Use the visual aid for quick revision sessions

**KEY TEACHING POINTS TO EMPHASIZE:**
• Main concept definition and importance
• How it connects to students' daily experiences
• Common misconceptions to address
• Practical applications in their environment

**MAINTENANCE TIPS:**
- Take a photo for future reference
- Create a smaller version on chart paper
- Update with seasonal examples
- Use as a reference for related topics

**ESTIMATED TOTAL TIME: 15 minutes**
**DIFFICULTY LEVEL: Appropriate for Grade ${request.grade}**

**EXTENSION ACTIVITIES:**
- Students create their own mini-versions
- Group discussions using the visual aid
- Quiz games pointing to different parts
- Story creation based on the visual elements`;
  }

  private static getMockExplanation(request: ConceptRequest): string {
    return `**SIMPLE EXPLANATION: ${request.question}**

**What is it?**
This is a fundamental concept that helps us understand how things work in our world. Think of it like a puzzle piece that fits into the bigger picture of learning.

**Step-by-Step Explanation:**

**Step 1: The Basics**
Imagine you're looking at something for the first time. The basic idea is simple - it's like when you see how things connect and work together.

**Step 2: How It Works**
Just like how a bicycle needs all its parts to work properly, this concept has different parts that work together to create the complete picture.

**Step 3: Why It Matters**
This is important because it helps us understand and predict what might happen in similar situations.

**Real-World Examples:**
- In your home: [Example from daily life]
- In nature: [Natural example]
- In your community: [Local example]

**Fun Facts:**
• Did you know that this concept has been known for hundreds of years?
• Scientists use this idea to make new discoveries
• You can observe this happening around you every day

**Simple Experiment You Can Try:**
1. Gather simple materials from around your house
2. Follow these easy steps to see the concept in action
3. Observe what happens and ask "Why?"
4. Share your findings with friends and family

**Memory Trick:**
Remember this concept by thinking of the acronym or simple rhyme that connects to your daily experience.

**Questions to Think About:**
- How does this connect to what you already know?
- Where else might you see this happening?
- How can you use this knowledge to help others?`;
  }
}