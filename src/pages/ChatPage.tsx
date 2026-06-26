import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiSend, 
  FiCpu, 
  FiMoreVertical,
  FiHeart,
  FiFlag,
  FiX
} from 'react-icons/fi';
import { useStore } from '../store/useStore';
import { getMatchById } from '../services/matching';
import { sendMessage, subscribeToMessages, markMessagesAsRead } from '../services/chat';
import { generateChatSuggestions } from '../services/ai';
import { getUserProfile } from '../services/auth';
import { User, Match, Message } from '../types';
import AdBanner from '../components/ads/AdBanner';
import toast from 'react-hot-toast';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { matchId } = useParams<{ matchId: string }>();
  const user = useStore((state) => state.user);
  const isPremium = useStore((state) => state.isPremium);
  
  const [match, setMatch] = useState<Match | null>(null);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadChatData();
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;
    
    const unsubscribe = subscribeToMessages(matchId, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();
    });
    
    return () => unsubscribe();
  }, [matchId]);

  useEffect(() => {
    if (match && user) {
      markMessagesAsRead(match.id, user.id);
    }
  }, [match, messages, user]);

  const loadChatData = async () => {
    if (!matchId || !user) return;
    
    setLoading(true);
    try {
      const matchData = await getMatchById(matchId);
      if (matchData) {
        setMatch(matchData);
        
        const otherUserId = matchData.users.find(id => id !== user.id);
        if (otherUserId) {
          const otherUserData = await getUserProfile(otherUserId);
          setOtherUser(otherUserData);
        }
      }
    } catch (error) {
      toast.error('Error al cargar chat');
      navigate('/matches');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (content?: string) => {
    const messageContent = content || newMessage.trim();
    if (!messageContent || !match || !user || sending) return;
    
    setSending(true);
    try {
      await sendMessage(match.id, user.id, messageContent);
      setNewMessage('');
      setShowAISuggestions(false);
      inputRef.current?.focus();
    } catch (error) {
      toast.error('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  };

  const handleGetAISuggestions = async () => {
    if (!isPremium) {
      toast('Necesitás Premium para usar IA', { icon: '⭐' });
      navigate('/premium');
      return;
    }
    
    setLoadingAI(true);
    try {
      const lastMessage = messages[messages.length - 1];
      const suggestions = await generateChatSuggestions(
        lastMessage?.content || 'Hola',
        otherUser?.bio
      );
      setAiSuggestions(suggestions);
      setShowAISuggestions(true);
    } catch (error) {
      toast.error('Error al obtener sugerencias');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleReport = () => {
    toast('Reporte enviado', { icon: '⚠️' });
    setShowMenu(false);
  };

  const handleUnmatch = () => {
    toast('Match eliminado', { icon: '💔' });
    setShowMenu(false);
    navigate('/matches');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!match || !otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chat no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/matches')}
            className="text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/profile/${otherUser.id}`)}>
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={otherUser.photos[0] || otherUser.photoURL}
                  alt={otherUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{otherUser.displayName}</h2>
              <p className="text-xs text-green-500">En línea</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-600 hover:text-gray-800"
            >
              <FiMoreVertical className="w-6 h-6" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute right-0 top-10 bg-white rounded-xl shadow-lg py-2 w-48 z-50"
                >
                  <button
                    onClick={handleReport}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FiFlag className="w-4 h-4" />
                    Reportar
                  </button>
                  <button
                    onClick={handleUnmatch}
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <FiHeart className="w-4 h-4" />
                    Eliminar match
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full">
        <div className="text-center mb-6">
          <div className="inline-block bg-pink-100 text-pink-600 text-sm px-4 py-2 rounded-full">
            ¡Es un match! {match.compatibility}% compatible
          </div>
        </div>

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'} mb-3`}
          >
            <div
              className={`chat-bubble ${
                message.senderId === user?.id ? 'chat-bubble-sent' : 'chat-bubble-received'
              }`}
            >
              {message.isAI && (
                <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                  <FiCpu className="w-3 h-3" />
                  <span>Respuesta sugerida por IA</span>
                </div>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3">
          <AnimatePresence>
            {showAISuggestions && aiSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FiCpu className="w-4 h-4 text-green-500" />
                    Sugerencias de IA
                  </span>
                  <button
                    onClick={() => setShowAISuggestions(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
                {aiSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(suggestion)}
                    className="ai-suggestion w-full text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetAISuggestions}
              disabled={loadingAI}
              className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
              title="Ayudame a responder"
            >
              {loadingAI ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiCpu className="w-5 h-5" />
              )}
            </button>
            
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribí un mensaje..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
            />
            
            <button
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim() || sending}
              className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiSend className="w-5 h-5" />
              )}
            </button>
          </div>

          {!isPremium && (
            <div className="mt-3">
              <AdBanner position="chat" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
