import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPremium?: boolean;
  isOnline?: boolean;
  showStatus?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name,
  size = 'md',
  isPremium = false,
  isOnline = false,
  showStatus = true
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-28 h-28 text-3xl'
  };

  const getInitials = () => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getGradient = () => {
    const gradients = [
      'from-pink-400 to-purple-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-yellow-400 to-orange-500',
      'from-red-400 to-pink-500'
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient()} flex items-center justify-center text-white font-bold`}>
            {getInitials()}
          </div>
        )}
      </div>
      
      {isPremium && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
          <FiStar className="w-3 h-3 text-yellow-800" />
        </div>
      )}
      
      {showStatus && isOnline && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}
    </div>
  );
};

export default UserAvatar;
