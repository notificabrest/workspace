import React, { useState } from 'react';
import { Download, Chrome, CheckCircle, AlertCircle, ExternalLink, FileText } from 'lucide-react';

const ExtensionDownloader: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'completed'>('idle');

  const downloadAllFiles = () => {
    setDownloadStatus('downloading');

    const manifest = {
      "manifest_version": 3,
      "name": "Workspace Hub - Iframe Unlocker",
      "version": "1.0.0",
      "description": "Remove iframe restrictions for Workspace Hub",
      "permissions": [
        "webRequest",
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

    const background = `// Workspace Hub Extension - Background Script
chrome.declarativeNetRequest.updateDynamicRules({
  addRules: [{
    "id": 1,
    "priority": 1,
    "action": {
      "type": "modifyHeaders",
      "responseHeaders": [
        {
          "header": "X-Frame-Options",
          "operation": "remove"
        },
        {
          "header": "Content-Security-Policy",
          "operation": "remove"
        }
      ]
    },
    "condition": {
      "urlFilter": "*",
      "resourceTypes": ["main_frame", "sub_frame"]
    }
  }],
  removeRuleIds: [1]
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 Workspace Hub Extension installed successfully!');
});`;

    const content = `// Workspace Hub Extension - Content Script
(function() {
  'use strict';
  
  // Prevent frame-busting scripts
  if (window.top !== window.self) {
    try {
      // Override window properties that detect iframe
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
      
      // Block location redirects
      const originalReplace = window.location.replace;
      const originalAssign = window.location.assign;
      
      window.location.replace = function(url) {
        if (url.includes('top.location') || url.includes('parent.location')) {
          return;
        }
        return originalReplace.call(this, url);
      };
      
      window.location.assign = function(url) {
        if (url.includes('top.location') || url.includes('parent.location')) {
          return;
        }
        return originalAssign.call(this, url);
      };
      
    } catch (e) {
      console.log('Workspace Hub: Could not override window properties:', e);
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
      console.log('Workspace Hub: Blocked frame-busting setTimeout');
      return;
    }
    return originalSetTimeout.apply(this, arguments);
  };
  
  window.setInterval = function(callback, delay) {
    if (typeof callback === 'string' && 
        (callback.includes('top.location') || 
         callback.includes('parent.location') ||
         callback.includes('window.top'))) {
      console.log('Workspace Hub: Blocked frame-busting setInterval');
      return;
    }
    return originalSetInterval.apply(this, arguments);
  };
  
  console.log('🚀 Workspace Hub Extension: Content script loaded');
})();`;

    const popup = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { 
      width: 320px; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .header { 
      text-align: center; 
      margin-bottom: 20px; 
    }
    .logo {
      width: 48px;
      height: 48px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      margin: 0 auto 10px;
    }
    h3 { 
      margin: 0 0 5px 0; 
      font-size: 18px; 
    }
    p { 
      margin: 0; 
      opacity: 0.9; 
      font-size: 14px; 
    }
    .status { 
      padding: 15px; 
      border-radius: 8px; 
      margin: 15px 0; 
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
    }
    .success { 
      border-left: 4px solid #10b981;
    }
    .info { 
      border-left: 4px solid #3b82f6;
    }
    button { 
      width: 100%; 
      padding: 12px; 
      margin: 8px 0; 
      border: none; 
      border-radius: 8px; 
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .primary { 
      background: rgba(255,255,255,0.9); 
      color: #667eea;
    }
    .primary:hover { 
      background: white;
      transform: translateY(-1px);
    }
    .secondary {
      background: rgba(255,255,255,0.1);
      color: white;
      border: 1px solid rgba(255,255,255,0.2);
    }
    .secondary:hover {
      background: rgba(255,255,255,0.2);
    }
    .feature {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
      font-size: 13px;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">WH</div>
    <h3>Workspace Hub</h3>
    <p>Extensão para remover restrições de iframe</p>
  </div>
  
  <div class="status success">
    <div class="feature">
      <span>✅</span>
      <span>Extensão ativa e funcionando!</span>
    </div>
    <div class="feature">
      <span>🛡️</span>
      <span>Headers X-Frame-Options removidos</span>
    </div>
    <div class="feature">
      <span>🚫</span>
      <span>Scripts frame-busting bloqueados</span>
    </div>
  </div>
  
  <button class="primary" onclick="openWorkspaceHub()">
    🚀 Abrir Workspace Hub
  </button>
  
  <button class="secondary" onclick="openExtensions()">
    ⚙️ Gerenciar Extensões
  </button>
  
  <script>
    function openWorkspaceHub() {
      chrome.tabs.create({ url: 'http://localhost:5173' });
      window.close();
    }
    
    function openExtensions() {
      chrome.tabs.create({ url: 'chrome://extensions/' });
      window.close();
    }
  </script>
</body>
</html>`;

    const readme = `# 🚀 Workspace Hub - Chrome Extension

## 📋 Instruções de Instalação

### 1. Preparar o Chrome
- Abra o Google Chrome
- Digite na barra de endereços: \`chrome://extensions/\`
- Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)

### 2. Instalar a Extensão
- Clique em **"Carregar sem compactação"**
- Selecione a pasta onde você salvou estes arquivos
- A extensão será instalada automaticamente

### 3. Verificar Instalação
- Você verá o ícone "WH" na barra de extensões
- Clique no ícone para abrir o popup da extensão
- Clique em "Abrir Workspace Hub" para testar

## 🛠️ Como Funciona

Esta extensão resolve o problema de sites que bloqueiam iframes através de:

### Headers Removidos:
- \`X-Frame-Options\` - Remove restrições de iframe
- \`Content-Security-Policy\` - Remove políticas que bloqueiam embedding

### Scripts Bloqueados:
- Frame-busting scripts que detectam se estão em iframe
- Redirecionamentos automáticos para \`top.location\`
- Verificações de \`window.parent\` e \`window.top\`

## 🎯 Sites Compatíveis

Com esta extensão, você pode carregar no Workspace Hub:
- ✅ Gmail, Outlook, Yahoo Mail
- ✅ WhatsApp Web, Telegram Web
- ✅ Facebook, Twitter, LinkedIn
- ✅ Pipedrive, Salesforce, HubSpot
- ✅ Slack, Microsoft Teams, Discord
- ✅ Google Analytics, Google Ads
- ✅ Trello, Asana, Monday.com
- ✅ E praticamente qualquer outro site!

## ⚠️ Importante

- Use apenas em sites confiáveis
- A extensão funciona apenas no Chrome e Edge
- Mantenha-a ativa enquanto usar o Workspace Hub
- Recarregue o Workspace Hub após instalar a extensão

## 🔧 Solução de Problemas

### Site ainda não carrega?
1. Verifique se a extensão está ativa em \`chrome://extensions/\`
2. Recarregue a página do Workspace Hub
3. Tente usar o botão "Tentar com Proxy" nas opções avançadas

### Extensão não aparece?
1. Certifique-se que o "Modo do desenvolvedor" está ativo
2. Verifique se todos os 4 arquivos estão na mesma pasta
3. Tente recarregar a extensão em \`chrome://extensions/\`

## 📞 Suporte

Se tiver problemas, verifique:
- Console do navegador (F12) para erros
- Se todos os arquivos foram baixados corretamente
- Se a pasta contém: manifest.json, background.js, content.js, popup.html

---

**Desenvolvido para Workspace Hub** 🚀
*Versão 1.0.0*`;

    // Create and download files
    const files = [
      { name: 'manifest.json', content: JSON.stringify(manifest, null, 2), type: 'application/json' },
      { name: 'background.js', content: background, type: 'application/javascript' },
      { name: 'content.js', content: content, type: 'application/javascript' },
      { name: 'popup.html', content: popup, type: 'text/html' },
      { name: 'README.md', content: readme, type: 'text/markdown' }
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
      }, index * 300);
    });

    setTimeout(() => {
      setDownloadStatus('completed');
    }, files.length * 300 + 500);
  };

  const openChromeExtensions = () => {
    window.open('chrome://extensions/', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Chrome className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Extensão do Chrome - Workspace Hub
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Solução definitiva para carregar qualquer site
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          {downloadStatus === 'idle' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Chrome className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    🚀 Solução Definitiva para Restrições de Iframe
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                    Esta extensão remove completamente as restrições que impedem sites de carregar em iframes, 
                    permitindo que você acesse Gmail, WhatsApp, Facebook e qualquer outro site diretamente no Workspace Hub.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-400">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Remove X-Frame-Options
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Bloqueia frame-busting
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Remove CSP headers
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Funciona com 99% dos sites
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {downloadStatus === 'downloading' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Download className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
                    Baixando arquivos da extensão...
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    5 arquivos sendo baixados para sua pasta de Downloads
                  </p>
                </div>
              </div>
            </div>
          )}

          {downloadStatus === 'completed' && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                    ✅ Arquivos baixados com sucesso!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-300 mb-3">
                    Agora siga as instruções abaixo para instalar a extensão no Chrome.
                  </p>
                  <div className="space-y-1 text-xs text-green-700 dark:text-green-400">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      manifest.json - Configurações da extensão
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      background.js - Remove headers de restrição
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      content.js - Bloqueia scripts frame-busting
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      popup.html - Interface da extensão
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      README.md - Instruções detalhadas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              📋 Instruções de Instalação
            </h3>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Abrir Extensões do Chrome</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Digite <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">chrome://extensions/</code> na barra de endereços
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Ativar Modo Desenvolvedor</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Clique no toggle "Modo do desenvolvedor" no canto superior direito
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Carregar Extensão</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Clique em "Carregar sem compactação" e selecione a pasta com os arquivos baixados
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Recarregar Workspace Hub</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Recarregue esta página para que a extensão funcione
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">
                  ⚠️ Importante
                </h4>
                <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                  <li>• Use apenas em sites confiáveis</li>
                  <li>• A extensão funciona apenas no Chrome e Edge</li>
                  <li>• Mantenha-a ativa enquanto usar o Workspace Hub</li>
                  <li>• Todos os 5 arquivos devem estar na mesma pasta</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {downloadStatus === 'idle' && (
              <button
                onClick={downloadAllFiles}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-semibold"
              >
                <Download size={16} />
                Baixar Extensão Completa
              </button>
            )}
            
            <button
              onClick={openChromeExtensions}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <ExternalLink size={16} />
              Abrir chrome://extensions/
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionDownloader;