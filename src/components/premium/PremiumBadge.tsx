import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

interface PremiumBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold shadow-lg ${sizeClasses[size]}`}
    >
      <FiStar className={iconSizes[size]} />
      {showText && <span>Premium</span>}
    </motion.div>
  );
};

export default PremiumBadge;
