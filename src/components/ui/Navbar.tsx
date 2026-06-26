import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHeart, FiMessageCircle, FiUser, FiStar } from 'react-icons/fi';
import { useStore } from '../../store/useStore';

const Navbar: React.FC = () => {
  const matches = useStore((state) => state.matches);
  const totalUnread = matches.reduce((acc, match) => acc + (match.unreadCount || 0), 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <NavLink
          to="/swipe"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <FiHeart className="w-6 h-6" />
          <span className="text-xs mt-1">Descubrir</span>
        </NavLink>
        
        <NavLink
          to="/matches"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full transition-colors relative ${
              isActive ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <FiMessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Chats</span>
          {totalUnread > 0 && (
            <span className="absolute top-2 right-1/4 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </NavLink>
        
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <FiUser className="w-6 h-6" />
          <span className="text-xs mt-1">Perfil</span>
        </NavLink>
        
        <NavLink
          to="/premium"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`
          }
        >
          <FiStar className="w-6 h-6" />
          <span className="text-xs mt-1">Premium</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
