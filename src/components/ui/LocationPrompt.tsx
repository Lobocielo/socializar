import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiX } from 'react-icons/fi';

interface LocationPromptProps {
  onAllow: () => void;
  onDeny: () => void;
}

const LocationPrompt: React.FC<LocationPromptProps> = ({ onAllow, onDeny }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMapPin className="w-8 h-8 text-pink-500" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            ¿Podemos usar tu ubicación?
          </h2>
          
          <p className="text-gray-600 mb-6">
            Necesitamos tu ubicación para mostrarte personas cerca tuyo. 
            Tu ubicación exacta no será visible para otros usuarios.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onDeny}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Ahora no
            </button>
            
            <button
              onClick={onAllow}
              className="flex-1 bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
            >
              Permitir
            </button>
          </div>
          
          <button
            onClick={onDeny}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LocationPrompt;
