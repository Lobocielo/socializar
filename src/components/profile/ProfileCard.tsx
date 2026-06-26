import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { User } from '../../types';
import PersonalityBadge from '../ai/PersonalityBadge';
import CompatibilityScore from '../match/CompatibilityScore';
import PremiumBadge from '../premium/PremiumBadge';

interface ProfileCardProps {
  user: User;
  compatibility?: number;
  showActions?: boolean;
  onLike?: () => void;
  onPass?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  compatibility = 0,
  showActions = false,
  onLike,
  onPass
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl"
    >
      <div className="relative h-80">
        <img
          src={user.photos[0] || user.photoURL}
          alt={user.displayName}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute top-4 right-4">
          {user.isPremium && <PremiumBadge size="sm" />}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {user.displayName}, {user.age}
              </h2>
              {user.location && user.location.latitude !== 0 && (
                <p className="text-white/80 flex items-center gap-1 mt-1">
                  <FiMapPin className="w-4 h-4" />
                  Cerca tuyo
                </p>
              )}
            </div>
            
            <CompatibilityScore score={compatibility} size="sm" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {user.personality && (
          <div className="mb-4">
            <PersonalityBadge personality={user.personality} />
          </div>
        )}
        
        {user.bio && (
          <p className="text-gray-600 mb-4">{user.bio}</p>
        )}
        
        <div className="flex flex-wrap gap-2">
          {user.interests.slice(0, 5).map((interest) => (
            <span
              key={interest}
              className="bg-pink-100 text-pink-600 text-sm px-3 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
          {user.interests.length > 5 && (
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
              +{user.interests.length - 5}
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPass}
              className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-500 hover:bg-red-200 transition-colors"
            >
              ✕
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-200 transition-colors"
            >
              <FiStar className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onLike}
              className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-500 hover:bg-green-200 transition-colors"
            >
              ❤️
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfileCard;
