import React, { useState } from 'react';
import { HelpCircle, Sparkles, BookOpen, Lightbulb, Brain, Save, Copy, Download } from 'lucide-react';
import { AIService } from '../../services/aiService';
import { FirebaseService } from '../../services/firebaseService';
import { useAuth } from '../../hooks/useAuth';
import { generatePDF } from '../../utils/pdfGenerator';

const ConceptExplainer: React.FC = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [difficulty, setDifficulty] = useState('beginner');
  const [subject, setSubject] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const difficulties = [
    { value: 'beginner', label: 'Beginner (Age 6-8)' },
    { value: 'intermediate', label: 'Intermediate (Age 9-11)' },
    { value: 'advanced', label: 'Advanced (Age 12+)' },
  ];

  const subjects = [
    { value: '', label: 'General' },
    { value: 'science', label: 'Science' },
    { value: 'math', label: 'Mathematics' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'social', label: 'Social Studies' },
    { value: 'evs', label: 'Environmental Studies' },
  ];

  const sampleQuestions = [
    'Why does it rain?',
    'How does photosynthesis work?',
    'What makes the seasons change?',
    'Why do we have day and night?',
    'How do plants grow?',
    'What is gravity?',
    'Why is the sky blue?',
    'How do magnets work?',
    'What causes earthquakes?',
    'Why do we need to breathe?'
  ];

  const handleExplain = async () => {
    if (!question.trim()) return;
    
    setIsExplaining(true);
    try {
      const result = await AIService.explainConcept({
        question,
        difficulty,
        subject: subject || undefined
      });
      setExplanation(result);
    } catch (error) {
      console.error('Error explaining concept:', error);
      setExplanation('Sorry, I encountered an error while generating the explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSave = async () => {
    if (!explanation || !user) return;
    
    setIsSaving(true);
    try {
      await FirebaseService.saveGeneratedContent({
        type: 'concept-explanation',
        title: `Concept: ${question}`,
        content: explanation,
        subject: subject || 'general',
        grade: difficulty === 'beginner' ? '1-2' : difficulty === 'intermediate' ? '3-5' : '6-8',
        language: 'english',
        teacherId: user.uid,
        tags: ['concept', 'explanation', difficulty],
        metadata: { question, difficulty, subject }
      });
      alert('Explanation saved successfully!');
    } catch (error) {
      console.error('Error saving explanation:', error);
      alert('Error saving explanation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    alert('Explanation copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    generatePDF(explanation, `Concept_Explanation_${question.substring(0, 20).replace(/\s+/g, '_')}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Concept Explainer</h1>
            <p className="text-gray-600">Get simple, age-appropriate explanations for complex topics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Ask Your Question</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {difficulties.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {subjects.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any question about science, math, or any topic you want to explain to your students..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Popular questions:</p>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {sampleQuestions.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(sample)}
                    className="text-left text-sm text-green-600 hover:text-green-700 hover:underline p-2 rounded-lg hover:bg-green-50 transition-all duration-200"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExplain}
              disabled={!question.trim() || isExplaining}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isExplaining ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Explaining...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Explain This</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">Teaching Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use simple analogies and real-world examples</li>
              <li>• Break complex topics into smaller, digestible parts</li>
              <li>• Encourage questions and foster curiosity</li>
              <li>• Use visual aids and hands-on activities when possible</li>
              <li>• Relate concepts to students' daily experiences</li>
              <li>• Check understanding frequently during explanation</li>
              <li>• Provide multiple examples to reinforce learning</li>
            </ul>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Explanation</h2>
              <div className="flex items-center space-x-2">
                {explanation && (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                      title="Save Explanation"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {explanation ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                      {explanation}
                    </pre>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => setQuestion('')}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all duration-200"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Ask Another</span>
                  </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps for Teaching:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Create visual aids based on this explanation</li>
                    <li>• Prepare hands-on activities to demonstrate the concept</li>
                    <li>• Think of local examples students can relate to</li>
                    <li>• Prepare follow-up questions to check understanding</li>
                    <li>• Consider creating a worksheet based on this topic</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your explanation will appear here</p>
                  <p className="text-sm mt-2">Ask a question and click explain to get started</p>
                </div>
              </div>
            )}
          </div>

          {explanation && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-200">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-purple-800">Create Story</p>
                    <p className="text-sm text-purple-600">Generate a story based on this concept</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-200">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                  <div className="text-left">
                    <p className="font-medium text-orange-800">Create Visual Aid</p>
                    <p className="text-sm text-orange-600">Make a visual teaching aid for this topic</p>
                  </div>
                </button>
                <button className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-200">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-blue-800">Create Worksheet</p>
                    <p className="text-sm text-blue-600">Generate practice questions on this concept</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConceptExplainer;