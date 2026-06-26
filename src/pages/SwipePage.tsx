import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { FiHeart, FiX, FiStar } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { getPotentialMatches, swipeUser } from '../services/matching';
import MatchModal from '../components/match/MatchModal';
import toast from 'react-hot-toast';
import { User, Match } from '../types';

const AVATAR_COLORS = [
  'from-pink-400 to-rose-500', 'from-purple-400 to-indigo-500',
  'from-blue-400 to-cyan-500', 'from-green-400 to-emerald-500',
  'from-yellow-400 to-orange-500', 'from-red-400 to-pink-500',
  'from-indigo-400 to-blue-500', 'from-teal-400 to-green-500',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const SwipePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const potentialMatches = useStore((state) => state.potentialMatches);
  const setPotentialMatches = useStore((state) => state.setPotentialMatches);
  const currentMatchIndex = useStore((state) => state.currentMatchIndex);
  const setCurrentMatchIndex = useStore((state) => state.setCurrentMatchIndex);
  const [loading, setLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, 0], [1, 0]);

  useEffect(() => { loadPotentialMatches(); }, []);

  const loadPotentialMatches = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const matches = await getPotentialMatches(user, 9999);
      setPotentialMatches(matches);
    } catch (error) {
      console.error(error);
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
        toast.error('Límite diario de likes. ¡Upgrade a Premium!');
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
      if (liked) toast('¡Like! ❤️');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x > 100) handleSwipe(true);
    else if (info.offset.x < -100) handleSwipe(false);
  };

  const currentUser = potentialMatches[currentMatchIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Buscando personas...</p>
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
          <p className="text-gray-600 mb-6">No hay perfiles disponibles ahora. Volvé más tarde.</p>
          <button onClick={loadPotentialMatches} className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
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
          <p className="text-gray-600 mb-6">Ya viste todos los perfiles. Volvé más tarde.</p>
          <button onClick={() => { setCurrentMatchIndex(0); loadPotentialMatches(); }}
            className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
            Recargar
          </button>
        </div>
      </div>
    );
  }

  const hasPhoto = currentUser?.photos?.length > 0 || currentUser?.photoURL;

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold gradient-text">Socializar</h1>
          <span className="text-sm text-gray-400">{currentMatchIndex + 1}/{potentialMatches.length}</span>
        </div>

        <div className="relative h-[60vh] mb-4">
          <AnimatePresence>
            {currentUser && (
              <motion.div key={currentUser.id} style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={handleDragEnd} className="absolute w-full h-full">
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                  {hasPhoto ? (
                    <img src={currentUser.photos?.[0] || currentUser.photoURL} alt={currentUser.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getAvatarColor(currentUser.displayName)} flex items-center justify-center`}>
                      <span className="text-white text-7xl font-bold">{getInitials(currentUser.displayName)}</span>
                    </div>
                  )}

                  <motion.div style={{ opacity: likeOpacity }} className="absolute inset-0 bg-green-500/30 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl font-bold text-white rotate-[-20deg] border-4 border-white px-6 py-2 rounded-2xl">LIKE</span>
                  </motion.div>
                  <motion.div style={{ opacity: passOpacity }} className="absolute inset-0 bg-red-500/30 flex items-center justify-center pointer-events-none">
                    <span className="text-5xl font-bold text-white rotate-[20deg] border-4 border-white px-6 py-2 rounded-2xl">NOPE</span>
                  </motion.div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-white">{currentUser.displayName}, {currentUser.age}</h2>
                        {currentUser.isPremium && <span className="premium-badge ml-2">⭐ Premium</span>}
                      </div>
                    </div>
                    {currentUser.bio && <p className="text-white/90 mt-2 line-clamp-2">{currentUser.bio}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {currentUser.interests.slice(0, 4).map(i => (
                        <span key={i} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">{i}</span>
                      ))}
                      {currentUser.interests.length > 4 && <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">+{currentUser.interests.length - 4}</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSwipe(false)}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
            <FiX className="w-8 h-8" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSwipe(true)}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors">
            <FiStar className="w-6 h-6" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleSwipe(true)}
            className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white hover:from-pink-600 hover:to-red-600 transition-all">
            <FiHeart className="w-8 h-8" />
          </motion.button>
        </div>

        {!user?.isPremium && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Likes hoy: {parseInt(localStorage.getItem(`likes_${user?.id}`) || '0')}/10</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showMatch && matchedUser && currentMatch && (
          <MatchModal matchedUser={matchedUser} match={currentMatch} onClose={() => setShowMatch(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SwipePage;
