// Popup Script para Workspace Hub Extension

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Popup carregado');
  
  // Elementos do DOM
  const loading = document.getElementById('loading');
  const statusActive = document.getElementById('status-active');
  const stats = document.getElementById('stats');
  const daysActive = document.getElementById('days-active');
  
  // Adicionar event listeners aos botões
  document.getElementById('openWorkspaceBtn').addEventListener('click', openWorkspaceHub);
  document.getElementById('openExtensionsBtn').addEventListener('click', openExtensions);
  document.getElementById('testExtensionBtn').addEventListener('click', testExtension);
  
  try {
    // Verifica status da extensão
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    
    // Esconde loading
    loading.classList.add('hidden');
    
    if (response && response.active) {
      // Mostra status ativo
      statusActive.classList.remove('hidden');
      stats.classList.remove('hidden');
      
      // Calcula dias ativos
      if (response.installDate) {
        const installDate = new Date(response.installDate);
        const now = new Date();
        const diffTime = Math.abs(now - installDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        daysActive.textContent = diffDays;
      }
      
      console.log('✅ Extensão está ativa');
    } else {
      // Mostra erro
      loading.innerHTML = `
        <div class="feature">
          <div class="feature-icon">❌</div>
          <span>Erro ao verificar status da extensão</span>
        </div>
      `;
      loading.classList.remove('hidden');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    loading.innerHTML = `
      <div class="feature">
        <div class="feature-icon">⚠️</div>
        <span>Não foi possível verificar o status</span>
      </div>
    `;
  }
});

// Função para detectar e abrir Workspace Hub na URL correta
async function openWorkspaceHub() {
  try {
    // Lista de possíveis URLs onde o Workspace Hub pode estar rodando
    const possibleUrls = [
      'https://workspace-hub-pwa.vercel.app',
      'https://workspace-hub.netlify.app', 
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    // Primeiro, tenta encontrar uma aba já aberta com Workspace Hub
    const tabs = await chrome.tabs.query({});
    const workspaceTab = tabs.find(tab => 
      tab.url && (
        tab.url.includes('workspace-hub') ||
        tab.title?.includes('Workspace Hub') ||
        tab.url.includes('localhost:5173') ||
        tab.url.includes('localhost:3000')
      )
    );
    
    if (workspaceTab) {
      // Se encontrou uma aba, ativa ela
      await chrome.tabs.update(workspaceTab.id, { active: true });
      await chrome.windows.update(workspaceTab.windowId, { focused: true });
      console.log('🎯 Aba do Workspace Hub encontrada e ativada');
      window.close();
      return;
    }
    
    // Se não encontrou, tenta abrir na primeira URL disponível
    let opened = false;
    
    for (const url of possibleUrls) {
      try {
        const newTab = await chrome.tabs.create({ url: url, active: true });
        if (newTab) {
          console.log(`🚀 Workspace Hub aberto em: ${url}`);
          opened = true;
          break;
        }
      } catch (error) {
        console.log(`❌ Falha ao abrir ${url}:`, error);
        continue;
      }
    }
    
    if (!opened) {
      // Fallback: abre uma página de ajuda
      const helpUrl = 'data:text/html,' + encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Workspace Hub - Ajuda</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 600px; 
              margin: 50px auto; 
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .container {
              background: rgba(255,255,255,0.1);
              padding: 40px;
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { margin-bottom: 20px; }
            .url-list { 
              text-align: left; 
              background: rgba(255,255,255,0.1);
              padding: 20px;
              border-radius: 10px;
              margin: 20px 0;
            }
            .url-list a {
              color: #fff;
              text-decoration: none;
              display: block;
              padding: 8px 0;
              border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .url-list a:hover {
              background: rgba(255,255,255,0.1);
              padding-left: 10px;
              transition: all 0.3s;
            }
            .help-text {
              font-size: 14px;
              opacity: 0.9;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 Workspace Hub</h1>
            <p>Não foi possível detectar automaticamente onde o Workspace Hub está rodando.</p>
            
            <div class="url-list">
              <h3>Tente uma dessas URLs:</h3>
              <a href="http://localhost:5173" target="_blank">http://localhost:5173</a>
              <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
              <a href="http://127.0.0.1:5173" target="_blank">http://127.0.0.1:5173</a>
            </div>
            
            <div class="help-text">
              <p><strong>💡 Dica:</strong> Se você está rodando o Workspace Hub localmente, certifique-se de que o servidor está ativo.</p>
              <p><strong>🔧 Como iniciar:</strong> Execute <code>npm run dev</code> na pasta do projeto.</p>
            </div>
          </div>
        </body>
        </html>
      `);
      
      await chrome.tabs.create({ url: helpUrl, active: true });
    }
    
    window.close();
    
  } catch (error) {
    console.error('❌ Erro ao abrir Workspace Hub:', error);
    
    // Fallback final: abre localhost:5173
    try {
      await chrome.tabs.create({ url: 'http://localhost:5173', active: true });
      window.close();
    } catch (finalError) {
      alert('❌ Não foi possível abrir o Workspace Hub. Verifique se o servidor está rodando em localhost:5173');
    }
  }
}

// Função para abrir página de extensões
function openExtensions() {
  chrome.tabs.create({ url: 'chrome://extensions/' });
  window.close();
}

// Função para testar a extensão
async function testExtension() {
  const testSites = [
    'https://mail.google.com',
    'https://web.whatsapp.com',
    'https://www.facebook.com',
    'https://app.pipedrive.com'
  ];
  
  const randomSite = testSites[Math.floor(Math.random() * testSites.length)];
  
  // Cria uma nova aba com um iframe de teste
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Teste Workspace Hub Extension</title>
      <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; 
          padding: 20px; 
          text-align: center; 
        }
        iframe { 
          width: 100%; 
          height: calc(100vh - 80px); 
          border: none; 
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🧪 Teste da Extensão Workspace Hub</h1>
        <p>Testando carregamento de: ${randomSite}</p>
      </div>
      <div class="loading">
        <p>Carregando site em iframe...</p>
        <p>Se carregar corretamente, a extensão está funcionando! ✅</p>
      </div>
      <iframe src="${randomSite}" onload="document.querySelector('.loading').style.display='none'"></iframe>
    </body>
    </html>
  `;
  
  const blob = new Blob([testHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  chrome.tabs.create({ url: url });
  window.close();
}

// Adiciona listeners para teclas de atalho
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    openWorkspaceHub();
  } else if (e.key === 'Escape') {
    window.close();
  }
});