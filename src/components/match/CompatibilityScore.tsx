import React from 'react';
import { motion } from 'framer-motion';

interface CompatibilityScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const CompatibilityScore: React.FC<CompatibilityScoreProps> = ({
  score,
  size = 'md',
  showLabel = true
}) => {
  const getColor = () => {
    if (score >= 80) return { stroke: '#10b981', bg: 'bg-green-100', text: 'text-green-700' };
    if (score >= 60) return { stroke: '#f59e0b', bg: 'bg-yellow-100', text: 'text-yellow-700' };
    if (score >= 40) return { stroke: '#f97316', bg: 'bg-orange-100', text: 'text-orange-700' };
    return { stroke: '#ef4444', bg: 'bg-red-100', text: 'text-red-700' };
  };

  const colors = getColor();
  
  const sizeConfig = {
    sm: { width: 40, strokeWidth: 4, fontSize: 10, radius: 16 },
    md: { width: 60, strokeWidth: 5, fontSize: 14, radius: 24 },
    lg: { width: 80, strokeWidth: 6, fontSize: 18, radius: 32 }
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: config.width, height: config.width }}>
        <svg
          width={config.width}
          height={config.width}
          className="transform -rotate-90"
        >
          <circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={config.radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={config.strokeWidth}
          />
          <motion.circle
            cx={config.width / 2}
            cy={config.width / 2}
            r={config.radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`font-bold ${colors.text}`}
            style={{ fontSize: config.fontSize }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      
      {showLabel && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className={`mt-2 text-sm font-medium ${colors.text}`}
        >
          Compatible
        </motion.p>
      )}
    </div>
  );
};

export default CompatibilityScore;
