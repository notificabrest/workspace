import React, { useState } from 'react';
import { Search, Plus, Menu, X } from 'lucide-react';
import { AppState, Site } from '../../types';
import SiteItem from './SiteItem';
import AddSiteModal from './AddSiteModal';

interface SidebarProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  addSite: (siteData: Omit<Site, 'id'>) => void;
  removeSite: (siteId: number) => void;
  updateSite: (siteId: number, updates: Partial<Site>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  appState, 
  updateAppState, 
  addSite, 
  removeSite, 
  updateSite 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter sites based on search query
  const filteredSites = appState.sites.filter(site => 
    site.name.toLowerCase().includes(appState.searchQuery.toLowerCase())
  );

  // Group sites by category
  const sitesByCategory = filteredSites.reduce((acc, site) => {
    if (!acc[site.category]) acc[site.category] = [];
    acc[site.category].push(site);
    return acc;
  }, {} as Record<string, Site[]>);

  const toggleSidebar = () => {
    updateAppState({ sidebarCollapsed: !appState.sidebarCollapsed });
  };

  return (
    <>
      <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg transition-all duration-300 ${
        appState.sidebarCollapsed ? 'w-16' : 'w-72'
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {appState.sidebarCollapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
          
          {!appState.sidebarCollapsed && (
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              title="Adicionar site"
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        {/* Search */}
        {!appState.sidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Buscar sites..."
                value={appState.searchQuery}
                onChange={(e) => updateAppState({ searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Sites */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Dashboard */}
          <div className="mb-6">
            <SiteItem
              site={{
                id: 0,
                name: 'Dashboard',
                url: '',
                icon: '📊',
                color: '#667eea',
                category: 'Sistema',
                notifications: 0
              }}
              isActive={appState.currentView === 'dashboard'}
              isCollapsed={appState.sidebarCollapsed}
              onClick={() => {
                updateAppState({ 
                  currentView: 'dashboard', 
                  currentSite: null 
                });
              }}
              onEdit={() => {}}
              onDelete={() => {}}
              isDashboard
            />
          </div>

          {/* Site Categories */}
          {Object.entries(sitesByCategory).map(([category, categorySites]) => (
            <div key={category} className="mb-6">
              {!appState.sidebarCollapsed && (
                <div className="px-5 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center justify-between">
                  <span>{category}</span>
                  <span>{categorySites.length}</span>
                </div>
              )}
              
              {categorySites.map(site => (
                <SiteItem
                  key={site.id}
                  site={site}
                  isActive={appState.currentSite?.id === site.id}
                  isCollapsed={appState.sidebarCollapsed}
                  onClick={() => {
                    updateAppState({ 
                      currentView: 'site', 
                      currentSite: site 
                    });
                  }}
                  onEdit={(updates) => updateSite(site.id, updates)}
                  onDelete={() => removeSite(site.id)}
                />
              ))}
            </div>
          ))}

          {/* Add Site Button */}
          {!appState.sidebarCollapsed && (
            <div 
              className="mx-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="inline mr-2" />
              Adicionar Site
            </div>
          )}
        </div>
      </aside>

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal
          onClose={() => setShowAddModal(false)}
          onAdd={addSite}
        />
      )}
    </>
  );
};

export default Sidebar;