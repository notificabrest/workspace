import React, { useState, useEffect } from 'react';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import MainContent from './MainContent/MainContent';
import { Site, Notification, AppState } from '../types';
import { defaultSites, defaultNotifications } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';

const WorkspaceHub: React.FC = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('workspace-hub-state', {
    currentView: 'dashboard',
    currentSite: null,
    searchQuery: '',
    isDarkMode: false,
    companyName: 'Minha Empresa',
    sidebarCollapsed: false,
    sites: defaultSites,
    notifications: defaultNotifications,
  });

  const updateAppState = (updates: Partial<AppState>) => {
    setAppState(prev => ({ ...prev, ...updates }));
  };

  const addSite = (siteData: Omit<Site, 'id'>) => {
    const newSite: Site = {
      ...siteData,
      id: Date.now(),
    };
    
    updateAppState({
      sites: [...appState.sites, newSite]
    });
    
    toast.success(`Site "${newSite.name}" adicionado com sucesso!`);
  };

  const removeSite = (siteId: number) => {
    updateAppState({
      sites: appState.sites.filter(site => site.id !== siteId),
      currentSite: appState.currentSite?.id === siteId ? null : appState.currentSite,
      currentView: appState.currentSite?.id === siteId ? 'dashboard' : appState.currentView,
    });
    
    toast.success('Site removido com sucesso!');
  };

  const updateSite = (siteId: number, updates: Partial<Site>) => {
    updateAppState({
      sites: appState.sites.map(site => 
        site.id === siteId ? { ...site, ...updates } : site
      ),
      currentSite: appState.currentSite?.id === siteId 
        ? { ...appState.currentSite, ...updates } 
        : appState.currentSite,
    });
    
    toast.success('Site atualizado com sucesso!');
  };

  const markNotificationAsRead = (notificationId: number) => {
    updateAppState({
      notifications: appState.notifications.map(notification =>
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    });
  };

  const clearAllNotifications = () => {
    updateAppState({
      notifications: appState.notifications.map(notification => ({
        ...notification,
        read: true
      }))
    });
    
    toast.success('Todas as notificações foram marcadas como lidas');
  };

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('workspace-hub-backup', JSON.stringify(appState));
  }, [appState]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update notification counts
      const updatedSites = appState.sites.map(site => ({
        ...site,
        notifications: Math.random() > 0.8 ? site.notifications + 1 : site.notifications
      }));
      
      if (JSON.stringify(updatedSites) !== JSON.stringify(appState.sites)) {
        updateAppState({ sites: updatedSites });
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [appState.sites]);

  return (
    <div className={`h-screen flex flex-col ${appState.isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        appState={appState}
        updateAppState={updateAppState}
        clearAllNotifications={clearAllNotifications}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          appState={appState}
          updateAppState={updateAppState}
          addSite={addSite}
          removeSite={removeSite}
          updateSite={updateSite}
        />
        
        <MainContent 
          appState={appState}
          updateAppState={updateAppState}
          markNotificationAsRead={markNotificationAsRead}
        />
      </div>
    </div>
  );
};

export default WorkspaceHub;