import { PersonalityType } from '../types';

const API_KEY = 'TU_OPENAI_API_KEY';
const API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzePersonality = async (text: string): Promise<PersonalityType> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Analiza el siguiente texto y clasifica la personalidad del usuario en UNA de estas categorías:
            - timido: Tímido, reserve, habla poco
            - directo: Directo, va al grano
            - divertido: Divertido, hace chistes
            - serio: Serio, formal
            - aventurero: Aventurero, busca experiencias
            
            Responde SOLO con el tipo de personalidad y una breve descripción en formato JSON:
            {"type": "tipo", "score": 0-100, "description": "descripción"}`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return {
          type: parsed.type || 'directo',
          score: parsed.score || 50,
          description: parsed.description || 'Personalidad analizada'
        };
      } catch {
        return {
          type: 'directo',
          score: 50,
          description: 'Personalidad analizada'
        };
      }
    }
    
    return {
      type: 'directo',
      score: 50,
      description: 'Personalidad analizada'
    };
  } catch (error) {
    console.error('Error analyzing personality:', error);
    return {
      type: 'directo',
      score: 50,
      description: 'No se pudo analizar'
    };
  }
};

export const generateChatSuggestions = async (
  receivedMessage: string,
  userProfile?: string
): Promise<string[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Sos un asistente de conversación para una app de citas. Genera 3 opciones de respuesta para el usuario. 
            Las respuestas deben ser:
            - Naturales y variadas
            - Apropiadas para conocer a alguien
            - En español rioplatense (Argentina/Uruguay)
            - Sin ser demasiado formales
            
            Responde SOLO con un array JSON de 3 strings.`
          },
          {
            role: 'user',
            content: `Mensaje recibido: "${receivedMessage}"${userProfile ? `\nPerfil del usuario: ${userProfile}` : ''}`
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      })
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [content];
      }
    }
    
    return ['Hola, ¿cómo andás?', '¡Qué onda! Todo bien?', 'Hola! Me pareció interesante tu perfil'];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return ['Hola, ¿cómo andás?', '¡Qué onda! Todo bien?', 'Hola! Me pareció interesante tu perfil'];
  }
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
  
  if (interests.includes('música')) {
    iceBreakers.push('¿Qué estás escuchando últimamente?');
  }
  if (interests.includes('viajes')) {
    iceBreakers.push('¿Cuál fue tu último viaje?');
  }
  if (interests.includes('deportes')) {
    iceBreakers.push('¿Hacés algún deporte?');
  }
  if (interests.includes('cine')) {
    iceBreakers.push('¿Viste alguna peli buena últimamente?');
  }
  if (interests.includes('gaming')) {
    iceBreakers.push('¿Qué juegos estás jugando?');
  }
  
  if (iceBreakers.length < 3) {
    iceBreakers.push(
      'Hola! ¿Cómo andás?',
      '¡Qué onda! Todo bien?',
      'Me pareció interesante tu perfil'
    );
  }
  
  return iceBreakers.slice(0, 5);
};
