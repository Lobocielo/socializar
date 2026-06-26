import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { shouldShowAd, trackAdImpression, loadAdScript } from '../../services/ads';

interface AdBannerProps {
  position: 'top' | 'between-profiles' | 'sidebar' | 'chat';
}

const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  const user = useStore((state) => state.user);
  const isPremium = useStore((state) => state.isPremium);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || isPremium) return;
    
    loadAdScript('adsense');
    
    const timer = setTimeout(() => {
      if (adRef.current && shouldShowAd(user.id, position)) {
        trackAdImpression(`adsense-${position}`, user.id);
        
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (e) {
          console.log('AdSense not loaded');
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isPremium, position]);

  if (!user || isPremium) {
    return null;
  }

  return (
    <div className="ad-container rounded-xl overflow-hidden" ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXX"
        data-ad-slot="XXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      
      <div className="w-full bg-gray-100 rounded-xl p-3 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-1">Publicidad</p>
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              🌟 Descubrí Socializar Premium 🌟
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Likes ilimitados y más features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBanner;
