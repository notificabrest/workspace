export interface Site {
  id: number;
  name: string;
  url: string;
  icon: string;
  color: string;
  category: string;
  notifications: number;
}

export interface Notification {
  id: number;
  site: string;
  message: string;
  time: string;
  read: boolean;
}

export interface AppState {
  currentView: 'dashboard' | 'site';
  currentSite: Site | null;
  searchQuery: string;
  isDarkMode: boolean;
  companyName: string;
  sidebarCollapsed: boolean;
  sites: Site[];
  notifications: Notification[];
}