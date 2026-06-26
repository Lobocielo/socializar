import { getTursoClient } from './turso';
import { User } from '../types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};

const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'socializar_salt_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const rowToUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  displayName: row.displayName,
  photoURL: row.photoURL || '',
  age: row.age || 18,
  bio: row.bio || '',
  interests: row.interests ? JSON.parse(row.interests) : [],
  photos: row.photos ? JSON.parse(row.photos) : [],
  location: { latitude: row.latitude || 0, longitude: row.longitude || 0 },
  gender: row.gender || 'other',
  lookingFor: row.lookingFor || 'both',
  isPremium: row.isPremium === 1,
  boostCount: row.boostCount || 3,
  personality: row.personalityType ? {
    type: row.personalityType,
    score: row.personalityScore || 50,
    description: row.personalityDesc || ''
  } : undefined,
  lastActive: new Date(row.lastActive || Date.now()),
  createdAt: new Date(row.createdAt || Date.now())
});

export const signUp = async (
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  const client = getTursoClient();

  const existing = await client.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [email]
  });

  if (existing.rows.length > 0) {
    return null;
  }

  const id = generateId();
  const hashedPass = await hashPassword(password);
  const now = new Date().toISOString();

  await client.execute({
    sql: `INSERT INTO users (id, email, displayName, photoURL, age, bio, interests, photos, latitude, longitude, gender, lookingFor, isPremium, boostCount, passwordHash, personalityType, personalityScore, personalityDesc, lastActive, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id, email, name, '', 18, '[]', '[]', '[]',
      0, 0, 'other', 'both', 0, 3,
      hashedPass, '', 0, '', now, now
    ]
  });

  return {
    id,
    email,
    displayName: name,
    photoURL: '',
    age: 18,
    bio: '',
    interests: [],
    photos: [],
    location: { latitude: 0, longitude: 0 },
    gender: 'other',
    lookingFor: 'both',
    isPremium: false,
    boostCount: 3,
    lastActive: new Date(),
    createdAt: new Date()
  };
};

export const signIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  const client = getTursoClient();

  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  const hashedPass = await hashPassword(password);

  if (row.passwordHash !== hashedPass) {
    return null;
  }

  const now = new Date().toISOString();
  await client.execute({
    sql: 'UPDATE users SET lastActive = ? WHERE id = ?',
    args: [now, row.id as string]
  });

  return rowToUser(row);
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem('currentUser');
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  const client = getTursoClient();

  const fields: string[] = [];
  const values: any[] = [];

  if (updates.displayName !== undefined) { fields.push('displayName = ?'); values.push(updates.displayName); }
  if (updates.bio !== undefined) { fields.push('bio = ?'); values.push(updates.bio); }
  if (updates.age !== undefined) { fields.push('age = ?'); values.push(updates.age); }
  if (updates.gender !== undefined) { fields.push('gender = ?'); values.push(updates.gender); }
  if (updates.lookingFor !== undefined) { fields.push('lookingFor = ?'); values.push(updates.lookingFor); }
  if (updates.interests !== undefined) { fields.push('interests = ?'); values.push(JSON.stringify(updates.interests)); }
  if (updates.photos !== undefined) { fields.push('photos = ?'); values.push(JSON.stringify(updates.photos)); }
  if (updates.location !== undefined) { fields.push('latitude = ?'); values.push(updates.location.latitude); fields.push('longitude = ?'); values.push(updates.location.longitude); }
  if (updates.isPremium !== undefined) { fields.push('isPremium = ?'); values.push(updates.isPremium ? 1 : 0); }
  if (updates.boostCount !== undefined) { fields.push('boostCount = ?'); values.push(updates.boostCount); }
  if (updates.photoURL !== undefined) { fields.push('photoURL = ?'); values.push(updates.photoURL); }

  if (fields.length === 0) return;

  values.push(userId);

  await client.execute({
    sql: `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    args: values
  });
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const client = getTursoClient();
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [userId]
  });

  if (result.rows.length > 0) {
    return rowToUser(result.rows[0]);
  }
  return null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const client = getTursoClient();
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email]
  });

  if (result.rows.length > 0) {
    return rowToUser(result.rows[0]);
  }
  return null;
};
