import React from 'react';
import { AppState } from '../../types';
import Dashboard from './Dashboard';
import SiteView from './SiteView';

interface MainContentProps {
  appState: AppState;
  updateAppState: (updates: Partial<AppState>) => void;
  markNotificationAsRead: (notificationId: number) => void;
}

const MainContent: React.FC<MainContentProps> = ({ 
  appState, 
  updateAppState, 
  markNotificationAsRead 
}) => {
  return (
    <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {appState.currentView === 'dashboard' ? (
        <Dashboard 
          appState={appState}
          updateAppState={updateAppState}
          markNotificationAsRead={markNotificationAsRead}
        />
      ) : appState.currentSite ? (
        <SiteView 
          site={appState.currentSite}
          isDarkMode={appState.isDarkMode}
        />
      ) : null}
    </main>
  );
};

export default MainContent;