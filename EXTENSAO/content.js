// Workspace Hub Extension - Content Script
// Bloqueia scripts que detectam iframe e tentam fazer frame-busting

(function() {
  'use strict';
  
  console.log('🚀 Workspace Hub Extension: Content script carregado em', window.location.hostname);
  
  // Só executa se estivermos em um iframe
  if (window.top !== window.self) {
    console.log('📱 Detectado iframe, aplicando proteções...');
    
    // Função para tentar redefinir propriedades de forma segura
    function safeDefineProperty(obj, prop, descriptor) {
      try {
        // Verifica se a propriedade já existe e é configurável
        const currentDescriptor = Object.getOwnPropertyDescriptor(obj, prop);
        if (currentDescriptor && !currentDescriptor.configurable) {
          console.log(`🔒 Propriedade ${prop} já está protegida e não é configurável`);
          return false;
        }
        
        Object.defineProperty(obj, prop, descriptor);
        console.log(`🛡️ Propriedade ${prop} redefinida com sucesso`);
        return true;
      } catch (e) {
        console.log(`⚠️ Não foi possível redefinir ${prop}:`, e.message);
        return false;
      }
    }
    
    // Tenta redefinir propriedades do window que detectam iframe
    safeDefineProperty(window, 'top', {
      get: function() { 
        console.log('🛡️ Bloqueado acesso a window.top');
        return window.self; 
      },
      configurable: true
    });
    
    safeDefineProperty(window, 'parent', {
      get: function() { 
        console.log('🛡️ Bloqueado acesso a window.parent');
        return window.self; 
      },
      configurable: true
    });
    
    safeDefineProperty(window, 'frameElement', {
      get: function() { 
        console.log('🛡️ Bloqueado acesso a frameElement');
        return null; 
      },
      configurable: true
    });
    
    // Método alternativo: interceptar acessos via Proxy (se as propriedades não puderem ser redefinidas)
    try {
      if (window.top === window.parent && window.top !== window.self) {
        // Se as propriedades não foram redefinidas com sucesso, usa uma abordagem diferente
        console.log('🔄 Usando método alternativo de proteção...');
        
        // Intercepta tentativas de acesso via toString
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
          const result = originalToString.call(this);
          if (result.includes('window.top') || result.includes('window.parent')) {
            console.log('🚫 Bloqueado acesso via toString');
            return 'function() { [native code] }';
          }
          return result;
        };
      }
    } catch (e) {
      console.log('⚠️ Método alternativo falhou:', e.message);
    }
    
    // Bloqueia tentativas de redirecionamento
    try {
      const originalReplace = window.location.replace;
      const originalAssign = window.location.assign;
      
      window.location.replace = function(url) {
        if (typeof url === 'string' && (
          url.includes('top.location') || 
          url.includes('parent.location') ||
          url.includes('window.top')
        )) {
          console.log('🚫 Bloqueado redirecionamento via location.replace:', url);
          return;
        }
        return originalReplace.call(this, url);
      };
      
      window.location.assign = function(url) {
        if (typeof url === 'string' && (
          url.includes('top.location') || 
          url.includes('parent.location') ||
          url.includes('window.top')
        )) {
          console.log('🚫 Bloqueado redirecionamento via location.assign:', url);
          return;
        }
        return originalAssign.call(this, url);
      };
      
      console.log('✅ Proteções de redirecionamento aplicadas');
      
    } catch (e) {
      console.warn('⚠️ Não foi possível proteger location:', e.message);
    }
  }
  
  // Bloqueia padrões comuns de frame-busting
  try {
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    
    window.setTimeout = function(callback, delay) {
      if (typeof callback === 'string') {
        const callbackLower = callback.toLowerCase();
        if (callbackLower.includes('top.location') || 
            callbackLower.includes('parent.location') ||
            callbackLower.includes('window.top') ||
            callbackLower.includes('framebusting') ||
            callbackLower.includes('frame-busting')) {
          console.log('🚫 Bloqueado setTimeout frame-busting:', callback);
          return setTimeout(() => {}, delay); // Retorna um timer válido mas vazio
        }
      }
      return originalSetTimeout.apply(this, arguments);
    };
    
    window.setInterval = function(callback, delay) {
      if (typeof callback === 'string') {
        const callbackLower = callback.toLowerCase();
        if (callbackLower.includes('top.location') || 
            callbackLower.includes('parent.location') ||
            callbackLower.includes('window.top') ||
            callbackLower.includes('framebusting') ||
            callbackLower.includes('frame-busting')) {
          console.log('🚫 Bloqueado setInterval frame-busting:', callback);
          return setInterval(() => {}, delay); // Retorna um timer válido mas vazio
        }
      }
      return originalSetInterval.apply(this, arguments);
    };
    
    console.log('✅ Proteções de timer aplicadas');
    
  } catch (e) {
    console.warn('⚠️ Não foi possível proteger timers:', e.message);
  }
  
  // Bloqueia tentativas de detecção de iframe via document
  try {
    const originalWrite = document.write;
    const originalWriteln = document.writeln;
    
    document.write = function(content) {
      if (typeof content === 'string') {
        const contentLower = content.toLowerCase();
        if (contentLower.includes('top.location') || 
            contentLower.includes('parent.location') ||
            contentLower.includes('framebusting')) {
          console.log('🚫 Bloqueado document.write frame-busting');
          return;
        }
      }
      return originalWrite.apply(this, arguments);
    };
    
    document.writeln = function(content) {
      if (typeof content === 'string') {
        const contentLower = content.toLowerCase();
        if (contentLower.includes('top.location') || 
            contentLower.includes('parent.location') ||
            contentLower.includes('framebusting')) {
          console.log('🚫 Bloqueado document.writeln frame-busting');
          return;
        }
      }
      return originalWriteln.apply(this, arguments);
    };
    
    console.log('✅ Proteções de document aplicadas');
    
  } catch (e) {
    console.warn('⚠️ Não foi possível proteger document:', e.message);
  }
  
  // Intercepta criação de elementos script maliciosos
  try {
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && typeof value === 'string') {
            const valueLower = value.toLowerCase();
            if (valueLower.includes('framebusting') || 
                valueLower.includes('frame-busting') ||
                valueLower.includes('anti-iframe')) {
              console.log('🚫 Bloqueado script frame-busting:', value);
              return;
            }
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
    
    console.log('✅ Proteções de createElement aplicadas');
    
  } catch (e) {
    console.warn('⚠️ Não foi possível proteger createElement:', e.message);
  }
  
  // Adiciona CSS para esconder elementos que podem causar problemas
  try {
    const style = document.createElement('style');
    style.textContent = `
      /* Esconde elementos comuns de frame-busting */
      [id*="framebusting"], [class*="framebusting"],
      [id*="frame-busting"], [class*="frame-busting"],
      [id*="anti-iframe"], [class*="anti-iframe"] {
        display: none !important;
      }
      
      /* Esconde scripts que tentam detectar iframe */
      script[src*="framebusting"],
      script[src*="frame-busting"],
      script[src*="anti-iframe"] {
        display: none !important;
      }
    `;
    
    if (document.head) {
      document.head.appendChild(style);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.head) {
          document.head.appendChild(style);
        }
      });
    }
    
    console.log('✅ CSS de proteção aplicado');
    
  } catch (e) {
    console.warn('⚠️ Não foi possível aplicar CSS de proteção:', e.message);
  }
  
  // Intercepta eval para bloquear código frame-busting dinâmico
  try {
    const originalEval = window.eval;
    window.eval = function(code) {
      if (typeof code === 'string') {
        const codeLower = code.toLowerCase();
        if (codeLower.includes('top.location') || 
            codeLower.includes('parent.location') ||
            codeLower.includes('window.top') ||
            codeLower.includes('framebusting')) {
          console.log('🚫 Bloqueado eval frame-busting:', code.substring(0, 100));
          return;
        }
      }
      return originalEval.call(this, code);
    };
    
    console.log('✅ Proteção eval aplicada');
    
  } catch (e) {
    console.warn('⚠️ Não foi possível proteger eval:', e.message);
  }
  
  console.log('✅ Workspace Hub Extension: Todas as proteções foram aplicadas');
  
})();