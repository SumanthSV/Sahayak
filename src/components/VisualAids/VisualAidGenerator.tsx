import React, { useState } from 'react';
import { Image, Sparkles, Download, Copy, Save, Eye } from 'lucide-react';
import { AIService } from '../../services/aiService';
import { FirebaseService } from '../../services/firebaseService';
import { useAuth } from '../../hooks/useAuth';
import { generatePDF } from '../../utils/pdfGenerator';

const VisualAidGenerator: React.FC = () => {
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('science');
  const [grade, setGrade] = useState('3');
  const [language, setLanguage] = useState('hindi');
  const [generatedAid, setGeneratedAid] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const subjects = [
    { value: 'science', label: 'Science' },
    { value: 'math', label: 'Mathematics' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'social', label: 'Social Studies' },
    { value: 'evs', label: 'Environmental Studies' },
  ];

  const grades = [
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
  ];

  const languages = [
    { value: 'hindi', label: 'हिंदी' },
    { value: 'english', label: 'English' },
    { value: 'kannada', label: 'ಕನ್ನಡ' },
    { value: 'marathi', label: 'मराठी' },
    { value: 'tamil', label: 'தமிழ்' },
    { value: 'bengali', label: 'বাংলা' },
  ];

  const sampleTopics = [
    'Water Cycle',
    'Solar System',
    'Photosynthesis',
    'Human Digestive System',
    'Fractions and Decimals',
    'Indian Freedom Struggle',
    'Weather and Climate',
    'Plant Life Cycle',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await AIService.generateVisualAid({
        topic,
        subject,
        grade,
        language
      });
      setGeneratedAid(result);
    } catch (error) {
      console.error('Error generating visual aid:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedAid || !user) return;
    
    setIsSaving(true);
    try {
      await FirebaseService.saveGeneratedContent({
        type: 'visual-aid',
        title: `Visual Aid: ${topic}`,
        content: generatedAid,
        subject,
        grade,
        language,
        teacherId: user.uid
      });
      alert('Visual aid saved successfully!');
    } catch (error) {
      console.error('Error saving visual aid:', error);
      alert('Error saving visual aid. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedAid);
    alert('Visual aid copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    generatePDF(generatedAid, `Visual_Aid_${topic.replace(/\s+/g, '_')}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Visual Aid Generator</h1>
            <p className="text-gray-600">Create engaging visual aids for blackboard teaching</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Visual Aid Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {subjects.map((sub) => (
                    <option key={sub.value} value={sub.value}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {grades.map((gr) => (
                    <option key={gr.value} value={gr.value}>
                      {gr.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic/Concept
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic you want to create a visual aid for..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Popular topics:</p>
              <div className="grid grid-cols-2 gap-2">
                {sampleTopics.map((sampleTopic, index) => (
                  <button
                    key={index}
                    onClick={() => setTopic(sampleTopic)}
                    className="text-left text-sm text-orange-600 hover:text-orange-700 hover:underline p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                  >
                    {sampleTopic}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Visual Aid...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Visual Aid</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Teaching Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use simple, clear diagrams that students can easily see</li>
              <li>• Include interactive elements to engage students</li>
              <li>• Use colors strategically to highlight important concepts</li>
              <li>• Keep text minimal and use visual elements</li>
              <li>• Practice drawing the aid before class</li>
              <li>• Involve students in completing parts of the diagram</li>
            </ul>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Generated Visual Aid</h2>
              {generatedAid && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                    title="Save Visual Aid"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {generatedAid ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                      {generatedAid}
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
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your visual aid guide will appear here</p>
                  <p className="text-sm mt-2">Enter a topic and click generate to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualAidGenerator;