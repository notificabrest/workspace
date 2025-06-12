export const generateChromeExtension = () => {
  const manifest = {
    "manifest_version": 3,
    "name": "Workspace Hub - Iframe Unlocker",
    "version": "1.0.0",
    "description": "Remove iframe restrictions for Workspace Hub",
    "permissions": [
      "webRequest",
      "webRequestBlocking",
      "storage",
      "activeTab"
    ],
    "host_permissions": [
      "<all_urls>"
    ],
    "background": {
      "service_worker": "background.js"
    },
    "content_scripts": [{
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "all_frames": true,
      "run_at": "document_start"
    }],
    "web_accessible_resources": [{
      "resources": ["*"],
      "matches": ["<all_urls>"]
    }],
    "action": {
      "default_popup": "popup.html",
      "default_title": "Workspace Hub Extension"
    }
  };

  const background = `
// Remove headers that prevent iframe embedding
chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const headers = details.responseHeaders || [];
    
    // Filter out problematic headers
    const filteredHeaders = headers.filter(header => {
      const name = header.name.toLowerCase();
      return name !== 'x-frame-options' && 
             name !== 'content-security-policy' &&
             name !== 'x-content-type-options';
    });
    
    // Add permissive headers
    filteredHeaders.push({
      name: 'X-Frame-Options',
      value: 'ALLOWALL'
    });
    
    return { responseHeaders: filteredHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "responseHeaders"]
);

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Workspace Hub Extension installed');
});
  `;

  const content = `
// Prevent frame-busting scripts
(function() {
  'use strict';
  
  // Override window properties that detect iframe
  if (window.top !== window.self) {
    try {
      Object.defineProperty(window, 'top', {
        get: function() { return window.self; },
        configurable: false
      });
      
      Object.defineProperty(window, 'parent', {
        get: function() { return window.self; },
        configurable: false
      });
      
      Object.defineProperty(window, 'frameElement', {
        get: function() { return null; },
        configurable: false
      });
    } catch (e) {
      console.log('Could not override window properties:', e);
    }
  }
  
  // Block common frame-busting patterns
  const originalSetTimeout = window.setTimeout;
  const originalSetInterval = window.setInterval;
  
  window.setTimeout = function(callback, delay) {
    if (typeof callback === 'string' && 
        (callback.includes('top.location') || 
         callback.includes('parent.location') ||
         callback.includes('window.top'))) {
      return;
    }
    return originalSetTimeout.apply(this, arguments);
  };
  
  window.setInterval = function(callback, delay) {
    if (typeof callback === 'string' && 
        (callback.includes('top.location') || 
         callback.includes('parent.location') ||
         callback.includes('window.top'))) {
      return;
    }
    return originalSetInterval.apply(this, arguments);
  };
})();
  `;

  const popup = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { width: 300px; padding: 20px; font-family: Arial, sans-serif; }
    .header { text-align: center; margin-bottom: 20px; }
    .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
    .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    button { width: 100%; padding: 10px; margin: 5px 0; border: none; border-radius: 5px; cursor: pointer; }
    .primary { background: #007bff; color: white; }
    .primary:hover { background: #0056b3; }
  </style>
</head>
<body>
  <div class="header">
    <h3>🚀 Workspace Hub</h3>
    <p>Extensão para remover restrições de iframe</p>
  </div>
  
  <div class="status success">
    ✅ Extensão ativa e funcionando!
  </div>
  
  <div class="status info">
    ℹ️ Esta extensão remove headers X-Frame-Options e CSP que impedem sites de carregar em iframes.
  </div>
  
  <button class="primary" onclick="openWorkspaceHub()">
    Abrir Workspace Hub
  </button>
  
  <script>
    function openWorkspaceHub() {
      chrome.tabs.create({ url: 'http://localhost:5173' });
    }
  </script>
</body>
</html>
  `;

  return { manifest, background, content, popup };
};

export const downloadChromeExtension = () => {
  const { manifest, background, content, popup } = generateChromeExtension();
  
  // Create downloadable files
  const files = [
    { name: 'manifest.json', content: JSON.stringify(manifest, null, 2), type: 'application/json' },
    { name: 'background.js', content: background, type: 'application/javascript' },
    { name: 'content.js', content: content, type: 'application/javascript' },
    { name: 'popup.html', content: popup, type: 'text/html' }
  ];
  
  files.forEach((file, index) => {
    setTimeout(() => {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, index * 200);
  });
  
  // Show installation instructions
  setTimeout(() => {
    alert(`🚀 Extensão do Chrome baixada com sucesso!

📋 INSTRUÇÕES DE INSTALAÇÃO:

1. Abra o Chrome e vá para: chrome://extensions/
2. Ative o "Modo do desenvolvedor" (canto superior direito)
3. Clique em "Carregar sem compactação"
4. Selecione a pasta onde salvou os arquivos baixados
5. A extensão será instalada automaticamente
6. Recarregue esta página do Workspace Hub

✨ COMO FUNCIONA:
- Remove headers X-Frame-Options
- Bloqueia scripts que detectam iframes
- Permite carregar qualquer site no Workspace Hub

⚠️ IMPORTANTE:
- Use apenas em sites confiáveis
- A extensão funciona apenas no Chrome/Edge
- Mantenha-a ativa enquanto usar o Workspace Hub`);
  }, 1000);
};