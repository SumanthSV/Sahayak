import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, User, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const { user } = useAuth();

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const languageRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (languageRef.current && !(languageRef.current as any).contains(e.target)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4 z-40 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-10 pr-4 py-2 bg-gray-100/50 border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <div className="relative z-[9999]" ref={languageRef}>
            <button
              onClick={() => setShowLanguageDropdown(prev => !prev)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100/50 hover:bg-gray-200/50 transition-all duration-200"
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {availableLanguages.find(lang => lang.code === currentLanguage)?.flag}
              </span>
            </button>
            {showLanguageDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-[9999]">
                {availableLanguages.map((language, idx) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      changeLanguage(language.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-all duration-200 flex items-center space-x-3 ${
                      currentLanguage === language.code
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700'
                    } ${idx === 0 ? 'rounded-t-xl' : ''} ${
                      idx === availableLanguages.length - 1 ? 'rounded-b-xl' : ''
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500">{language.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl bg-gray-100/50 hover:bg-gray-200/50 transition-all duration-200">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-800">
                {user?.displayName || 'Teacher'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email}
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
