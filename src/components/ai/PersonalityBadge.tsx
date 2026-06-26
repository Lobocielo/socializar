import React from 'react';
import { motion } from 'framer-motion';
import { PersonalityType } from '../../types';

interface PersonalityBadgeProps {
  personality: PersonalityType;
  size?: 'sm' | 'md' | 'lg';
}

const PersonalityBadge: React.FC<PersonalityBadgeProps> = ({ personality, size = 'md' }) => {
  const getIcon = () => {
    switch (personality.type) {
      case 'timido':
        return '🤫';
      case 'directo':
        return '💪';
      case 'divertido':
        return '😄';
      case 'serio':
        return '🧐';
      case 'aventurero':
        return '🌍';
      default:
        return '✨';
    }
  };

  const getLabel = () => {
    switch (personality.type) {
      case 'timido':
        return 'Tímido';
      case 'directo':
        return 'Directo';
      case 'divertido':
        return 'Divertido';
      case 'serio':
        return 'Serio';
      case 'aventurero':
        return 'Aventurero';
      default:
        return 'Único';
    }
  };

  const getColor = () => {
    switch (personality.type) {
      case 'timido':
        return 'bg-blue-100 text-blue-700';
      case 'directo':
        return 'bg-red-100 text-red-700';
      case 'divertido':
        return 'bg-yellow-100 text-yellow-700';
      case 'serio':
        return 'bg-gray-100 text-gray-700';
      case 'aventurero':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-pink-100 text-pink-700';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${getColor()} ${sizeClasses[size]}`}
    >
      <span>{getIcon()}</span>
      <span>{getLabel()}</span>
      {size !== 'sm' && (
        <span className="opacity-70 ml-1">
          {personality.score}%
        </span>
      )}
    </motion.div>
  );
};

export default PersonalityBadge;
