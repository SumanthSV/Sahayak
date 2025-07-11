import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Image, 
  Sparkles, 
  Download, 
  Copy, 
  Save, 
  Eye,
  Palette,
  Layers,
  Zap
} from 'lucide-react';
import { FirebaseService } from '../services/firebaseService';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { generatePDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';
import { VertexAIService } from '../services/vertexAIService';

const VisualAids: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentLanguage } = useLanguage();
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('science');
  const [grade, setGrade] = useState('3');
  const [language, setLanguage] = useState(currentLanguage);
  const [includeImage, setIncludeImage] = useState(true);
  const [generatedAid, setGeneratedAid] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const subjects = [
    { value: 'science', label: t('science') },
    { value: 'math', label: t('mathematics') },
    { value: 'english', label: t('english') },
    { value: 'hindi', label: t('hindi') },
    { value: 'social', label: t('socialStudies') },
    { value: 'evs', label: t('environmentalStudies') },
  ];

  const grades = [
    { value: '1', label: t('grade1') },
    { value: '2', label: t('grade2') },
    { value: '3', label: t('grade3') },
    { value: '4', label: t('grade4') },
    { value: '5', label: t('grade5') },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
  ];

  const languages = [
    { value: 'hi', label: 'हिंदी' },
    { value: 'en', label: 'English' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'mr', label: 'मराठी' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'bn', label: 'বাংলা' },
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
    'States of Matter',
    'Food Chain and Food Web'
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await VertexAIService.generateVisualAidWithImage({
        topic,
        subject,
        grade,
        language,
        includeImage
      });
      setGeneratedAid(result);
      toast.success('Visual aid generated successfully!');
    } catch (error) {
      console.error('Error generating visual aid:', error);
      toast.error('Failed to generate visual aid. Please try again.');
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
        content: JSON.stringify(generatedAid),
        subject,
        grade,
        language,
        teacherId: user.uid,
        metadata: { topic, includeImage },
        createdAt: new Date()
      });
      toast.success('Visual aid saved successfully!');
    } catch (error) {
      console.error('Error saving visual aid:', error);
      toast.error('Error saving visual aid. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    if (generatedAid) {
      navigator.clipboard.writeText(generatedAid.instructions);
      toast.success('Instructions copied to clipboard!');
    }
  };

  const handleDownloadPDF = () => {
    if (generatedAid) {
      const content = `
Visual Aid: ${topic}
Subject: ${subject} | Grade: ${grade} | Language: ${language}

${generatedAid.instructions}

Materials Needed:
${generatedAid.materials?.join('\n') || 'Not specified'}

Time Estimate: ${generatedAid.timeEstimate || 'Not specified'}
Difficulty: ${generatedAid.difficulty || 'Not specified'}
      `;
      generatePDF(content, `Visual_Aid_${topic.replace(/\s+/g, '_')}`);
      toast.success('PDF downloaded successfully!');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center"
          >
            <Image className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Visual Aid Generator
            </h1>
            <p className="text-gray-600">Create engaging visual aids with AI-generated images and instructions</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Palette className="w-5 h-5 text-orange-600 mr-2" />
              Configuration
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
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
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeImage}
                  onChange={(e) => setIncludeImage(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Generate AI image along with instructions
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                AI-generated images help visualize the concept before drawing on blackboard
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Popular topics:</p>
              <div className="grid grid-cols-2 gap-2">
                {sampleTopics.map((sampleTopic, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTopic(sampleTopic)}
                    className="text-left text-sm text-orange-600 hover:text-orange-700 hover:underline p-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                  >
                    {sampleTopic}
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-800">Teaching Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Use simple, clear diagrams that students can easily see from the back
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Include interactive elements to engage students in the drawing process
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Use colors strategically to highlight important concepts and relationships
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Practice drawing the aid before class to ensure smooth execution
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">•</span>
                Involve students in completing parts of the diagram for better engagement
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Layers className="w-5 h-5 text-orange-600 mr-2" />
                Generated Visual Aid
              </h2>
              {generatedAid && (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                    title="Save Visual Aid"
                  >
                    <Save className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </div>

            {generatedAid ? (
              <div className="space-y-6">
                {/* AI Generated Image */}
                {generatedAid.imageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200/50"
                  >
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Zap className="w-4 h-4 text-orange-600 mr-2" />
                      AI-Generated Reference Image
                    </h3>
                    <img
                      src={`data:image/png;base64,${generatedAid.imageUrl}`}
                      alt={`Visual aid for ${topic}`}
                      className="w-full max-w-md mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Use this as a reference while drawing on the blackboard
                    </p>
                  </motion.div>
                )}

                {/* Instructions */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-l-4 border-orange-500">
                  <h3 className="font-semibold text-gray-800 mb-3">Step-by-Step Instructions</h3>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-800 font-sans leading-relaxed">
                      {generatedAid.instructions}
                    </pre>
                  </div>
                </div>

                {/* Materials and Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedAid.materials && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200/50">
                      <h4 className="font-medium text-blue-800 mb-2">Materials Needed</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {generatedAid.materials.map((material: string, index: number) => (
                          <li key={index}>• {material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {generatedAid.timeEstimate && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200/50">
                      <h4 className="font-medium text-green-800 mb-2">Time Estimate</h4>
                      <p className="text-sm text-green-700">{generatedAid.timeEstimate}</p>
                    </div>
                  )}
                  
                  {generatedAid.difficulty && (
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-200/50">
                      <h4 className="font-medium text-purple-800 mb-2">Difficulty Level</h4>
                      <p className="text-sm text-purple-700">{generatedAid.difficulty}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCopy}
                    className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Instructions</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadPDF}
                    className="flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl hover:bg-red-200 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your visual aid guide will appear here</p>
                  <p className="text-sm mt-2">Enter a topic and click generate to get started</p>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VisualAids;