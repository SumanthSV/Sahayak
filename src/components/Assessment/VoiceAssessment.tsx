import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Save, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { FirebaseService } from '../../services/firebaseService';

interface AssessmentResult {
  accuracy: number;
  fluency: number;
  pronunciation: number;
  overallScore: number;
  feedback: string;
}

const VoiceAssessment: React.FC = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [assessmentText, setAssessmentText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('3');
  const [selectedLanguage, setSelectedLanguage] = useState('hindi');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const grades = [
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
  ];

  const languages = [
    { value: 'hindi', label: 'हिंदी' },
    { value: 'english', label: 'English' },
    { value: 'kannada', label: 'ಕನ್ನಡ' },
    { value: 'marathi', label: 'मराठी' },
  ];

  const sampleTexts = {
    hindi: [
      'राम एक अच्छा लड़का है। वह रोज स्कूल जाता है।',
      'सूरज पूर्व में उगता है और पश्चिम में डूबता है।',
      'हमें अपने माता-पिता का सम्मान करना चाहिए।'
    ],
    english: [
      'The cat sat on the mat. It was a sunny day.',
      'Birds fly high in the blue sky.',
      'We should always help our friends.'
    ],
    kannada: [
      'ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ। ನನಗೆ ಓದುವುದು ಇಷ್ಟ.',
      'ಸೂರ್ಯ ಪೂರ್ವದಲ್ಲಿ ಉದಯಿಸುತ್ತಾನೆ.',
    ],
    marathi: [
      'मी शाळेत जातो। मला वाचायला आवडते.',
      'सूर्य पूर्वेला उगवतो आणि पश्चिमेला मावळतो.',
    ]
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (recordedAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const resetRecording = () => {
    setRecordedAudio(null);
    setIsPlaying(false);
    setAssessmentResult(null);
  };

  const assessReading = async () => {
    if (!recordedAudio || !assessmentText) return;
    
    setIsAssessing(true);
    
    // Simulate AI assessment (in real implementation, this would call speech recognition API)
    setTimeout(() => {
      const mockResult: AssessmentResult = {
        accuracy: Math.floor(Math.random() * 20) + 80, // 80-100%
        fluency: Math.floor(Math.random() * 25) + 75,  // 75-100%
        pronunciation: Math.floor(Math.random() * 30) + 70, // 70-100%
        overallScore: 0,
        feedback: ''
      };
      
      mockResult.overallScore = Math.round((mockResult.accuracy + mockResult.fluency + mockResult.pronunciation) / 3);
      
      if (mockResult.overallScore >= 90) {
        mockResult.feedback = 'Excellent reading! Your pronunciation and fluency are very good. Keep up the great work!';
      } else if (mockResult.overallScore >= 75) {
        mockResult.feedback = 'Good reading! Focus on pronunciation of difficult words. Practice reading aloud daily.';
      } else {
        mockResult.feedback = 'Keep practicing! Try reading slowly and clearly. Focus on each word pronunciation.';
      }
      
      setAssessmentResult(mockResult);
      setIsAssessing(false);
    }, 3000);
  };

  const saveAssessment = async () => {
    if (!assessmentResult || !user) return;
    
    try {
      await FirebaseService.saveGeneratedContent({
        type: 'assessment' as any,
        title: `Reading Assessment - ${selectedLanguage} - Grade ${selectedGrade}`,
        content: JSON.stringify({
          text: assessmentText,
          result: assessmentResult,
          date: new Date().toISOString()
        }),
        subject: 'reading',
        grade: selectedGrade,
        language: selectedLanguage,
        teacherId: user.uid
      });
      alert('Assessment saved successfully!');
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Voice Assessment</h1>
            <p className="text-gray-600">Assess students' reading skills with AI-powered voice analysis</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Assessment Setup</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {grades.map((grade) => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Text
              </label>
              <textarea
                value={assessmentText}
                onChange={(e) => setAssessmentText(e.target.value)}
                placeholder="Enter the text for students to read..."
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-3">Sample texts for {selectedLanguage}:</p>
              <div className="space-y-2">
                {(sampleTexts[selectedLanguage as keyof typeof sampleTexts] || []).map((text, index) => (
                  <button
                    key={index}
                    onClick={() => setAssessmentText(text)}
                    className="text-left text-sm text-red-600 hover:text-red-700 hover:underline block w-full p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recording Controls */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Voice Recording</h2>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!assessmentText.trim()}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              {recordedAudio && (
                <>
                  <button
                    onClick={playRecording}
                    className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-all duration-200"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>

                  <button
                    onClick={resetRecording}
                    className="w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center transition-all duration-200"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                {isRecording ? 'Recording... Click the red button to stop' : 
                 recordedAudio ? 'Recording complete! Click play to listen' : 
                 'Click the green button to start recording'}
              </p>
            </div>

            {recordedAudio && (
              <div className="space-y-4">
                <audio
                  ref={audioRef}
                  src={recordedAudio}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                
                <button
                  onClick={assessReading}
                  disabled={isAssessing}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {isAssessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-5 h-5" />
                      <span>Assess Reading</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Assessment Results</h2>
              {assessmentResult && (
                <button
                  onClick={saveAssessment}
                  className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                  title="Save Assessment"
                >
                  <Save className="w-5 h-5" />
                </button>
              )}
            </div>

            {assessmentResult ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">Accuracy</p>
                    <p className="text-2xl font-bold text-blue-700">{assessmentResult.accuracy}%</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600 font-medium">Fluency</p>
                    <p className="text-2xl font-bold text-green-700">{assessmentResult.fluency}%</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-600 font-medium">Pronunciation</p>
                    <p className="text-2xl font-bold text-purple-700">{assessmentResult.pronunciation}%</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium">Overall Score</p>
                    <p className="text-2xl font-bold text-orange-700">{assessmentResult.overallScore}%</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border-l-4 border-red-500">
                  <h3 className="font-semibold text-gray-800 mb-2">Feedback & Recommendations</h3>
                  <p className="text-gray-700 leading-relaxed">{assessmentResult.feedback}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-medium text-gray-800 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Practice reading aloud for 10 minutes daily</li>
                    <li>• Focus on difficult words and their pronunciation</li>
                    <li>• Record yourself reading and listen back</li>
                    <li>• Ask for help with unfamiliar words</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Assessment results will appear here</p>
                  <p className="text-sm mt-2">Record audio and click assess to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssessment;