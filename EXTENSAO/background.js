// Workspace Hub Extension - Background Script
// Remove headers que impedem iframe embedding

console.log('🚀 Workspace Hub Extension: Background script iniciado');

// Regras para remover headers problemáticos
const rules = [
  {
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
        },
        {
          "header": "X-Content-Type-Options",
          "operation": "remove"
        }
      ]
    },
    "condition": {
      "urlFilter": "*",
      "resourceTypes": ["main_frame", "sub_frame"]
    }
  }
];

// Aplicar regras quando a extensão é instalada
chrome.runtime.onInstalled.addListener(async () => {
  console.log('🚀 Workspace Hub Extension instalada com sucesso!');
  
  try {
    // Remove regras existentes e adiciona novas
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: rules
    });
    
    console.log('✅ Regras de remoção de headers aplicadas');
    
    // Salva configurações
    await chrome.storage.local.set({
      extensionActive: true,
      installDate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erro ao aplicar regras:', error);
  }
});

// Listener para quando a extensão é iniciada
chrome.runtime.onStartup.addListener(async () => {
  console.log('🔄 Workspace Hub Extension reiniciada');
  
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1],
      addRules: rules
    });
    console.log('✅ Regras reaplicadas após reinicialização');
  } catch (error) {
    console.error('❌ Erro ao reaplicar regras:', error);
  }
});

// Listener para mensagens do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    chrome.storage.local.get(['extensionActive', 'installDate'], (result) => {
      sendResponse({
        active: result.extensionActive || false,
        installDate: result.installDate || null
      });
    });
    return true; // Indica resposta assíncrona
  }
  
  if (request.action === 'openWorkspaceHub') {
    // Tenta detectar onde o Workspace Hub está rodando
    const possibleUrls = [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ];
    
    // Abre na primeira URL (padrão do Vite)
    chrome.tabs.create({ url: possibleUrls[0] });
    sendResponse({ success: true });
  }
});

// Log de debug para verificar se está funcionando
setInterval(() => {
  console.log('🔍 Workspace Hub Extension: Monitorando headers...');
}, 60000); // Log a cada minuto