import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import { useStore } from '../../store/useStore';
import { updateUserProfile } from '../../services/auth';
import toast from 'react-hot-toast';

interface BoostButtonProps {
  onBoost?: () => void;
}

const BoostButton: React.FC<BoostButtonProps> = ({ onBoost }) => {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [boosting, setBoosting] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const handleBoost = async () => {
    if (!user) return;
    
    if (cooldown) {
      toast('Boost en enfriamiento', { icon: '⏰' });
      return;
    }

    if (!user.isPremium && user.boostCount <= 0) {
      toast('Upgrade a Premium para Boosts', { icon: '⭐' });
      return;
    }

    setBoosting(true);
    try {
      const newBoostCount = user.isPremium ? user.boostCount : user.boostCount - 1;
      
      await updateUserProfile(user.id, { 
        boostCount: newBoostCount,
        lastBoosted: new Date()
      });
      
      setUser({ ...user, boostCount: newBoostCount });
      
      toast.success('¡Boost activado! Tu perfil será visible por 30 minutos');
      
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30 * 60 * 1000);
      
      onBoost?.();
    } catch (error) {
      toast.error('Error al activar boost');
    } finally {
      setBoosting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBoost}
      disabled={boosting || cooldown}
      className={`relative overflow-hidden px-4 py-2 rounded-xl font-semibold transition-all ${
        cooldown
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
      }`}
    >
      {boosting && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
      
      <div className="flex items-center gap-2">
        <FiZap className={`w-5 h-5 ${cooldown ? '' : 'text-yellow-300'}`} />
        <span>{cooldown ? 'Cooldown...' : 'Boost'}</span>
      </div>
      
      {!user?.isPremium && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
          {user?.boostCount || 0}
        </span>
      )}
    </motion.button>
  );
};

export default BoostButton;
