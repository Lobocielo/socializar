import React from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

interface AdBannerProps {
  position: 'top' | 'between-profiles' | 'sidebar' | 'chat';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const user = useStore((state) => state.user);
  const isPremium = useStore((state) => state.isPremium);
  const navigate = useNavigate();

  if (!user || isPremium) {
    return null;
  }

  const promos = [
    {
      title: '🌟 Socializar Premium',
      subtitle: 'Likes ilimitados y más features',
      cta: 'Descubrir',
      color: 'from-pink-500 to-purple-500'
    },
    {
      title: '⚡ Boost tu perfil',
      subtitle: 'Que te vean más personas',
      cta: 'Activar',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: '🤖 Chat con IA',
      subtitle: 'Nunca te quedes sin respuesta',
      cta: 'Probar',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const promo = promos[Math.floor(Math.random() * promos.length)];

  return (
    <div className={`bg-gradient-to-r ${promo.color} rounded-xl p-4 cursor-pointer`}
         onClick={() => navigate('/premium')}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-sm">{promo.title}</h3>
          <p className="text-white/80 text-xs mt-0.5">{promo.subtitle}</p>
        </div>
        <button className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
          {promo.cta}
        </button>
      </div>
    </div>
  );
};

export default AdBanner;
