import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Logo2 from '../../assets/Logo2.png'
import { 

  FileText, 
  GraduationCap,
  CalendarCheck,
  Zap,
  	BookOpenText,
    LayoutDashboard,
  Mic, 
  Gamepad2,
  Sparkles,
  ChevronLeft,
  Menu,
  Text,
  ChevronRight,
  ImagePlus,
} from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import { AnimatedAvatar } from '../UI/AnimatedAvatar';
import toast from 'react-hot-toast';

interface ModernSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<ModernSidebarProps> = ({ isOpen, onToggle, isMobile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard,icolor:"text-blue-500", label: t('dashboard'), path: '/dashboard' },
    { id: 'stories', icon: 	BookOpenText,icolor:"text-pink-500",  label: t('storyGenerator'), path: '/stories' },
    { id: 'worksheets', icon: FileText,icolor:"text-amber-500",  label: t('worksheetGenerator'), path: '/worksheets' },
    { id: 'concepts', icon: Zap,icolor:"text-yellow-500",  label: t('conceptExplainer'), path: '/concepts' },
    { id: 'visuals', icon: ImagePlus,icolor:"text-purple-500",  label: t('visualAids'), path: '/visuals' },
    { id: 'assessment', icon:Mic ,icolor:"text-rose-500",  label: t('voiceAssessment'), path: '/assessment' },
    { id: 'planner', icon: CalendarCheck,icolor:"text-green-500",  label: t('lessonPlanner'), path: '/planner' },
    { id: 'tracking', icon: GraduationCap,icolor:"text-cyan-500",  label: t('studentTracker'), path: '/tracking' },
    { id: 'games', icon: Gamepad2,icolor:"text-indigo-500",  label: 'Games', path: '/games',  },
  ];

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

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-80';

  return (
    <motion.div
      initial={isMobile ? { x: -320 } : { x: 0 }}
      animate={{ 
        x: isOpen ? 0 : (isMobile ? -320 : 0),
        width: isCollapsed ? 80 : 320
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        ${isMobile ? 'fixed' : 'sticky top-0 left-0'} 
        ${sidebarWidth} h-screen
        backdrop-blur-xl bg-white/90 dark:bg-zinc-950
        border-r border-gray-200/50 dark:border-gray-700/50 
        flex flex-col z-50 shadow-2xl
      `}
    >
      {/* Header */}
      <div className="p-[0.8rem] border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center space-x-3"
          >
            <div className={`   bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg`}>
              <img src={Logo2} className={`object-contain  ${isCollapsed ?"w-0 h-0" :"w-8 h-8"} `} alt="" />
            </div>
            {/* <AnimatePresence> */}
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <h1 className="text-md font-bold ">
                    Sahayak AI
                  </h1>
                  {/* <p className="text-xs text-gray-600 dark:text-gray-400">Teaching Assistant</p> */}
                </motion.div>
              )}
            {/* </AnimatePresence> */}
          </motion.div>
          
          {!isMobile && (
            <motion.button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className=" rounded-xl bg-gray-100 p-1 dark:bg-transparent hover:bg-gray-200 dark:hover:bg-zinc-900 transition-all duration-200"
            >
              {isCollapsed ? (
                <Menu className="w-5 h-5 -ml-7 text-gray-400 dark:text-gray-200" />
              ) : (
                <Text className="w-5 h-5 text-gray-400 dark:text-gray-200" />
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 ">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <NavLink
              to={item.path}
              onClick={() => isMobile && onToggle()}
              className={({ isActive }) =>
                `group flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-4 px-4'} py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? ' dark:border dark:border-zinc-500 text-purple-700 dark:text-white shadow-lg'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-800 dark:hover:text-gray-200'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              {({ isActive }) => (
                <>
                  {/* Animated background for active state */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0  rounded-2xl"
                      // transition={{ type: "spring", stiffness: 20, damping: 20 }}
                    />
                  )}
                  
                  {/* Avatar */}
                  <div className="relative z-10 flex-shrink-0">
                    {/* <AnimatedAvatar 
                      type={item.avatarType} 
                      size="md"
                      className={isActive ? 'shadow-lg shadow-purple-500/25' : ''}
                    /> */}
                    <item.icon className={`w-[1.1rem] h-[1.1rem] ${item.icolor} `} />
                  </div>
                  
                  {/* Label */}
                  {/* <AnimatePresence> */}
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium text-sm whitespace-nowrap overflow-hidden relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  {/* </AnimatePresence> */}
                  
                  {/* Active indicator */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full relative z-10"
                    />
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
      
        
        {/* <AnimatePresence> */}
          {!isCollapsed && (
            <div
              className="text-center text-xs text-gray-500 dark:text-gray-400 "
            >
              <p>Sahayak AI v4.0</p>
              <p>Empowering Teachers</p>
            </div>
          )}
        {/* </AnimatePresence> */}
      </div>
    </motion.div>
  );
};

export default Sidebar;