import React, { useState } from 'react';
import { Bell, Moon, Sun, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { AppState } from '../../types';
import NotificationPanel from './NotificationPanel';

interface HeaderProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  clearAllNotifications: () => void;
}

const Header: React.FC<HeaderProps> = ({ appState, updateAppState, clearAllNotifications }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalNotifications = appState.sites.reduce((sum, site) => sum + site.notifications, 0);
  const unreadNotifications = appState.notifications.filter(n => !n.read).length;

  const handleNameEdit = (newName: string) => {
    if (newName.trim()) {
      updateAppState({ companyName: newName.trim() });
    }
    setIsEditingName(false);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 flex items-center justify-between shadow-lg relative z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center font-bold backdrop-blur-sm">
          WH
        </div>
        {isEditingName ? (
          <input
            type="text"
            value={appState.companyName}
            onChange={(e) => updateAppState({ companyName: e.target.value })}
            onBlur={(e) => handleNameEdit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNameEdit(e.currentTarget.value)}
            className="bg-transparent border-b border-white text-white placeholder-white placeholder-opacity-70 focus:outline-none text-lg font-semibold"
            autoFocus
          />
        ) : (
          <h1 
            className="text-lg font-semibold cursor-pointer hover:bg-white hover:bg-opacity-10 px-2 py-1 rounded transition-colors"
            onClick={() => setIsEditingName(true)}
            title="Clique para editar"
          >
            {appState.companyName}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {(totalNotifications > 0 || unreadNotifications > 0) && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {Math.max(totalNotifications, unreadNotifications)}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <NotificationPanel
              notifications={appState.notifications}
              sites={appState.sites}
              onClose={() => setShowNotifications(false)}
              onClearAll={clearAllNotifications}
            />
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          onClick={() => updateAppState({ isDarkMode: !appState.isDarkMode })}
          title={appState.isDarkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {appState.isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Menu */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 bg-white bg-opacity-10 px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
              JS
            </div>
            <span className="text-sm">João Silva</span>
            <ChevronDown size={16} />
          </div>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 text-gray-700">
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                <User size={16} />
                Perfil
              </button>
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                <Settings size={16} />
                Configurações
              </button>
              <hr className="my-2" />
              <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600">
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;