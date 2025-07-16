import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3,
  BookOpen, 
  FileText, 
  HelpCircle, 
  Image, 
  Mic, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Sparkles,
  Menu,
  X,
  Accessibility
} from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import { AccessibilityControls } from '../UI/AccessibilityControls';
import toast from 'react-hot-toast';

interface ResponsiveSidebarProps {
  isMobile: boolean;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({ isMobile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: t('dashboard'), path: '/dashboard', color: 'text-gray-600' },
    { id: 'stories', icon: BookOpen, label: t('storyGenerator'), path: '/stories', color: 'text-purple-600' },
    { id: 'worksheets', icon: FileText, label: t('worksheetGenerator'), path: '/worksheets', color: 'text-blue-600' },
    { id: 'concepts', icon: HelpCircle, label: t('conceptExplainer'), path: '/concepts', color: 'text-green-600' },
    { id: 'visuals', icon: Image, label: t('visualAids'), path: '/visuals', color: 'text-orange-600' },
    { id: 'assessment', icon: Mic, label: t('voiceAssessment'), path: '/assessment', color: 'text-red-600' },
    { id: 'planner', icon: Calendar, label: t('lessonPlanner'), path: '/planner', color: 'text-indigo-600' },
    { id: 'tracking', icon: Users, label: t('studentTracker'), path: '/tracking', color: 'text-teal-600' },
  ];

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await FirebaseService.signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 touch-target p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      )}

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { x: -288 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -288 } : { x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`
              ${isMobile ? 'fixed' : 'fixed'} 
              left-0 top-0 h-screen w-72 
              glass-effect shadow-2xl border-r border-gray-200/50 
              flex flex-col z-50 overflow-hidden
            `}
          >
            {/* Logo */}
            <div className="p-6 border-b border-gray-200/50 flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Sahayak AI
                  </h1>
                  <p className="text-sm text-gray-600">Teaching Assistant</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollable-content">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group touch-target focus-ring ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md border border-purple-200/50'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <item.icon 
                            className={`w-5 h-5 ${
                              isActive ? 'text-purple-600' : item.color
                            } group-hover:scale-110 transition-transform duration-200`} 
                          />
                        </motion.div>
                        <span className="font-medium text-responsive-sm">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto w-2 h-2 bg-purple-500 rounded-full"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-200/50 space-y-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAccessibility(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200 touch-target focus-ring"
              >
                <Accessibility className="w-5 h-5" />
                <span className="font-medium text-responsive-sm">Accessibility</span>
              </motion.button>

              <NavLink
                to="/settings"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 touch-target focus-ring ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-responsive-sm">{t('settings')}</span>
              </NavLink>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 touch-target focus-ring"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-responsive-sm">{t('logout')}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Controls */}
      <AccessibilityControls 
        isOpen={showAccessibility}
        onClose={() => setShowAccessibility(false)}
      />
    </>
  );
};

export default ResponsiveSidebar;