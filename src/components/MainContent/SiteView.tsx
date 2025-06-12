import React, { useState, useEffect } from 'react';
import { RefreshCw, Maximize, Settings, ExternalLink, AlertCircle, Globe, Shield, Zap, Chrome, Download, Code } from 'lucide-react';
import { Site } from '../../types';
import ExtensionDownloader from '../ExtensionDownloader/ExtensionDownloader';

interface SiteViewProps {
  site: Site;
  isDarkMode: boolean;
}

const SiteView: React.FC<SiteViewProps> = ({ site, isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [useProxy, setUseProxy] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showExtensionDownloader, setShowExtensionDownloader] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (site.url && !isIframeCompatible(site.url) && !useProxy) {
        setHasError(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [site.id, iframeKey, useProxy]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setIframeKey(prev => prev + 1);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    if (site.url) {
      window.open(site.url, '_blank', 'noopener,noreferrer');
    }
  };

  const openInPopup = () => {
    if (site.url) {
      const width = 1200;
      const height = 800;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      const popup = window.open(
        site.url, 
        `${site.name.replace(/\s+/g, '_')}_popup`,
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=yes,menubar=no,location=yes,status=no`
      );
      
      if (popup) {
        popup.focus();
      } else {
        alert('Popup bloqueado! Por favor, permita popups para este site e tente novamente.');
      }
    }
  };

  // Função para tentar carregar com proxy/CORS bypass
  const loadWithProxy = () => {
    setUseProxy(true);
    setHasError(false);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  // Check if URL is likely to work in iframe
  const isIframeCompatible = (url: string) => {
    if (!url) return false;
    
    const incompatibleDomains = [
      'google.com', 'gmail.com', 'mail.google.com',
      'facebook.com', 'twitter.com', 'x.com',
      'linkedin.com', 'microsoft.com', 'office.com',
      'github.com', 'stackoverflow.com', 'youtube.com',
      'instagram.com', 'tiktok.com', 'whatsapp.com',
      'web.whatsapp.com', 'teams.microsoft.com',
      'slack.com', 'discord.com', 'zoom.us',
      'pipedrive.com', 'app.pipedrive.com'
    ];
    
    try {
      const domain = new URL(url).hostname.toLowerCase();
      return !incompatibleDomains.some(incompatible => domain.includes(incompatible));
    } catch {
      return false;
    }
  };

  // Proxy URLs para tentar contornar CORS
  const getProxyUrl = (originalUrl: string) => {
    const proxyServices = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`,
      `https://cors-anywhere.herokuapp.com/${originalUrl}`,
      `https://thingproxy.freeboard.io/fetch/${originalUrl}`
    ];
    
    return proxyServices[0]; // Use the first one by default
  };

  const shouldShowIframe = site.url && !hasError && (isIframeCompatible(site.url) || useProxy);
  const isKnownIncompatible = site.url && !isIframeCompatible(site.url) && !useProxy;
  const finalUrl = useProxy && site.url ? getProxyUrl(site.url) : site.url;

  return (
    <div className={`flex-1 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
      {/* Site Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: site.color }}
          >
            {site.icon}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{site.name}</h2>
            {site.url && (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Globe size={12} />
                {new URL(site.url).hostname}
                {useProxy && <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-1 rounded">via proxy</span>}
              </p>
            )}
          </div>
          {isKnownIncompatible && (
            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
              <Shield size={12} />
              Iframe restrito
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Atualizar"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          
          <button 
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Opções avançadas"
          >
            <Code size={16} />
          </button>
          
          <button 
            onClick={handleFullscreen}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
          >
            <Maximize size={16} />
          </button>
          
          {site.url && (
            <>
              <button 
                onClick={openInNewTab}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm"
                title="Abrir em nova aba"
              >
                <ExternalLink size={14} />
                Nova Aba
              </button>
              <button 
                onClick={openInPopup}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                title="Abrir em popup"
              >
                <Zap size={14} />
                Popup
              </button>
            </>
          )}
          
          <button 
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Configurações"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Advanced Options Panel */}
      {showAdvancedOptions && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 p-4">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Code size={16} />
            Opções Avançadas para Contornar Restrições
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={loadWithProxy}
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm"
            >
              <Globe size={16} className="text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Tentar com Proxy</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Contorna CORS via proxy</div>
              </div>
            </button>

            <button
              onClick={() => setShowExtensionDownloader(true)}
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm"
            >
              <Chrome size={16} className="text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Baixar Extensão</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Solução definitiva</div>
              </div>
            </button>

            <button
              onClick={() => {
                if (site.url) {
                  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
                  window.open(`data:text/html,<iframe src="${site.url}" style="width:100%;height:100vh;border:none;" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"></iframe>`, '_blank');
                }
              }}
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-sm"
            >
              <Shield size={16} className="text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Modo Sandbox</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Iframe com sandbox</div>
              </div>
            </button>
          </div>

          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              <strong>💡 Dica:</strong> A extensão do Chrome é a solução mais eficaz para sites com restrições de iframe. 
              Ela remove os headers X-Frame-Options e CSP que impedem o carregamento.
            </p>
          </div>
        </div>
      )}

      {/* Site Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
        {isLoading ? (
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Carregando {site.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {useProxy ? 'Tentando carregar via proxy...' : 'Verificando compatibilidade...'}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {site.url && `Acessando: ${new URL(site.url).hostname}`}
            </div>
          </div>
        ) : hasError || isKnownIncompatible || !site.url ? (
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {!site.url ? 'URL não configurada' : 'Site com restrições de iframe'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {!site.url 
                ? 'Este site não possui uma URL configurada.'
                : 'Este site bloqueia iframes por segurança. Use as opções avançadas ou alternativas abaixo:'
              }
            </p>
            
            {site.url && (
              <>
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    onClick={openInNewTab}
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Abrir em Nova Aba (Recomendado)
                  </button>
                  <button
                    onClick={openInPopup}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    Abrir em Janela Popup
                  </button>
                  <button
                    onClick={loadWithProxy}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Globe size={16} />
                    Tentar com Proxy CORS
                  </button>
                  <button
                    onClick={() => setShowExtensionDownloader(true)}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Chrome size={16} />
                    Baixar Extensão do Chrome
                  </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informações do Site:</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">URL: {site.url}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Domínio: {new URL(site.url).hostname}</p>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    🚀 <strong>Solução Definitiva:</strong> Use a extensão do Chrome para remover todas as restrições de iframe. 
                    Ela modifica os headers de resposta para permitir o carregamento em qualquer iframe.
                  </p>
                </div>
              </>
            )}
          </div>
        ) : shouldShowIframe ? (
          <div className="w-full h-full flex flex-col">
            <iframe
              key={iframeKey}
              src={finalUrl}
              className="w-full h-full border-0"
              title={site.name}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        ) : (
          <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Site não configurado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Configure uma URL para este site para começar a usá-lo.
            </p>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Configurar URL
            </button>
          </div>
        )}
      </div>

      {/* Extension Downloader Modal */}
      {showExtensionDownloader && (
        <ExtensionDownloader />
      )}
    </div>
  );
};

export default SiteView;