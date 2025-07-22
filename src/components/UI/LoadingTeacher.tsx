import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Sparkles } from 'lucide-react';

interface LoadingTeacherProps {
  message?: string;
  isVisible: boolean;
}

export const LoadingTeacher: React.FC<LoadingTeacherProps> = ({ 
  message = "Generating your teaching content... Please wait ⏳", 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-72 text-center">
        {/* Orbiting Particles Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 animate-spin">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-pink-500 rounded-full transform -translate-x-1/2"></div>
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "2s" }}
            >
              <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-purple-400 rounded-full transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-pink-400 rounded-full transform -translate-y-1/2"></div>
            </div>
            <div className="absolute inset-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-30"></div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{message}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">Making Teaching easy...</p>
      </div>
    </div>
  )
};