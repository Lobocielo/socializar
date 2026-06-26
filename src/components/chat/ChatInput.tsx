import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiCpu, FiImage, FiSmile } from 'react-icons/fi';

interface ChatInputProps {
  onSend: (message: string) => void;
  onAIRequest: () => void;
  loading?: boolean;
  isPremium?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onAIRequest,
  loading = false,
  isPremium = false
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 bg-white border-t border-gray-100">
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAIRequest}
        className={`p-3 rounded-xl transition-colors ${
          isPremium
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-100 text-gray-400'
        }`}
        title={isPremium ? 'Ayudame a responder' : 'Necesitás Premium'}
      >
        <FiCpu className="w-5 h-5" />
      </motion.button>

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribí un mensaje..."
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all pr-20"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiSmile className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiImage className="w-5 h-5" />
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!message.trim() || loading}
        className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <FiSend className="w-5 h-5" />
        )}
      </motion.button>
    </form>
  );
};

export default ChatInput;
