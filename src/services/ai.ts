import { PersonalityType } from '../types';

const PERSONALITY_PATTERNS: Record<string, string[]> = {
  timido: ['hola', 'buenas', 'que tal', 'como va', 'todo bien', 'tranqui'],
  directo: ['que onda', 'como andas', 'que haces', 'hablamos', 'cuando nos vemos', 'dale'],
  divertido: ['jaja', 'jajaja', 'xd', 'riendome', 'genial', 'excelente', 'baile', 'fiesta'],
  serio: ['buenos dias', 'buenas tardes', 'como se encuentra', 'un placer', 'encantado'],
  aventurero: ['viaje', 'aventura', 'explorar', 'conocer', 'descubrir', 'montaña', 'playa', 'mundo']
};

const RESPONSE_SUGGESTIONS: Record<string, string[]> = {
  timido: [
    'Hola, todo bien por acá. Vos cómo andás?',
    'Hey! Me alegra que me hayas escrito',
    'Qué onda, todo tranqui por mi lado'
  ],
  directo: [
    'Todo bien, vos?',
    'Acá bien, qué hacés?',
    'Bien! Y vos, qué onda?'
  ],
  divertido: [
    'Jaja todo bien! Vos cómo andás?',
    'Acá re tranqui, inventando la rueda jaja',
    'Genial! Recién llego de salvar al mundo (mentira, estaba durmiendo)'
  ],
  serio: [
    'Buenas, todo bien gracias. Vos?',
    'Bien, trabajando como siempre. Y vos?',
    'Hola, espero que estés teniendo un buen día'
  ],
  aventurero: [
    'Todo bien! Estoy planificando mi próximo viaje, vos?',
    'Acá buscando nuevas aventuras! Qué hacés?',
    'Genial! Me encanta explorar lugares nuevos'
  ]
};

const detectLanguage = (text: string): 'es' | 'en' | 'other' => {
  const spanishWords = ['hola', 'como', 'que', 'haces', 'bien', 'gracias', 'por', 'para', 'con', 'sin'];
  const englishWords = ['hello', 'how', 'are', 'you', 'what', 'doing', 'good', 'thanks'];

  const lowerText = text.toLowerCase();
  const spanishCount = spanishWords.filter(w => lowerText.includes(w)).length;
  const englishCount = englishWords.filter(w => lowerText.includes(w)).length;

  if (spanishCount > englishCount) return 'es';
  if (englishCount > spanishCount) return 'en';
  return 'other';
};

export const analyzePersonality = (text: string): PersonalityType => {
  const lowerText = text.toLowerCase();
  const scores: Record<string, number> = {
    timido: 0,
    directo: 0,
    divertido: 0,
    serio: 0,
    aventurero: 0
  };

  Object.entries(PATTERNS).forEach(([type, patterns]) => {
    patterns.forEach(pattern => {
      if (lowerText.includes(pattern)) {
        scores[type] += 10;
      }
    });
  });

  if (lowerText.includes('!') || lowerText.includes('¡')) scores.divertido += 5;
  if (lowerText.includes('?') || lowerText.includes('¿')) scores.directo += 3;
  if (text.length < 20) scores.timido += 5;
  if (text.length > 100) scores.serio += 5;

  const maxType = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as PersonalityType['type'];
  const maxScore = Math.min(100, scores[maxType] * 10 + 30);

  const descriptions: Record<string, string> = {
    timido: 'Tímido - Prefiere conocer de a poco',
    directo: 'Directo - Va al grano sin vueltas',
    divertido: 'Divertido - Siempre con buena onda',
    serio: 'Serio - Piensa antes de hablar',
    aventurero: 'Aventurero - Busca nuevas experiencias'
  };

  return {
    type: maxType,
    score: maxScore,
    description: descriptions[maxType]
  };
};

export const generateChatSuggestions = async (
  receivedMessage: string,
  userProfile?: string
): Promise<string[]> => {
  const personality = analyzePersonality(receivedMessage);
  const baseSuggestions = RESPONSE_SUGGESTIONS[personality.type] || RESPONSE_SUGGESTIONS.directo;

  const lowerMessage = receivedMessage.toLowerCase();

  if (lowerMessage.includes('musica') || lowerMessage.includes('cancion')) {
    return [
      'Me encanta! Qué estás escuchando?',
      'Qué bueno! Yo también soy fan de la música',
      'Copado! Recomendame algo para escuchar'
    ];
  }

  if (lowerMessage.includes('viaje') || lowerMessage.includes('viajar')) {
    return [
      'Cuanto viajar! Cuál fue tu último destino?',
      'Yo también me gusta viajar! Qué lugar te gustó más?',
      'Re copado! Estás planificando algún viaje?'
    ];
  }

  if (lowerMessage.includes('deporte') || lowerMessage.includes('gym')) {
    return [
      'Qué bueno! Yo también hago deporte',
      'Dale! Cuál es tu rutina?',
      'Genial! El deporte es clave para estar bien'
    ];
  }

  if (lowerMessage.includes('comida') || lowerMessage.includes('comer')) {
    return [
      'Me encanta comer bien! Qué cuisine te gusta?',
      'Uh qué rico! Sabés cocinar?',
      'Buena onda! Cuál es tu comida favorita?'
    ];
  }

  if (lowerMessage.includes('pelicula') || lowerMessage.includes('serie')) {
    return [
      'Genial! Qué serie estás viendo?',
      'Yo también! Cuál te gustó más?',
      'Dale, contame cuál viste recientemente'
    ];
  }

  if (lowerMessage.includes('hola') || lowerMessage.includes('que onda')) {
    return [
      'Hola! Todo bien por acá',
      'Hey! Qué onda? Todo tranqui',
      'Hola! Me alegra que me escribas'
    ];
  }

  return baseSuggestions;
};

export const calculateCompatibility = (
  user1Interests: string[],
  user2Interests: string[],
  user1Personality?: PersonalityType,
  user2Personality?: PersonalityType
): number => {
  const commonInterests = user1Interests.filter(i => user2Interests.includes(i));
  const interestScore = (commonInterests.length / Math.max(user1Interests.length, 1)) * 50;

  let personalityScore = 25;
  if (user1Personality && user2Personality) {
    const complementaryTypes: Record<string, string[]> = {
      timido: ['divertido', 'aventurero'],
      directo: ['serio', 'divertido'],
      divertido: ['timido', 'directo'],
      serio: ['divertido', 'aventurero'],
      aventurero: ['timido', 'serio']
    };

    if (complementaryTypes[user1Personality.type]?.includes(user2Personality.type)) {
      personalityScore = 40;
    } else if (user1Personality.type === user2Personality.type) {
      personalityScore = 30;
    }
  }

  const randomFactor = Math.random() * 10;

  return Math.min(100, Math.round(interestScore + personalityScore + randomFactor));
};

export const generateIceBreakers = (userProfile: any): string[] => {
  const interests = userProfile.interests || [];
  const iceBreakers: string[] = [];

  if (interests.includes('musica')) iceBreakers.push('Qué estás escuchando últimamente?');
  if (interests.includes('viajes')) iceBreakers.push('Cuál fue tu último viaje?');
  if (interests.includes('deportes')) iceBreakers.push('Hacés algún deporte?');
  if (interests.includes('cine')) iceBreakers.push('Viste alguna peli buena?');
  if (interests.includes('gaming')) iceBreakers.push('Qué juegos estás jugando?');

  if (iceBreakers.length < 3) {
    iceBreakers.push('Hola! Cómo andás?', 'Qué onda! Todo bien?', 'Me pareció interesante tu perfil');
  }

  return iceBreakers.slice(0, 5);
};
