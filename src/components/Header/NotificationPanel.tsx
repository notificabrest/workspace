import React from 'react';
import { X, CheckCheck, Clock } from 'lucide-react';
import { Notification, Site } from '../../types';

interface NotificationPanelProps {
  notifications: Notification[];
  sites: Site[];
  onClose: () => void;
  onClearAll: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  sites,
  onClose,
  onClearAll
}) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  const siteNotifications = sites.filter(s => s.notifications > 0);

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 text-gray-700 z-50">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Notificações</h3>
        <div className="flex items-center gap-2">
          {(unreadNotifications.length > 0 || siteNotifications.length > 0) && (
            <button
              onClick={onClearAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <CheckCheck size={12} />
              Marcar todas como lidas
            </button>
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Site Notifications */}
        {siteNotifications.map(site => (
          <div key={`site-${site.id}`} className="p-3 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                style={{ backgroundColor: site.color }}
              >
                {site.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{site.name}</div>
                <div className="text-sm text-gray-600">
                  {site.notifications} {site.notifications === 1 ? 'nova notificação' : 'novas notificações'}
                </div>
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                Agora
              </div>
            </div>
          </div>
        ))}

        {/* System Notifications */}
        {unreadNotifications.map(notification => (
          <div key={notification.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{notification.site}</div>
                <div className="text-sm text-gray-600">{notification.message}</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  {notification.time} atrás
                </div>
              </div>
            </div>
          </div>
        ))}

        {unreadNotifications.length === 0 && siteNotifications.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <Bell size={24} className="mx-auto mb-2 opacity-50" />
            <p>Nenhuma notificação nova</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;