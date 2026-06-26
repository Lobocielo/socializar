import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import { User, Match } from '../../types';

interface MatchModalProps {
  matchedUser: User;
  match: Match;
  onClose: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ matchedUser, match, onClose }) => {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    onClose();
    navigate(`/chat/${match.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: '100vh',
                x: Math.random() * 100 - 50 + '%',
                rotate: 0
              }}
              animate={{ 
                y: '-100vh',
                rotate: 360
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute text-4xl"
            >
              {['✨', '💕', '🎉', '💖', '🌟'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            💕
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            ¡Es un Match!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 mb-6"
          >
            Vos y {matchedUser.displayName} se gustaron mutuamente
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="flex justify-center gap-4 mb-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white">
                <img
                  src={matchedUser.photos[0] || matchedUser.photoURL}
                  alt={matchedUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/90 mb-6"
          >
            {match.compatibility}% de compatibilidad
          </motion.p>

          <div className="flex gap-3">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              onClick={onClose}
              className="flex-1 bg-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              Seguir viendo
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              onClick={handleSendMessage}
              className="flex-1 bg-white text-pink-500 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiMessageCircle className="w-5 h-5" />
              Enviar mensaje
            </motion.button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default MatchModal;
