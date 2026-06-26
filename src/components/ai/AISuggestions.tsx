import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiX } from 'react-icons/fi';

interface AISuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  onClose: () => void;
  loading?: boolean;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({
  suggestions,
  onSelect,
  onClose,
  loading = false
}) => {
  return (
    <AnimatePresence>
      {(suggestions.length > 0 || loading) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-3 border border-green-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <FiCpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-green-800">Sugerencias de IA</span>
            </div>
            <button
              onClick={onClose}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Analizando conversación...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelect(suggestion)}
                  className="w-full text-left p-3 bg-white rounded-xl hover:bg-green-50 transition-colors text-gray-700 text-sm shadow-sm"
                >
                  <span className="text-green-500 mr-2">💬</span>
                  {suggestion}
                </motion.button>
              ))}
            </div>
          )}

          <div className="mt-3 text-center">
            <p className="text-xs text-green-600/70">
              La IA analiza el contexto para darte mejores respuestas
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AISuggestions;
