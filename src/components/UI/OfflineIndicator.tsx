import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 z-50 shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="w-5 h-5" />
            <span className="font-medium">You're offline</span>
            <span className="text-sm opacity-90">• Limited functionality • Data will sync when connection is restored</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};