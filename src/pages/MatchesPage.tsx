import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMessageCircle } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { getUserMatches } from '../services/matching';
import { getUserProfile } from '../services/auth';
import { User, Match } from '../types';
import AdBanner from '../components/ads/AdBanner';
import toast from 'react-hot-toast';

interface MatchWithUser extends Match {
  otherUser?: User;
}

const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const matches = useStore((state) => state.matches);
  const setMatches = useStore((state) => state.setMatches);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [matchesWithUsers, setMatchesWithUsers] = useState<MatchWithUser[]>([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userMatches = await getUserMatches(user.id);
      setMatches(userMatches);
      
      const matchesWithUserData = await Promise.all(
        userMatches.map(async (match) => {
          const otherUserId = match.users.find(id => id !== user.id);
          if (otherUserId) {
            const otherUser = await getUserProfile(otherUserId);
            return { ...match, otherUser };
          }
          return match;
        })
      );
      
      setMatchesWithUsers(matchesWithUserData);
    } catch (error) {
      toast.error('Error al cargar matches');
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matchesWithUsers.filter(match => {
    if (!searchQuery) return true;
    return match.otherUser?.displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const handleChatClick = (match: MatchWithUser) => {
    navigate(`/chat/${match.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold gradient-text mb-4">Tus Matches</h1>

        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar matches..."
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <AdBanner position="top" />
        </div>

        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {searchQuery ? 'Sin resultados' : 'Sin matches aún'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'No se encontraron matches con esa búsqueda'
                : 'Empezá a hacer swipe para conocer gente nueva'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/swipe')}
                className="bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors"
              >
                Descubrir gente
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleChatClick(match)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={match.otherUser?.photos[0] || match.otherUser?.photoURL || ''}
                        alt={match.otherUser?.displayName || ''}
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
                    {match.otherUser?.isPremium && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span className="text-xs">⭐</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {match.otherUser?.displayName}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {match.lastMessage?.timestamp
                          ? new Date(match.lastMessage.timestamp.seconds * 1000).toLocaleDateString()
                          : 'Nuevo match'}
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
                  
                  <FiMessageCircle className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <AdBanner position="between-profiles" />
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;
