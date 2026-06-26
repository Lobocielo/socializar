import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiPlus, FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { updateUserProfile } from '../services/auth';
import { getCurrentLocation } from '../services/location';
import toast from 'react-hot-toast';

const INTERESTS = [
  'Música', 'Deportes', 'Viajes', 'Cine', 'Gaming', 'Lectura',
  'Fotografía', 'Cocina', 'Arte', 'Tecnología', 'Fitness', 'Nature',
  'Comida', 'Baile', 'Yoga', 'Meditación', 'Mascotas', 'Moda'
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
    if (step === 1 && (!name || !age)) {
      toast.error('Completá nombre y edad');
      return;
    }
    if (step === 2 && selectedInterests.length < 3) {
      toast.error('Seleccioná al menos 3 intereses');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      let location = user.location;
      try {
        location = await getCurrentLocation();
      } catch {
        toast('No se pudo obtener ubicación', { icon: '📍' });
      }

      const updates = {
        displayName: name,
        age: parseInt(age),
        bio,
        gender,
        lookingFor,
        interests: selectedInterests,
        location
      };

      await updateUserProfile(user.id, updates);
      setUser({ ...user, ...updates });
      
      toast.success('¡Perfil completado!');
      navigate('/swipe');
    } catch (error) {
      toast.error('Error al guardar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8 pt-4">
          <div className="text-white">
            <h1 className="text-2xl font-bold">Creá tu perfil</h1>
            <p className="text-white/80">Paso {step} de 3</p>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 w-8 rounded-full transition-colors ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl"
          >
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mx-auto flex items-center justify-center text-white text-4xl mb-4">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FiCamera />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Edad
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soy
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'male', label: 'Hombre' },
                      { value: 'female', label: 'Mujer' },
                      { value: 'other', label: 'Otro' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setGender(option.value as any)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          gender === option.value
                            ? 'bg-pink-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Busco
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'male', label: 'Hombres' },
                      { value: 'female', label: 'Mujeres' },
                      { value: 'both', label: 'Todos' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setLookingFor(option.value as any)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          lookingFor === option.value
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Qué te gusta?
                </h2>
                <p className="text-gray-500 mb-4">
                  Elegí al menos 3 intereses ({selectedInterests.length}/6)
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Contanos de vos
                </h2>
                <p className="text-gray-500 mb-4">
                  Escribí algo sobre vos para que otros te conozcan
                </p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={300}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Contanos algo interesante sobre vos..."
                  />
                  <p className="text-right text-sm text-gray-400 mt-1">
                    {bio.length}/300
                  </p>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Tu perfil incluye:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Nombre: {name}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> Edad: {age}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {selectedInterests.length} intereses
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-500">✓</span> {bio ? 'Bio completa' : 'Sin bio'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 bg-white/20 text-white py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              Atrás
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 bg-white text-pink-500 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 bg-white text-pink-500 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : '¡Completar!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
