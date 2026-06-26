import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiEdit2, 
  FiSettings, 
  FiLogOut, 
  FiShield,
  FiHelpCircle,
  FiStar,
  FiMapPin,
  FiTarget
} from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { logout, updateUserProfile } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const isPremium = useStore((state) => state.isPremium);
  const maxDistance = useStore((state) => state.maxDistance);
  const setMaxDistance = useStore((state) => state.setMaxDistance);
  const ageRange = useStore((state) => state.ageRange);
  const setAgeRange = useStore((state) => state.setAgeRange);
  
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.id, { displayName: name, bio });
      setUser({ ...user, displayName: name, bio });
      setEditing(false);
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleMaxDistanceChange = async (value: number) => {
    setMaxDistance(value);
    if (user) {
      await updateUserProfile(user.id, { maxDistance: value } as any);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold gradient-text">Mi Perfil</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="text-pink-500 hover:text-pink-600"
          >
            <FiEdit2 className="w-6 h-6" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                <img
                  src={user.photos[0] || user.photoURL}
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              {isPremium && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                  <FiStar className="w-4 h-4 text-yellow-800" />
                </div>
              )}
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              ) : (
                <h2 className="text-xl font-bold text-gray-800">{user.displayName}</h2>
              )}
              <p className="text-gray-500">{user.age} años</p>
              {user.personality && (
                <span className="inline-block bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full mt-1">
                  {user.personality.type === 'timido' && '🤫 Tímido'}
                  {user.personality.type === 'directo' && '💪 Directo'}
                  {user.personality.type === 'divertido' && '😄 Divertido'}
                  {user.personality.type === 'serio' && '🧐 Serio'}
                  {user.personality.type === 'aventurero' && '🌍 Aventurero'}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
              />
            ) : (
              <p className="text-gray-600">{user.bio || 'Sin bio'}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intereses ({user.interests.length})
            </label>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-pink-100 text-pink-600 text-sm px-3 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-6"
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiSettings className="w-5 h-5" />
            Configuración
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" />
                  Distancia máxima
                </label>
                <span className="text-sm font-medium text-pink-500">{maxDistance}km</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={maxDistance}
                onChange={(e) => handleMaxDistanceChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600 flex items-center gap-2">
                  <FiTarget className="w-4 h-4" />
                  Rango de edad
                </label>
                <span className="text-sm font-medium text-pink-500">
                  {ageRange[0]} - {ageRange[1]} años
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="range"
                  min="18"
                  max="60"
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([parseInt(e.target.value), ageRange[1]])}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <input
                  type="range"
                  min="18"
                  max="80"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm mb-6"
        >
          <h3 className="font-semibold text-gray-800 mb-4">Menú</h3>
          
          <div className="space-y-2">
            <button
              onClick={() => navigate('/premium')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
            >
              <FiStar className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Socializar Premium</span>
              {isPremium && (
                <span className="ml-auto premium-badge">Activo</span>
              )}
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
              <FiShield className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700">Centro de seguridad</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
              <FiHelpCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-700">Ayuda</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-red-50 rounded-xl transition-colors text-red-500"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </motion.div>

        <div className="text-center text-gray-400 text-sm pb-4">
          <p>Socializar v1.0.0</p>
          <p className="mt-1">Hecho con 💕</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
