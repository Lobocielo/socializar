import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity 
          }}
          className="text-6xl mb-4"
        >
          💕
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">Socializar</h1>
        <p className="text-white/80">Conocé gente nueva</p>
        <div className="mt-8">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
