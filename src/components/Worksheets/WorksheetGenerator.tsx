import React, { useState } from 'react';
import { Upload, FileText, Image, Download, Sparkles, Eye, Edit3, Save } from 'lucide-react';
import { AIService } from '../../services/aiService';
import { FirebaseService } from '../../services/firebaseService';
import { useAuth } from '../../hooks/useAuth';
import { generatePDF } from '../../utils/pdfGenerator';

const WorksheetGenerator: React.FC = () => {
  const { user } = useAuth();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState('');
  const [subject, setSubject] = useState('math');
  const [grade, setGrade] = useState('3');
  const [language, setLanguage] = useState('english');
  const [isSaving, setIsSaving] = useState(false);

  const subjects = [
    { value: 'math', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
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

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी' },
    { value: 'kannada', label: 'ಕನ್ನಡ' },
    { value: 'marathi', label: 'मराठी' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateWorksheet = async () => {
    if (!uploadedImage) return;
    
    setIsGenerating(true);
    try {
      const result = await AIService.generateWorksheet({
        imageData: uploadedImage,
        subject,
        grade,
        language
      });
      setWorksheetContent(result);
    } catch (error) {
      console.error('Error generating worksheet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!worksheetContent || !user) return;
    
    setIsSaving(true);
    try {
      await FirebaseService.saveGeneratedContent({
        type: 'worksheet',
        title: `${subject} Worksheet - Grade ${grade}`,
        content: worksheetContent,
        subject,
        grade,
        language,
        teacherId: user.uid
      });
      alert('Worksheet saved successfully!');
    } catch (error) {
      console.error('Error saving worksheet:', error);
      alert('Error saving worksheet. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    generatePDF(worksheetContent, `Worksheet_${subject}_Grade_${grade}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Worksheet Generator</h1>
            <p className="text-gray-600">Create worksheets from textbook images</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Textbook Page</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {grades.map((gr) => (
                    <option key={gr.value} value={gr.value}>
                      {gr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded textbook page"
                    className="max-w-full h-48 object-contain mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600">Image uploaded successfully!</p>
                  <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all duration-200 inline-block">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600 mb-2">Upload a textbook page image</p>
                    <label className="cursor-pointer bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-200 inline-block">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, PDF
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleGenerateWorksheet}
              disabled={!uploadedImage || isGenerating}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Worksheet...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Worksheet</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Generated Worksheet</h2>
              <div className="flex items-center space-x-2">
                {worksheetContent && (
                  <>
                    <button
                      className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                      title="Edit"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                      title="Save Worksheet"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {worksheetContent ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-xl">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {worksheetContent}
                  </pre>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl hover:bg-green-200 transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-all duration-200">
                    <FileText className="w-4 h-4" />
                    <span>Save as Template</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your generated worksheet will appear here</p>
                  <p className="text-sm mt-2">Upload an image and click generate to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetGenerator;