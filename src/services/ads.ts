import { AdConfig } from '../types';

export const AD_CONFIGS: AdConfig[] = [
  {
    id: 'adsense-top',
    type: 'banner',
    position: 'top',
    provider: 'adsense',
    code: '<!-- Google AdSense Banner Top -->',
    active: true
  },
  {
    id: 'adsense-between',
    type: 'banner',
    position: 'between-profiles',
    provider: 'adsense',
    code: '<!-- Google AdSense Between Profiles -->',
    active: true
  },
  {
    id: 'adsterra-sidebar',
    type: 'banner',
    position: 'sidebar',
    provider: 'adsterra',
    code: '<!-- Adsterra Sidebar -->',
    active: true
  },
  {
    id: 'adsense-chat',
    type: 'banner',
    position: 'chat',
    provider: 'adsense',
    code: '<!-- Google AdSense Chat -->',
    active: true
  }
];

export const PREMIUM_PLANS = [
  {
    id: 'basic',
    name: 'Básico',
    price: 0,
    features: [
      'Perfil básico',
      '10 likes por día',
      'Chat con matches',
      'Anuncios incluidos'
    ],
    duration: 0
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    features: [
      'Likes ilimitados',
      'Sin anuncios',
      '5 Boosts por mes',
      'Vió quién te vio',
      'Chat con IA',
      'Prioridad en búsqueda'
    ],
    duration: 30
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 19.99,
    features: [
      'Todo lo de Premium',
      '10 Boosts por mes',
      'Super Likes ilimitados',
      'Modo incógnito',
      'Prioridad máxima',
      'Soporte prioritario',
      'Exclusivo Gold'
    ],
    duration: 30
  }
];

export const shouldShowAd = (userId: string, position: string): boolean => {
  const isPremiumUser = localStorage.getItem(`premium_${userId}`) === 'true';
  if (isPremiumUser) return false;
  
  const lastAdTime = localStorage.getItem(`lastAd_${userId}_${position}`);
  const now = Date.now();
  
  if (lastAdTime && now - parseInt(lastAdTime) < 30000) {
    return false;
  }
  
  localStorage.setItem(`lastAd_${userId}_${position}`, now.toString());
  return true;
};

export const trackAdImpression = (adId: string, userId: string): void => {
  console.log(`Ad impression: ${adId} by user ${userId}`);
};

export const trackAdClick = (adId: string, userId: string): void => {
  console.log(`Ad click: ${adId} by user ${userId}`);
};

export const loadAdScript = (provider: 'adsense' | 'adsterra'): void => {
  if (provider === 'adsense') {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXX';
    document.head.appendChild(script);
  }
};
