import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiHeart, FiX, FiStar, FiMapPin, FiZap } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { getPotentialMatches, swipeUser } from '../services/matching';
import { getCurrentLocation } from '../services/location';
import { shouldShowAd } from '../services/ads';
import AdBanner from '../components/ads/AdBanner';
import MatchModal from '../components/match/MatchModal';
import toast from 'react-hot-toast';
import { User, Match } from '../types';

const SwipePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const potentialMatches = useStore((state) => state.potentialMatches);
  const setPotentialMatches = useStore((state) => state.setPotentialMatches);
  const currentMatchIndex = useStore((state) => state.currentMatchIndex);
  const setCurrentMatchIndex = useStore((state) => state.setCurrentMatchIndex);
  const maxDistance = useStore((state) => state.maxDistance);
  
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [showAd, setShowAd] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const loadPotentialMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (user.location.latitude === 0) {
        try {
          const location = await getCurrentLocation();
          useStore.getState().setLocationEnabled(true);
        } catch {
          toast('No se pudo obtener ubicación', { icon: '📍' });
        }
      }
      
      const matches = await getPotentialMatches(user, maxDistance);
      setPotentialMatches(matches);
    } catch (error) {
      toast.error('Error al cargar perfiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (liked: boolean) => {
    if (!user || currentMatchIndex >= potentialMatches.length) return;
    
    const targetUser = potentialMatches[currentMatchIndex];
    
    if (!user.isPremium) {
      const dailyLikes = parseInt(localStorage.getItem(`likes_${user.id}`) || '0');
      if (dailyLikes >= 10) {
        toast.error('Límite diario de likes alcanzado. Upgrade a Premium!');
        navigate('/premium');
        return;
      }
      localStorage.setItem(`likes_${user.id}`, (dailyLikes + 1).toString());
    }
    
    try {
      const match = await swipeUser(user.id, targetUser.id, liked);
      
      if (match) {
        setMatchedUser(targetUser);
        setCurrentMatch(match);
        setShowMatch(true);
      }
      
      setCurrentMatchIndex(currentMatchIndex + 1);
      
      if (liked) {
        toast('¡Like!', { icon: '❤️' });
      }
      
      if (shouldShowAd(user.id, 'between-profiles') && !user.isPremium) {
        setShowAd(true);
        setTimeout(() => setShowAd(false), 3000);
      }
    } catch (error) {
      toast.error('Error al procesar');
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) {
      handleSwipe(true);
    } else if (info.offset.x < -100) {
      handleSwipe(false);
    }
  };

  const currentUser = potentialMatches[currentMatchIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando personas cerca...</p>
        </div>
      </div>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin resultados</h2>
          <p className="text-gray-600 mb-6">
            No hay personas cerca tuyo. Intentá ampliar la distancia o volvé más tarde.
          </p>
          <button
            onClick={loadPotentialMatches}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Buscar de nuevo
          </button>
        </div>
      </div>
    );
  }

  if (currentMatchIndex >= potentialMatches.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Viste todos!</h2>
          <p className="text-gray-600 mb-6">
            Ya viste todos los perfiles disponibles. Volvé más tarde para ver nuevos.
          </p>
          <button
            onClick={() => {
              setCurrentMatchIndex(0);
              loadPotentialMatches();
            }}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
          >
            Recargar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold gradient-text">Socializar</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiMapPin className="w-4 h-4" />
            <span>{maxDistance}km</span>
          </div>
        </div>

        {showAd && (
          <div className="mb-4">
            <AdBanner position="between-profiles" />
          </div>
        )}

        <div className="relative h-[60vh] mb-4">
          <AnimatePresence>
            {currentUser && (
              <motion.div
                key={currentUser.id}
                style={{ x, rotate }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="absolute w-full h-full"
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={currentUser.photos[0] || currentUser.photoURL}
                    alt={currentUser.displayName}
                    className="w-full h-full object-cover"
                  />
                  
                  <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute inset-0 bg-green-500/30 flex items-center justify-center"
                  >
                    <span className="text-6xl font-bold text-white rotate-[-20deg] border-4 border-white px-4 py-2 rounded-xl">
                      LIKE
                    </span>
                  </motion.div>
                  
                  <motion.div
                    style={{ opacity: passOpacity }}
                    className="absolute inset-0 bg-red-500/30 flex items-center justify-center"
                  >
                    <span className="text-6xl font-bold text-white rotate-[20deg] border-4 border-white px-4 py-2 rounded-xl">
                      NOPE
                    </span>
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white">
                          {currentUser.displayName}, {currentUser.age}
                        </h2>
                        {currentUser.location && currentUser.location.latitude !== 0 && (
                          <p className="text-white/80 flex items-center gap-1 mt-1">
                            <FiMapPin className="w-4 h-4" />
                            Cerca tuyo
                          </p>
                        )}
                      </div>
                      {currentUser.isPremium && (
                        <span className="premium-badge">⭐ Premium</span>
                      )}
                    </div>
                    
                    {currentUser.bio && (
                      <p className="text-white/90 mt-2 line-clamp-2">{currentUser.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentUser.interests.slice(0, 4).map((interest) => (
                        <span
                          key={interest}
                          className="bg-white/20 text-white text-xs px-3 py-1 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                      {currentUser.interests.length > 4 && (
                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                          +{currentUser.interests.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe(false)}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
          >
            <FiX className="w-8 h-8" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (!user?.isPremium) {
                toast('Upgrade a Premium para Super Like', { icon: '⭐' });
                navigate('/premium');
              } else {
                handleSwipe(true);
              }
            }}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FiStar className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSwipe(true)}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:from-pink-600 hover:to-red-600 transition-all"
          >
            <FiHeart className="w-8 h-8" />
          </motion.button>
        </div>

        {!user?.isPremium && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Likes hoy: {parseInt(localStorage.getItem(`likes_${user?.id}`) || '0')}/10
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showMatch && matchedUser && currentMatch && (
          <MatchModal
            matchedUser={matchedUser}
            match={currentMatch}
            onClose={() => setShowMatch(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipePage;
