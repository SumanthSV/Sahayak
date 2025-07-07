import React, { useState } from 'react';
import { 
  Languages, 
  Sparkles, 
  Download, 
  Copy, 
  RefreshCw, 
  Mic,
  MicOff,
  Volume2,
  Edit3,
  Save,
  FileText
} from 'lucide-react';
import { AIService } from '../../services/aiService';
import { FirebaseService } from '../../services/firebaseService';
import { useAuth } from '../../hooks/useAuth';
import { generatePDF } from '../../utils/pdfGenerator';

const StoryGenerator: React.FC = () => {
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [selectedSubject, setSelectedSubject] = useState('science');
  const [selectedGrade, setSelectedGrade] = useState('3');
  const [prompt, setPrompt] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [editableStory, setEditableStory] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const languages = [
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'kannada', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी', flag: '🇮🇳' },
    { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'gujarati', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'english', name: 'English', flag: '🇬🇧' },
  ];

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
  ];

  const samplePrompts = [
    'जल चक्र के बारे में एक कहानी बनाएं जो गांव के बच्चों को समझाए',
    'मिट्टी के प्रकार के बारे में एक रोचक कहानी',
    'प्रदूषण की समस्या पर आधारित एक शिक्षाप्रद कहानी',
    'सौर मंडल की यात्रा पर आधारित एक कहानी',
    'पेड़-पौधों के महत्व पर एक कहानी',
    'स्वच्छता के बारे में एक प्रेरणादायक कहानी',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await AIService.generateStory({
        prompt,
        language: selectedLanguage,
        grade: selectedGrade,
        subject: selectedSubject
      });
      setGeneratedStory(result);
      setEditableStory(result);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedStory || !user) return;
    
    setIsSaving(true);
    try {
      await FirebaseService.saveGeneratedContent({
        type: 'story',
        title: prompt.substring(0, 50) + '...',
        content: generatedStory,
        subject: selectedSubject,
        grade: selectedGrade,
        language: selectedLanguage,
        teacherId: user.uid
      });
      alert('Story saved successfully!');
    } catch (error) {
      console.error('Error saving story:', error);
      alert('Error saving story. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice recognition logic here
    if (!isListening) {
      // Start voice recognition
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = selectedLanguage === 'hindi' ? 'hi-IN' : 'en-US';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setPrompt(transcript);
          setIsListening(false);
        };
        recognition.start();
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedStory);
    alert('Story copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    generatePDF(generatedStory, `Story_${prompt.substring(0, 20).replace(/\s+/g, '_')}`);
  };

  const handleSaveEdit = () => {
    setGeneratedStory(editableStory);
    setIsEditing(false);
  };

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(generatedStory);
      utterance.lang = selectedLanguage === 'hindi' ? 'hi-IN' : 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Hyper-Local Story Generator</h1>
            <p className="text-gray-600">Create culturally relevant stories for your students</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Languages className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Configuration</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {subjects.map((subject) => (
                    <option key={subject.value} value={subject.value}>
                      {subject.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {grades.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      selectedLanguage === lang.code
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium text-sm">{lang.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Story Prompt</h2>
              <button
                onClick={handleVoiceInput}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isListening
                    ? 'bg-red-100 text-red-600 animate-pulse'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
            </div>
            
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your story prompt in your preferred language..."
              className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Sample prompts:</p>
              <div className="space-y-2">
                {samplePrompts.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(sample)}
                    className="text-left text-sm text-purple-600 hover:text-purple-700 hover:underline block w-full p-2 rounded-lg hover:bg-purple-50 transition-all duration-200"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Story</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Generated Story</h2>
              <div className="flex items-center space-x-2">
                {generatedStory && (
                  <>
                    <button
                      onClick={handlePlayAudio}
                      className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                      title="Play Audio"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                      title="Edit Story"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200"
                      title="Save Story"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {generatedStory ? (
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editableStory}
                      onChange={(e) => setEditableStory(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all duration-200"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-l-4 border-purple-500">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                        {generatedStory}
                      </p>
                    </div>
                  </div>
                )}

                {!isEditing && (
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
                )}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your generated story will appear here</p>
                  <p className="text-sm mt-2">Enter a prompt and click generate to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;