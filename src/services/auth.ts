import { User } from '../types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};

function simpleHash(str: string): string {
  let hash = 0;
  const salt = 'soc2024x';
  const combined = salt + str + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  let hash2 = 0;
  for (let i = 0; i < combined.length; i++) {
    hash2 = ((hash2 << 7) - hash2) + combined.charCodeAt(i);
    hash2 = hash2 & hash2;
  }
  const hex2 = Math.abs(hash2).toString(16).padStart(8, '0');
  return hex + hex2 + hex + hex2;
}

const USERS_KEY = 'socializar_users';
const CURRENT_KEY = 'currentUser';

function getAllUsers(): any[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch { return []; }
}

function saveAllUsers(users: any[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function rowToUser(row: any): User {
  return {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    photoURL: row.photoURL || '',
    age: row.age || 18,
    bio: row.bio || '',
    interests: typeof row.interests === 'string' ? JSON.parse(row.interests) : (row.interests || []),
    photos: typeof row.photos === 'string' ? JSON.parse(row.photos) : (row.photos || []),
    location: { latitude: row.latitude || 0, longitude: row.longitude || 0 },
    gender: row.gender || 'other',
    lookingFor: row.lookingFor || 'both',
    isPremium: !!row.isPremium,
    boostCount: row.boostCount || 3,
    personality: row.personalityType ? { type: row.personalityType, score: row.personalityScore || 50, description: row.personalityDesc || '' } : undefined,
    lastActive: new Date(row.lastActive || Date.now()),
    createdAt: new Date(row.createdAt || Date.now())
  };
}

const DEMO_PROFILES = [
  { id: 'demo_maria', email: 'maria@demo.com', displayName: 'María', age: 24, bio: 'Me encanta bailar y tomar mate con amigos 🧉', gender: 'female', lookingFor: 'male', interests: ['Música', 'Baile', 'Comida', 'Fotografía'], latitude: -34.6037, longitude: -58.3816 },
  { id: 'demo_lucia', email: 'lucia@demo.com', displayName: 'Lucía', age: 22, bio: 'Estudiante de diseño, amante del café y los gatos 🐱', gender: 'female', lookingFor: 'both', interests: ['Arte', 'Cine', 'Lectura', 'Mascotas'], latitude: -34.6050, longitude: -58.3800 },
  { id: 'demo_camila', email: 'camila@demo.com', displayName: 'Camila', age: 26, bio: 'Viajera empedernida, busco alguien que me acompañe ✈️', gender: 'female', lookingFor: 'male', interests: ['Viajes', 'Naturaleza', 'Fitness', 'Cocina'], latitude: -34.6010, longitude: -58.3830 },
  { id: 'demo_valentina', email: 'valentina@demo.com', displayName: 'Valentina', age: 23, bio: 'Amante de los videojuegos y las series de terror 👻', gender: 'female', lookingFor: 'male', interests: ['Gaming', 'Series', 'Cine', 'Tecnología'], latitude: -34.6020, longitude: -58.3790 },
  { id: 'demo_sofia', email: 'sofia@demo.com', displayName: 'Sofía', age: 25, bio: 'Yoga y meditación, pero también me gusta la fiesta 🧘', gender: 'female', lookingFor: 'male', interests: ['Yoga', 'Meditación', 'Naturaleza', 'Música'], latitude: -34.6045, longitude: -58.3810 },
  { id: 'demo_paula', email: 'paula@demo.com', displayName: 'Paula', age: 27, bio: 'Chef en proceso, busco quien pruebe mis recetas 🍳', gender: 'female', lookingFor: 'male', interests: ['Cocina', 'Comida', 'Fotografía', 'Lectura'], latitude: -34.6060, longitude: -58.3820 },
  { id: 'demo_julian', email: 'julian@demo.com', displayName: 'Julián', age: 25, bio: 'Programador por día, DJ por noche 🎧', gender: 'male', lookingFor: 'female', interests: ['Tecnología', 'Música', 'Gaming', 'Baile'], latitude: -34.6040, longitude: -58.3805 },
  { id: 'demo_martin', email: 'martin@demo.com', displayName: 'Martín', age: 28, bio: 'Amo el fútbol y los asados con amigos ⚽', gender: 'male', lookingFor: 'female', interests: ['Deportes', 'Comida', 'Series', 'Música'], latitude: -34.6025, longitude: -58.3825 },
  { id: 'demo_facundo', email: 'facundo@demo.com', displayName: 'Facundo', age: 24, bio: 'Fotógrafo amateur, siempre con la cámara en la mano 📸', gender: 'male', lookingFor: 'female', interests: ['Fotografía', 'Viajes', 'Naturaleza', 'Arte'], latitude: -34.6055, longitude: -58.3815 },
  { id: 'demo_leandro', email: 'leandro@demo.com', displayName: 'Leandro', age: 26, bio: 'Gamer y streamer, busco compañera de squad 🎮', gender: 'male', lookingFor: 'female', interests: ['Gaming', 'Tecnología', 'Series', 'Música'], latitude: -34.6030, longitude: -58.3795 },
  { id: 'demo_nicolas', email: 'nicolas@demo.com', displayName: 'Nicolás', age: 29, bio: 'Amante del gym y los libros de autoayuda 💪', gender: 'male', lookingFor: 'female', interests: ['Fitness', 'Lectura', 'Meditación', 'Comida'], latitude: -34.6015, longitude: -58.3808 },
  { id: 'demo_diego', email: 'diego@demo.com', displayName: 'Diego', age: 27, bio: 'Músico en mi tiempo libre, toco la guitarra 🎸', gender: 'male', lookingFor: 'female', interests: ['Música', 'Baile', 'Comida', 'Naturaleza'], latitude: -34.6048, longitude: -58.3822 },
  { id: 'demo_ana', email: 'ana@demo.com', displayName: 'Ana', age: 21, bio: 'Tímida pero buena onda, busco amigos 😊', gender: 'female', lookingFor: 'male', interests: ['Lectura', 'Cine', 'Música', 'Yoga'], latitude: -34.6035, longitude: -58.3818 },
  { id: 'demo_isabella', email: 'isabella@demo.com', displayName: 'Isabella', age: 23, bio: 'Italiana viviendo en Buenos Aires, busco amigos nuevos 🇮🇹', gender: 'female', lookingFor: 'both', interests: ['Comida', 'Viajes', 'Música', 'Baile'], latitude: -34.6022, longitude: -58.3802 },
  { id: 'demo_ignacio', email: 'ignacio@demo.com', displayName: 'Ignacio', age: 30, bio: 'Emprendedor, me gusta la vida al aire libre 🏔️', gender: 'male', lookingFor: 'female', interests: ['Naturaleza', 'Deportes', 'Viajes', 'Fitness'], latitude: -34.6058, longitude: -58.3812 },
];

function initDemoIfNeeded() {
  const users = getAllUsers();
  if (users.length < 5) {
    const demoHash = simpleHash('demo1234');
    const demoUsers = DEMO_PROFILES.map(d => ({
      ...d,
      passwordHash: demoHash,
      photoURL: '',
      photos: [],
      isPremium: 0,
      boostCount: 3,
      personalityType: '',
      personalityScore: 0,
      personalityDesc: '',
      lastActive: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }));
    const nonDemo = users.filter(u => !u.id.startsWith('demo_'));
    saveAllUsers([...demoUsers, ...nonDemo]);
    console.log('[Auth] Initialized', demoUsers.length, 'demo profiles');
  }
}

export const initDatabase = async (): Promise<void> => {
  initDemoIfNeeded();
  console.log('[Auth] Database ready (localStorage)');
};

export const signUp = async (name: string, email: string, password: string): Promise<User | null> => {
  const users = getAllUsers();
  const cleanEmail = email.trim().toLowerCase();

  if (users.find(u => u.email === cleanEmail)) {
    console.log('[Auth] Email already exists');
    return null;
  }

  const newUser = {
    id: generateId(),
    email: cleanEmail,
    displayName: name,
    photoURL: '',
    age: 18,
    bio: '',
    interests: [],
    photos: [],
    latitude: 0,
    longitude: 0,
    gender: 'other',
    lookingFor: 'both',
    isPremium: 0,
    boostCount: 3,
    passwordHash: simpleHash(password),
    personalityType: '',
    personalityScore: 0,
    personalityDesc: '',
    lastActive: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveAllUsers(users);
  console.log('[Auth] User created:', newUser.email);
  return rowToUser(newUser);
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  const users = getAllUsers();
  const cleanEmail = email.trim().toLowerCase();
  const user = users.find(u => u.email === cleanEmail);

  if (!user) {
    console.log('[Auth] User not found:', cleanEmail);
    return null;
  }

  const inputHash = simpleHash(password);
  if (user.passwordHash !== inputHash) {
    console.log('[Auth] Password mismatch for:', cleanEmail);
    return null;
  }

  console.log('[Auth] Login OK:', cleanEmail);
  return rowToUser(user);
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(CURRENT_KEY);
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  const users = getAllUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return;

  if (updates.displayName !== undefined) users[idx].displayName = updates.displayName;
  if (updates.bio !== undefined) users[idx].bio = updates.bio;
  if (updates.age !== undefined) users[idx].age = updates.age;
  if (updates.gender !== undefined) users[idx].gender = updates.gender;
  if (updates.lookingFor !== undefined) users[idx].lookingFor = updates.lookingFor;
  if (updates.interests !== undefined) users[idx].interests = updates.interests;
  if (updates.photos !== undefined) users[idx].photos = updates.photos;
  if (updates.location !== undefined) { users[idx].latitude = updates.location.latitude; users[idx].longitude = updates.location.longitude; }
  if (updates.isPremium !== undefined) users[idx].isPremium = updates.isPremium ? 1 : 0;
  if (updates.boostCount !== undefined) users[idx].boostCount = updates.boostCount;
  if (updates.photoURL !== undefined) users[idx].photoURL = updates.photoURL;

  saveAllUsers(users);
  console.log('[Auth] Profile updated:', userId);
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const users = getAllUsers();
  const user = users.find(u => u.id === userId);
  return user ? rowToUser(user) : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email.trim().toLowerCase());
  return user ? rowToUser(user) : null;
};

export { DEMO_PROFILES };
