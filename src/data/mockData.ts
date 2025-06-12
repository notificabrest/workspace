import { Site, Notification } from '../types';

export const defaultSites: Site[] = [
  // Trabalho
  { 
    id: 1, 
    name: 'Pipedrive', 
    url: 'https://app.pipedrive.com', 
    icon: 'P', 
    color: '#ff6b35', 
    category: 'Trabalho', 
    notifications: 3 
  },
  { 
    id: 2, 
    name: 'Gmail', 
    url: 'https://mail.google.com', 
    icon: '✉', 
    color: '#ea4335', 
    category: 'Trabalho', 
    notifications: 12 
  },
  { 
    id: 3, 
    name: 'PABX', 
    url: 'https://example.com', 
    icon: '📞', 
    color: '#0ea5e9', 
    category: 'Trabalho', 
    notifications: 0 
  },
  { 
    id: 4, 
    name: 'Trello', 
    url: 'https://trello.com', 
    icon: 'T', 
    color: '#0079bf', 
    category: 'Trabalho', 
    notifications: 2 
  },
  
  // Comunicação
  { 
    id: 5, 
    name: 'WhatsApp', 
    url: 'https://web.whatsapp.com', 
    icon: '📱', 
    color: '#25d366', 
    category: 'Comunicação', 
    notifications: 7 
  },
  { 
    id: 6, 
    name: 'Slack', 
    url: 'https://slack.com', 
    icon: 'S', 
    color: '#4a154b', 
    category: 'Comunicação', 
    notifications: 0 
  },
  { 
    id: 7, 
    name: 'Teams', 
    url: 'https://teams.microsoft.com', 
    icon: 'T', 
    color: '#6264a7', 
    category: 'Comunicação', 
    notifications: 0 
  },
  
  // Ferramentas
  { 
    id: 8, 
    name: 'Analytics', 
    url: 'https://analytics.google.com', 
    icon: '📈', 
    color: '#ff9500', 
    category: 'Ferramentas', 
    notifications: 0 
  },
  { 
    id: 9, 
    name: 'Canva', 
    url: 'https://canva.com', 
    icon: 'C', 
    color: '#00c4cc', 
    category: 'Ferramentas', 
    notifications: 0 
  },
  // Sites que funcionam bem em iframe para teste
  { 
    id: 10, 
    name: 'Wikipedia', 
    url: 'https://pt.wikipedia.org', 
    icon: 'W', 
    color: '#000000', 
    category: 'Ferramentas', 
    notifications: 0 
  },
  { 
    id: 11, 
    name: 'CodePen', 
    url: 'https://codepen.io', 
    icon: 'C', 
    color: '#47cf73', 
    category: 'Ferramentas', 
    notifications: 0 
  },
  { 
    id: 12, 
    name: 'MDN Docs', 
    url: 'https://developer.mozilla.org', 
    icon: 'M', 
    color: '#005a9c', 
    category: 'Ferramentas', 
    notifications: 0 
  },
];

export const defaultNotifications: Notification[] = [
  { 
    id: 1, 
    site: 'Pipedrive', 
    message: '3 novos leads aguardando', 
    time: '2 min', 
    read: false 
  },
  { 
    id: 2, 
    site: 'Gmail', 
    message: '12 emails não lidos', 
    time: '5 min', 
    read: false 
  },
  { 
    id: 3, 
    site: 'WhatsApp', 
    message: '7 mensagens pendentes', 
    time: '10 min', 
    read: false 
  },
  { 
    id: 4, 
    site: 'Trello', 
    message: '2 tarefas vencidas', 
    time: '1h', 
    read: false 
  },
];