import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import { signIn, signUp } from '../services/auth';
import { initDatabase } from '../services/turso';
import { validateEmailFormat, getSuggestionDomain } from '../utils/emailValidator';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

type Tab = 'login' | 'register';
type VerificationStep = 'form' | 'code';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginEmailValid, setLoginEmailValid] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [regEmailError, setRegEmailError] = useState('');
  const [regEmailValid, setRegEmailValid] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState('');

  const [regStep, setRegStep] = useState<VerificationStep>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    initDatabase().then(() => setDbReady(true)).catch(() => setDbReady(true));
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    if (loginEmail) {
      const result = validateEmailFormat(loginEmail);
      setLoginEmailError(result.valid ? '' : result.error || '');
      setLoginEmailValid(result.valid);
    } else {
      setLoginEmailError('');
      setLoginEmailValid(false);
    }
    setEmailSuggestion('');
  }, [loginEmail]);

  useEffect(() => {
    if (regEmail) {
      const result = validateEmailFormat(regEmail);
      setRegEmailError(result.valid ? '' : result.error || '');
      setRegEmailValid(result.valid);
      const suggestion = getSuggestionDomain(regEmail);
      setEmailSuggestion(suggestion);
    } else {
      setRegEmailError('');
      setRegEmailValid(false);
      setEmailSuggestion('');
    }
  }, [regEmail]);

  const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailCheck = validateEmailFormat(loginEmail);
    if (!emailCheck.valid) {
      toast.error(emailCheck.error);
      return;
    }
    if (!loginPassword) {
      toast.error('Poné tu contraseña');
      return;
    }
    setLoading(true);
    try {
      const user = await signIn(loginEmail.trim().toLowerCase(), loginPassword);
      if (user) {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success(`¡Bienvenido ${user.displayName}!`);
        if (!user.bio || user.interests.length === 0) {
          navigate('/setup');
        } else {
          navigate('/swipe');
        }
      } else {
        toast.error('Email o contraseña incorrectos');
      }
    } catch (err) {
      toast.error('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) { toast.error('Poné tu nombre'); return; }
    const emailCheck = validateEmailFormat(regEmail);
    if (!emailCheck.valid) { toast.error(emailCheck.error); return; }
    if (regPassword.length < 4) { toast.error('La contraseña debe tener al menos 4 caracteres'); return; }
    if (regPassword !== regConfirm) { toast.error('Las contraseñas no coinciden'); return; }

    const code = generateCode();
    setGeneratedCode(code);
    setCodeSent(true);
    setCountdown(60);
    setRegStep('code');

    toast.success(`Código enviado a ${regEmail}`, { duration: 5000 });
    console.log(`[VERIFICACIÓN] Tu código es: ${code}`);
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode !== generatedCode) {
      setCodeError('Código incorrecto. Revisá tu email.');
      return;
    }
    setCodeError('');
    setLoading(true);
    try {
      const user = await signUp(regName.trim(), regEmail.trim().toLowerCase(), regPassword);
      if (user) {
        setUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        toast.success('¡Cuenta creada! Completá tu perfil');
        navigate('/setup');
      } else {
        toast.error('Ese email ya está registrado');
        setRegStep('form');
      }
    } catch (err) {
      toast.error('Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    if (countdown > 0) return;
    const code = generateCode();
    setGeneratedCode(code);
    setCountdown(60);
    setCodeSent(true);
    toast.success(`Nuevo código enviado a ${regEmail}`);
    console.log(`[VERIFICACIÓN] Tu código nuevo es: ${code}`);
  };

  const applySuggestion = () => {
    if (emailSuggestion) {
      setRegEmail(emailSuggestion);
      setEmailSuggestion('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-3">💕</motion.div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Socializar</h1>
          <p className="text-white/70 mt-1">Conocé gente nueva cerca tuyo</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          {!dbReady ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-3 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">Conectando...</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                <button onClick={() => { setTab('login'); setRegStep('form'); }} className={`flex-1 py-4 font-semibold text-sm transition-colors relative ${tab === 'login' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}>
                  Iniciar Sesión
                  {tab === 'login' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 to-purple-500" />}
                </button>
                <button onClick={() => setTab('register')} className={`flex-1 py-4 font-semibold text-sm transition-colors relative ${tab === 'register' ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}>
                  Crear Cuenta
                  {tab === 'register' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 to-purple-500" />}
                </button>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* LOGIN FORM */}
                  {tab === 'login' && (
                    <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} onSubmit={handleLogin} className="space-y-4">
                      <p className="text-gray-500 text-sm mb-2">Ingresá tus datos para continuar</p>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="tu@email.com"
                            className={`w-full pl-12 pr-10 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all ${loginEmailError ? 'border-red-300 bg-red-50' : loginEmailValid ? 'border-green-300 bg-green-50' : 'border-gray-200'}`} />
                          {loginEmailValid && <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
                          {loginEmailError && <FiX className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                        </div>
                        {loginEmailError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{loginEmailError}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type={showLoginPass ? 'text' : 'password'} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Tu contraseña"
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all" />
                          <button type="button" onClick={() => setShowLoginPass(!showLoginPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showLoginPass ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || !loginEmailValid}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Entrar</span><FiArrowRight className="w-5 h-5" /></>}
                      </motion.button>
                    </motion.form>
                  )}

                  {/* REGISTER FORM */}
                  {tab === 'register' && regStep === 'form' && (
                    <motion.form key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} onSubmit={handleRegisterStep1} className="space-y-4">
                      <p className="text-gray-500 text-sm mb-2">Creá tu cuenta gratis</p>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Tu nombre"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="tu@email.com"
                            className={`w-full pl-12 pr-10 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all ${regEmailError ? 'border-red-300 bg-red-50' : regEmailValid ? 'border-green-300 bg-green-50' : 'border-gray-200'}`} />
                          {regEmailValid && <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
                          {regEmailError && <FiX className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                        </div>
                        {regEmailError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{regEmailError}</p>}
                        {emailSuggestion && (
                          <button type="button" onClick={applySuggestion} className="text-xs text-blue-500 hover:text-blue-700 mt-1 underline">
                            ¿Quisiste decir {emailSuggestion}?
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type={showRegPass ? 'text' : 'password'} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Mínimo 4 caracteres"
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all" />
                          <button type="button" onClick={() => setShowRegPass(!showRegPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showRegPass ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
                        <div className="relative">
                          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} placeholder="Repetí tu contraseña"
                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all ${regConfirm && regPassword !== regConfirm ? 'border-red-300' : regConfirm && regPassword === regConfirm ? 'border-green-300' : 'border-gray-200'}`} />
                        </div>
                        {regConfirm && regPassword !== regConfirm && <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>}
                        {regConfirm && regPassword === regConfirm && regPassword.length >= 4 && <p className="text-green-500 text-xs mt-1 flex items-center gap-1"><FiCheck />Contraseñas coinciden</p>}
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || !regEmailValid || !regName || regPassword.length < 4 || regPassword !== regConfirm}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Verificar Email</span><FiArrowRight className="w-5 h-5" /></>}
                      </motion.button>
                    </motion.form>
                  )}

                  {/* CODE VERIFICATION */}
                  {tab === 'register' && regStep === 'code' && (
                    <motion.form key="code" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleVerifyCode} className="space-y-4">
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiMail className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Verificá tu email</h3>
                        <p className="text-gray-500 text-sm mt-1">
                          Te enviamos un código de 6 dígitos a
                        </p>
                        <p className="text-pink-500 font-semibold text-sm">{regEmail}</p>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-500 mb-2">Tu código de verificación es:</p>
                        <p className="text-3xl font-mono font-bold text-purple-600 tracking-[0.3em]">{generatedCode}</p>
                        <p className="text-xs text-gray-400 mt-2">(En producción llegaría a tu email)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código de verificación</label>
                        <input type="text" value={verificationCode} onChange={(e) => { setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setCodeError(''); }} placeholder="000000" maxLength={6}
                          className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:bg-white transition-all text-center text-2xl font-mono tracking-[0.2em]" />
                        {codeError && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><FiAlertCircle />{codeError}</p>}
                      </div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || verificationCode.length !== 6}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Crear Cuenta</span><FiCheck className="w-5 h-5" /></>}
                      </motion.button>

                      <button type="button" onClick={handleResendCode} disabled={countdown > 0} className="w-full text-center text-sm text-gray-500 hover:text-pink-500 disabled:text-gray-300 transition-colors">
                        {countdown > 0 ? `Reenviar código en ${countdown}s` : 'Reenviar código'}
                      </button>

                      <button type="button" onClick={() => { setRegStep('form'); setVerificationCode(''); setCodeError(''); }} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        ← Volver al formulario
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[{ emoji: '🔍', label: 'Encontrá gente' }, { emoji: '💬', label: 'Chateá' }, { emoji: '❤️', label: 'Conectá' }].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="text-2xl">{f.emoji}</div>
              <p className="text-white/80 text-xs mt-1">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
