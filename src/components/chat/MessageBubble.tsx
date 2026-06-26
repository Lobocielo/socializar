import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiCheck, FiCheckCheck } from 'react-icons/fi';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showTimestamp = true
}) => {
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {message.isAI && (
          <div className={`flex items-center gap-1 text-xs text-green-600 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <FiCpu className="w-3 h-3" />
            <span>Sugerencia de IA</span>
          </div>
        )}
        
        <div
          className={`px-4 py-3 rounded-2xl ${
            isOwn
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {showTimestamp && (
          <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-xs text-gray-400">
              {formatTime(message.timestamp)}
            </span>
            {isOwn && (
              message.read ? (
                <FiCheckCheck className="w-3 h-3 text-blue-500" />
              ) : (
                <FiCheck className="w-3 h-3 text-gray-400" />
              )
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
