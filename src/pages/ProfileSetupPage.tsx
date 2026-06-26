import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { updateUserProfile } from '../services/auth';
import toast from 'react-hot-toast';

const INTERESTS = [
  'Música', 'Deportes', 'Viajes', 'Cine', 'Gaming', 'Lectura',
  'Fotografía', 'Cocina', 'Arte', 'Tecnología', 'Fitness', 'Naturaleza',
  'Comida', 'Baile', 'Yoga', 'Meditación', 'Mascotas', 'Moda',
  'Series', 'Podcasts', 'Jardinería', 'Astronomía', 'Ciencia', 'Historia'
];

const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.displayName || '');
  const [age, setAge] = useState(user?.age?.toString() || '18');
  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || 'other');
  const [lookingFor, setLookingFor] = useState<'male' | 'female' | 'both'>(user?.lookingFor || 'both');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 6) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      toast.error('Máximo 6 intereses');
    }
  };

  const handleNext = () => {
    if (step === 1 && !name.trim()) { toast.error('Poné tu nombre'); return; }
    if (step === 2 && selectedInterests.length < 3) { toast.error('Elegí al menos 3 intereses'); return; }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updates = {
        displayName: name.trim(),
        age: parseInt(age),
        bio,
        gender,
        lookingFor,
        interests: selectedInterests,
        location: { latitude: -34.6037 + (Math.random() * 0.1 - 0.05), longitude: -58.3816 + (Math.random() * 0.1 - 0.05) }
      };
      await updateUserProfile(user.id, updates);
      setUser({ ...user, ...updates });
      toast.success('¡Perfil listo!');
      navigate('/swipe');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Creá tu perfil</h1>
            <p className="text-white/80 text-sm">Paso {step} de 3</p>
          </div>
          <div className="w-12 h-12 relative">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="4" strokeDasharray="125.6" strokeDashoffset={125.6 - (125.6 * progress / 100)} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">{step}/3</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl">

            {/* STEP 1: Name + Age */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">👋</div>
                  <h2 className="text-xl font-bold text-gray-800">¿Cómo te llamás?</h2>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                  <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="18" max="99"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Soy</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ v: 'male', l: '👨 Hombre' }, { v: 'female', l: '👩 Mujer' }, { v: 'other', l: '✨ Otro' }].map(o => (
                      <button key={o.v} onClick={() => setGender(o.v as any)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all ${gender === o.v ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{o.l}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Busco</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ v: 'male', l: '👨 Hombres' }, { v: 'female', l: '👩 Mujeres' }, { v: 'both', l: '🌈 Todos' }].map(o => (
                      <button key={o.v} onClick={() => setLookingFor(o.v as any)}
                        className={`py-3 rounded-xl font-medium text-sm transition-all ${lookingFor === o.v ? 'bg-purple-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{o.l}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Interests */}
            {step === 2 && (
              <div>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">🎯</div>
                  <h2 className="text-xl font-bold text-gray-800">¿Qué te gusta?</h2>
                  <p className="text-gray-500 text-sm">Elegí entre 3 y 6 ({selectedInterests.length}/6)</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button key={interest} onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${selectedInterests.includes(interest) ? 'bg-pink-500 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {selectedInterests.includes(interest) && <FiCheck className="inline mr-1" />}{interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Bio + Confirm */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <div className="text-4xl mb-2">✍️</div>
                  <h2 className="text-xl font-bold text-gray-800">Contanos de vos</h2>
                  <p className="text-gray-500 text-sm">Algo que te haga único/a</p>
                </div>
                <div>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Ej: Me encanta viajar y tomar mate al sol 🧉" />
                  <p className="text-right text-xs text-gray-400 mt-1">{bio.length}/200</p>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Tu perfil incluye:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> {name}</div>
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> {age} años</div>
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> {selectedInterests.length} intereses</div>
                    <div className="flex items-center gap-1"><span className="text-green-500">✓</span> {bio ? 'Bio completa' : 'Sin bio'}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 bg-white/20 text-white py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2">
              <FiArrowLeft /> Atrás
            </button>
          )}
          {step < 3 ? (
            <button onClick={handleNext} className="flex-1 bg-white text-pink-500 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              Siguiente <FiArrowRight />
            </button>
          ) : (
            <button onClick={handleComplete} disabled={loading}
              className="flex-1 bg-white text-pink-500 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" /> : <><span>¡Listo!</span><FiCheck /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
