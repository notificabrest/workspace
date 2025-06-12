import React from 'react';
import { Bell, TrendingUp, Clock, Zap, BarChart3, Users, Mail, Phone } from 'lucide-react';
import { AppState } from '../../types';

interface DashboardProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  markNotificationAsRead: (notificationId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  appState, 
  updateAppState, 
  markNotificationAsRead 
}) => {
  const stats = {
    leads: 23,
    emails: 47,
    calls: 12,
    tasks: 3
  };

  const unreadNotifications = appState.notifications.filter(n => !n.read);
  const totalSiteNotifications = appState.sites.reduce((sum, site) => sum + site.notifications, 0);

  return (
    <div className="p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bem-vindo ao {appState.companyName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Aqui está um resumo das suas atividades e notificações
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Leads Hoje</p>
              <p className="text-2xl font-bold text-green-600">{stats.leads}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Emails Enviados</p>
              <p className="text-2xl font-bold text-blue-600">{stats.emails}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Chamadas</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.calls}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tarefas Pendentes</p>
              <p className="text-2xl font-bold text-red-600">{stats.tasks}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Bell size={20} className="text-indigo-500" />
            Notificações Recentes
          </h3>
          <div className="space-y-3">
            {unreadNotifications.slice(0, 3).map(notification => (
              <div 
                key={notification.id} 
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="font-medium text-gray-900 dark:text-white">{notification.site}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</div>
                <div className="text-xs text-gray-400 mt-1">{notification.time} atrás</div>
              </div>
            ))}
            {unreadNotifications.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação nova</p>
              </div>
            )}
          </div>
        </div>

        {/* Site Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Users size={20} className="text-purple-500" />
            Atividade dos Sites
          </h3>
          <div className="space-y-3">
            {appState.sites.filter(site => site.notifications > 0).slice(0, 4).map(site => (
              <div 
                key={site.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                onClick={() => updateAppState({ currentView: 'site', currentSite: site })}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: site.color }}
                >
                  {site.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">{site.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {site.notifications} {site.notifications === 1 ? 'nova notificação' : 'novas notificações'}
                  </div>
                </div>
              </div>
            ))}
            {totalSiteNotifications === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <Users size={24} className="mx-auto mb-2 opacity-50" />
                <p>Todos os sites estão em dia</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock size={20} className="text-green-500" />
            Atividade Recente
          </h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Acessou Pipedrive às 14:32</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Respondeu WhatsApp às 14:15</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Verificou Gmail às 13:45</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Atualizou Trello às 13:20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
          <Zap size={20} className="text-orange-500" />
          Acesso Rápido
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {appState.sites.slice(0, 8).map(site => (
            <div
              key={site.id}
              className="flex flex-col items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors group"
              onClick={() => updateAppState({ currentView: 'site', currentSite: site })}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold mb-2 group-hover:scale-110 transition-transform shadow-lg"
                style={{ backgroundColor: site.color }}
              >
                {site.icon}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                {site.name}
              </span>
              {site.notifications > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full mt-1">
                  {site.notifications}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;