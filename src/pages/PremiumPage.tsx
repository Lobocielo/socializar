import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiX, FiZap, FiEye, FiMessageCircle, FiShield } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { updateUserProfile } from '../services/auth';
import { PREMIUM_PLANS } from '../services/ads';
import toast from 'react-hot-toast';

const PremiumPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const isPremium = useStore((state) => state.isPremium);
  const setIsPremium = useStore((state) => state.setIsPremium);
  
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateUserProfile(user.id, { isPremium: true });
      setUser({ ...user, isPremium: true });
      setIsPremium(true);
      
      toast.success('¡Ahora sos Premium! 🎉');
      navigate('/swipe');
    } catch (error) {
      toast.error('Error al procesar compra');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FiZap className="w-5 h-5" />,
      title: 'Boost de perfil',
      description: 'Aparecé primero en la búsqueda'
    },
    {
      icon: <FiEye className="w-5 h-5" />,
      title: 'Vio quién te vio',
      description: 'Descubrí quién te miró'
    },
    {
      icon: <FiMessageCircle className="w-5 h-5" />,
      title: 'Chat con IA',
      description: 'Recibí sugerencias para responder'
    },
    {
      icon: <FiShield className="w-5 h-5" />,
      title: 'Sin anuncios',
      description: 'Experiencia limpia'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500">
      <div className="max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            ⭐
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Socializar Premium</h1>
          <p className="text-white/80">Desbloqueá todo el potencial</p>
        </motion.div>

        {isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6 text-center"
          >
            <p className="text-white font-semibold">
              🎉 Ya sos Premium
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-2xl mb-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">¿Qué incluye?</h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          {PREMIUM_PLANS.filter(p => p.id !== 'basic').map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`bg-white rounded-2xl p-4 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-pink-500 shadow-lg'
                  : 'shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? 'border-pink-500 bg-pink-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedPlan === plan.id && (
                      <FiCheck className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                    <p className="text-sm text-gray-500">
                      {plan.features.length} features incluidos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-800">${plan.price}</p>
                  <p className="text-xs text-gray-500">/mes</p>
                </div>
              </div>
              
              {plan.id === 'gold' && (
                <div className="mt-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-3">
                  <p className="text-sm text-orange-700 font-medium">
                    🏆 Más popular entre usuarios activos
                  </p>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold text-white mb-3">
            Features del {PREMIUM_PLANS.find(p => p.id === selectedPlan)?.name}:
          </h3>
          <ul className="space-y-2">
            {PREMIUM_PLANS.find(p => p.id === selectedPlan)?.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-white/90">
                <FiCheck className="w-4 h-4 text-green-400" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handlePurchase}
          disabled={loading || isPremium}
          className="w-full bg-white text-orange-500 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              Procesando...
            </div>
          ) : isPremium ? (
            'Ya sos Premium ✨'
          ) : (
            `Obtener ${PREMIUM_PLANS.find(p => p.id === selectedPlan)?.name} - $${PREMIUM_PLANS.find(p => p.id === selectedPlan)?.price}/mes`
          )}
        </motion.button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-4 text-white/80 py-3 font-medium hover:text-white transition-colors"
        >
          Volver
        </button>

        <div className="mt-8 text-center text-white/60 text-xs">
          <p>Cancelá cuando quieras</p>
          <p className="mt-1">Pago seguro through Mercado Pago</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
