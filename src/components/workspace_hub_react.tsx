import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, Settings, RefreshCw, Maximize, Plus, User, ChevronDown } from 'lucide-react';

const WorkspaceHub = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentSite, setCurrentSite] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [companyName, setCompanyName] = useState('Minha Empresa');
  const [isEditingName, setIsEditingName] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dados mockados dos sites
  const [sites, setSites] = useState([
    // Trabalho
    { id: 1, name: 'Pipedrive', url: 'https://pipedrive.com', icon: 'P', color: '#ff6b35', category: 'Trabalho', notifications: 3 },
    { id: 2, name: 'Gmail', url: 'https://gmail.com', icon: '✉', color: '#ea4335', category: 'Trabalho', notifications: 12 },
    { id: 3, name: 'PABX', url: 'https://pabx.com', icon: '📞', color: '#0ea5e9', category: 'Trabalho', notifications: 0 },
    { id: 4, name: 'Trello', url: 'https://trello.com', icon: 'T', color: '#0079bf', category: 'Trabalho', notifications: 2 },
    
    // Comunicação
    { id: 5, name: 'WhatsApp', url: 'https://web.whatsapp.com', icon: '📱', color: '#25d366', category: 'Comunicação', notifications: 7 },
    { id: 6, name: 'Slack', url: 'https://slack.com', icon: 'S', color: '#4a154b', category: 'Comunicação', notifications: 0 },
    { id: 7, name: 'Teams', url: 'https://teams.microsoft.com', icon: 'T', color: '#6264a7', category: 'Comunicação', notifications: 0 },
    
    // Ferramentas
    { id: 8, name: 'Analytics', url: 'https://analytics.google.com', icon: '📈', color: '#ff9500', category: 'Ferramentas', notifications: 0 },
    { id: 9, name: 'Canva', url: 'https://canva.com', icon: 'C', color: '#00c4cc', category: 'Ferramentas', notifications: 0 },
  ]);

  const [notifications] = useState([
    { id: 1, site: 'Pipedrive', message: '3 novos leads aguardando', time: '2 min' },
    { id: 2, site: 'Gmail', message: '12 emails não lidos', time: '5 min' },
    { id: 3, site: 'WhatsApp', message: '7 mensagens pendentes', time: '10 min' },
    { id: 4, site: 'Trello', message: '2 tarefas vencidas', time: '1h' },
  ]);

  // Filtrar sites baseado na busca
  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Agrupar sites por categoria
  const sitesByCategory = filteredSites.reduce((acc, site) => {
    if (!acc[site.category]) acc[site.category] = [];
    acc[site.category].push(site);
    return acc;
  }, {});

  // Componente Header
  const Header = () => {
    const totalNotifications = sites.reduce((sum, site) => sum + site.notifications, 0);

    return (
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center font-bold">
            WH
          </div>
          {isEditingName ? (
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
              className="bg-transparent border-b border-white text-white placeholder-white placeholder-opacity-70 focus:outline-none"
              autoFocus
            />
          ) : (
            <h1 
              className="text-lg font-semibold cursor-pointer hover:bg-white hover:bg-opacity-10 px-2 py-1 rounded transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {companyName}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            onClick={() => alert('Central de notificações')}
          >
            <Bell size={20} />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalNotifications}
              </span>
            )}
          </button>

          <button 
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="flex items-center gap-2 bg-white bg-opacity-10 px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-20 transition-colors">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
              JS
            </div>
            <span className="text-sm">João Silva</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>
    );
  };

  // Componente Sidebar
  const Sidebar = () => {
    return (
      <aside className={`bg-white border-r border-gray-200 flex flex-col shadow-lg transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-72'}`}>
        {/* Busca */}
        {!sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar sites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Sites */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Dashboard */}
          <div className="mb-6">
            <div 
              className={`flex items-center gap-3 mx-3 p-3 rounded-lg cursor-pointer transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setCurrentView('dashboard');
                setCurrentSite(null);
              }}
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm font-bold ${
                currentView === 'dashboard' ? 'bg-white bg-opacity-20' : 'bg-indigo-500 text-white'
              }`}>
                📊
              </div>
              {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
            </div>
          </div>

          {/* Categorias de Sites */}
          {Object.entries(sitesByCategory).map(([category, categorySites]) => (
            <div key={category} className="mb-6">
              {!sidebarCollapsed && (
                <div className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
                  <span>{category}</span>
                  <span>{categorySites.length}</span>
                </div>
              )}
              
              {categorySites.map(site => (
                <div
                  key={site.id}
                  className={`flex items-center gap-3 mx-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    currentSite?.id === site.id 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCurrentView('site');
                    setCurrentSite(site);
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: site.color }}
                  >
                    {site.icon}
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 font-medium">{site.name}</span>
                      {site.notifications > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {site.notifications}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Adicionar Site */}
          {!sidebarCollapsed && (
            <div 
              className="mx-3 p-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-indigo-400 hover:bg-gray-50 transition-colors"
              onClick={() => {
                const url = prompt('Digite a URL do site:');
                if (url) {
                  const name = prompt('Nome do site:') || 'Novo Site';
                  const newSite = {
                    id: sites.length + 1,
                    name,
                    url,
                    icon: name.charAt(0).toUpperCase(),
                    color: '#6366f1',
                    category: 'Ferramentas',
                    notifications: 0
                  };
                  setSites([...sites, newSite]);
                }
              }}
            >
              <Plus size={16} className="inline mr-2" />
              Adicionar Site
            </div>
          )}
        </div>
      </aside>
    );
  };

  // Componente Dashboard
  const Dashboard = () => {
    const stats = {
      leads: 23,
      emails: 47,
      calls: 12,
      tasks: 3
    };

    return (
      <div className="p-6 overflow-y-auto bg-gray-50 min-h-full">
        {/* Grid de Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {/* Notificações */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell size={20} className="text-indigo-500" />
              Notificações Recentes
            </h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map(notification => (
                <div key={notification.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                  <div className="font-medium text-gray-900">{notification.site}</div>
                  <div className="text-sm text-gray-600">{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{notification.time} atrás</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo do Dia */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📊 Resumo do Dia
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.leads}</div>
                <div className="text-sm text-gray-600">Leads Hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.emails}</div>
                <div className="text-sm text-gray-600">Emails Enviados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.calls}</div>
                <div className="text-sm text-gray-600">Chamadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.tasks}</div>
                <div className="text-sm text-gray-600">Tarefas Pendentes</div>
              </div>
            </div>
          </div>

          {/* Atividade Recente */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              ⏰ Atividade Recente
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Acessou Pipedrive às 14:32</div>
              <div>• Respondeu WhatsApp às 14:15</div>
              <div>• Verificou Gmail às 13:45</div>
              <div>• Atualizou Trello às 13:20</div>
            </div>
          </div>
        </div>

        {/* Acesso Rápido */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🚀 Acesso Rápido
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sites.slice(0, 6).map(site => (
              <div
                key={site.id}
                className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                onClick={() => {
                  setCurrentView('site');
                  setCurrentSite(site);
                }}
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold mb-2 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: site.color }}
                >
                  {site.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{site.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Componente SiteView
  const SiteView = ({ site }) => {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header do Site */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: site.color }}
            >
              {site.icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{site.name}</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw size={16} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Maximize size={16} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Conteúdo do Site */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Carregando {site.name}</h3>
            <p className="text-gray-600 mb-4">O conteúdo será exibido aqui através de iframe ou proxy.</p>
            <div className="text-sm text-gray-500">
              <div>URL: {site.url}</div>
              <div className="mt-2">
                <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                  Em desenvolvimento
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          {currentView === 'dashboard' ? (
            <Dashboard />
          ) : currentSite ? (
            <SiteView site={currentSite} />
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default WorkspaceHub;