import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '../services/auth';
import { getCurrentLocation } from '../services/location';
import { useStore } from '../store/useStore';
import { initDatabase } from '../services/turso';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await initDatabase();

      const user = await signInWithGoogle();
      if (user) {
        try {
          const location = await getCurrentLocation();
          user.location = location;
          useStore.getState().setLocationEnabled(true);
        } catch {
          toast('No se pudo obtener ubicación', { icon: '📍' });
        }

        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));

        toast.success('¡Bienvenido a Socializar!');

        if (!user.bio || user.interests.length === 0) {
          navigate('/setup');
        } else {
          navigate('/swipe');
        }
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            💕
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Socializar</h1>
          <p className="text-white/80 text-lg">Conocé gente nueva cerca tuyo</p>
        </div>

        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            ¡Empezá ahora!
          </h2>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl py-4 px-6 font-semibold hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="text-2xl">👤</span>
                Iniciar Sesión
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Ingresá tu email y nombre para empezar
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">🔍</div>
              <p className="text-xs text-gray-500">Encontrá gente</p>
            </div>
            <div>
              <div className="text-2xl mb-1">💬</div>
              <p className="text-xs text-gray-500">Chateá</p>
            </div>
            <div>
              <div className="text-2xl mb-1">❤️</div>
              <p className="text-xs text-gray-500">Conectá</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            ¿Ya tenés cuenta? Iniciá sesión
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
