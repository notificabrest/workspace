import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Site } from '../../types';

interface SiteItemProps {
  site: Site;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
  onEdit: (updates: Partial<Site>) => void;
  onDelete: () => void;
  isDashboard?: boolean;
}

const SiteItem: React.FC<SiteItemProps> = ({
  site,
  isActive,
  isCollapsed,
  onClick,
  onEdit,
  onDelete,
  isDashboard = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(site.name);

  const handleEdit = () => {
    if (editName.trim() && editName !== site.name) {
      onEdit({ name: editName.trim() });
    }
    setIsEditing(false);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja remover "${site.name}"?`)) {
      onDelete();
    }
    setShowMenu(false);
  };

  const openInNewTab = () => {
    if (site.url) {
      window.open(site.url, '_blank');
    }
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center gap-3 mx-3 p-3 rounded-lg cursor-pointer transition-colors group ${
          isActive 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        onClick={onClick}
      >
        <div 
          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
            isActive ? 'bg-white bg-opacity-20' : ''
          }`}
          style={{ backgroundColor: isActive ? undefined : site.color }}
        >
          {site.icon}
        </div>
        
        {!isCollapsed && (
          <>
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleEdit}
                onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                className="flex-1 bg-transparent border-b border-current focus:outline-none"
                autoFocus
              />
            ) : (
              <span className="flex-1 font-medium">{site.name}</span>
            )}
            
            <div className="flex items-center gap-2">
              {site.notifications > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-bold ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {site.notifications}
                </span>
              )}
              
              {!isDashboard && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive 
                      ? 'hover:bg-white hover:bg-opacity-20' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <MoreVertical size={12} />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Context Menu */}
      {showMenu && !isDashboard && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-3 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <button
              onClick={() => {
                setIsEditing(true);
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
            >
              <Edit2 size={14} />
              Editar
            </button>
            {site.url && (
              <button
                onClick={openInNewTab}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <ExternalLink size={14} />
                Abrir em nova aba
              </button>
            )}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleDelete}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
            >
              <Trash2 size={14} />
              Remover
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SiteItem;