import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Calendar,
  Play,
  Download,
  Eye,
  Trash2,
  Plus,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { FirebaseService, GeneratedContent } from '../services/firebaseService';
import { Modal } from '../components/UI/Modal';
import { generatePDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [savedContent, setSavedContent] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadSavedContent();
  }, [user]);

  const loadSavedContent = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const content = await FirebaseService.getGeneratedContent(user.uid);
      setSavedContent(content);
    } catch (error) {
      console.error('Error loading saved content:', error);
      toast.error('Error loading saved content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewContent = (content: GeneratedContent) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await FirebaseService.deleteGeneratedContent(contentId);
      setSavedContent(prev => prev.filter(c => c.id !== contentId));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Error deleting content');
    }
  };

  const handleDownloadPDF = (content: GeneratedContent) => {
    generatePDF(content.content, `${content.type}_${content.title.replace(/\s+/g, '_')}`);
    toast.success('PDF downloaded successfully');
  };

  const handlePlayAudio = async (content: GeneratedContent) => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(content.content);
      utterance.lang = content.language === 'hindi' ? 'hi-IN' : 
                      content.language === 'kannada' ? 'kn-IN' :
                      content.language === 'marathi' ? 'mr-IN' : 'en-US';
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error('Error playing audio');
      };
      
      speechSynthesis.speak(utterance);
      toast.success('Playing audio');
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Error playing audio');
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'story': return BookOpen;
      case 'worksheet': return FileText;
      case 'visual-aid': return Eye;
      case 'concept-explanation': return BookOpen;
      default: return FileText;
    }
  };

  const getContentColor = (type: string) => {
    switch (type) {
      case 'story': return 'from-purple-500 to-pink-500';
      case 'worksheet': return 'from-blue-500 to-cyan-500';
      case 'visual-aid': return 'from-orange-500 to-red-500';
      case 'concept-explanation': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const stats = [
    {
      title: 'Stories Created',
      value: savedContent.filter(c => c.type === 'story').length,
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      title: 'Worksheets Generated',
      value: savedContent.filter(c => c.type === 'worksheet').length,
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      title: 'Visual Aids',
      value: savedContent.filter(c => c.type === 'visual-aid').length,
      icon: Eye,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      title: 'Total Content',
      value: savedContent.length,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome back, {user?.displayName || 'Teacher'}!
        </h1>
        <p className="text-gray-600">Here's your saved content and progress</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-xs md:text-sm font-medium">{stat.title}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Saved Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 p-4 md:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Saved Content</h2>
          <div className="text-sm text-gray-600">
            {savedContent.length} items • Available offline
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your content...</p>
          </div>
        ) : savedContent.length === 0 ? (
          <div className="text-center py-12">
            <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 mb-2">No content saved yet</p>
            <p className="text-sm text-gray-500">Start creating stories, worksheets, and more!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedContent.map((content, index) => {
              const Icon = getContentIcon(content.type);
              const colorClass = getContentColor(content.type);
              
              return (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewContent(content)}
                        className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePlayAudio(content)}
                        className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all duration-200"
                        title="Play Audio"
                      >
                        {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDownloadPDF(content)}
                        className="p-1.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteContent(content.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 text-sm">
                    {content.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{content.type.replace('-', ' ')}</span>
                    <span>{content.createdAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      Grade {content.grade}
                    </span>
                    <span className="bg-blue-100 px-2 py-1 rounded-full text-blue-600 capitalize">
                      {content.language}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Content Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedContent?.title || ''}
        size="lg"
      >
        {selectedContent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600 capitalize">
                  {selectedContent.type.replace('-', ' ')}
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-600">
                  Grade {selectedContent.grade}
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full text-sm text-green-600 capitalize">
                  {selectedContent.language}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlayAudio(selectedContent)}
                  className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 transition-all duration-200"
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlaying ? 'Stop' : 'Play'}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownloadPDF(selectedContent)}
                  className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </motion.button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                {selectedContent.content}
              </pre>
            </div>
            
            <div className="text-xs text-gray-500 text-center">
              Created on {selectedContent.createdAt.toLocaleDateString()} at {selectedContent.createdAt.toLocaleTimeString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;