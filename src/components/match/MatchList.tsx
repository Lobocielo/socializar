import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Match } from '../../types';

interface MatchListProps {
  matches: Match[];
  users: User[];
  currentUserId: string;
}

const MatchList: React.FC<MatchListProps> = ({ matches, users, currentUserId }) => {
  const navigate = useNavigate();

  const getOtherUser = (match: Match) => {
    const otherUserId = match.users.find(id => id !== currentUserId);
    return users.find(user => user.id === otherUserId);
  };

  return (
    <div className="space-y-3">
      {matches.map((match, index) => {
        const otherUser = getOtherUser(match);
        if (!otherUser) return null;

        return (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/chat/${match.id}`)}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={otherUser.photos[0] || otherUser.photoURL}
                    alt={otherUser.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {match.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {match.unreadCount}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {otherUser.displayName}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {match.lastMessage?.timestamp
                      ? new Date(match.lastMessage.timestamp.seconds * 1000).toLocaleDateString()
                      : 'Nuevo'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {match.lastMessage?.content || '¡Empezá a charlar! 💬'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-pink-500 font-medium">
                    {match.compatibility}% compatible
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MatchList;
