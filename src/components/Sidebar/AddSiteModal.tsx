import React, { useState } from 'react';
import { X, Globe, Palette, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Site } from '../../types';

interface AddSiteModalProps {
  onClose: () => void;
  onAdd: (siteData: Omit<Site, 'id'>) => void;
}

const AddSiteModal: React.FC<AddSiteModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    color: '#6366f1',
    category: 'Ferramentas'
  });

  const [urlWarning, setUrlWarning] = useState('');
  const [urlStatus, setUrlStatus] = useState<'unknown' | 'compatible' | 'restricted'>('unknown');

  const categories = ['Trabalho', 'Comunicação', 'Ferramentas', 'Social', 'Pessoal'];
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1'
  ];

  // Sites que geralmente não funcionam em iframe
  const problematicDomains = [
    'google.com', 'gmail.com', 'mail.google.com',
    'facebook.com', 'twitter.com', 'x.com',
    'linkedin.com', 'microsoft.com', 'office.com',
    'github.com', 'stackoverflow.com', 'youtube.com',
    'instagram.com', 'tiktok.com', 'whatsapp.com',
    'web.whatsapp.com', 'teams.microsoft.com',
    'slack.com', 'discord.com', 'zoom.us',
    'pipedrive.com', 'app.pipedrive.com'
  ];

  // Sites que funcionam bem em iframe
  const compatibleDomains = [
    'wikipedia.org', 'codepen.io', 'jsfiddle.net',
    'developer.mozilla.org', 'w3schools.com', 'example.com'
  ];

  const checkUrlCompatibility = (url: string) => {
    if (!url) {
      setUrlWarning('');
      setUrlStatus('unknown');
      return;
    }

    try {
      const domain = new URL(url.startsWith('http') ? url : 'https://' + url).hostname.toLowerCase();
      
      const isProblematic = problematicDomains.some(problematic => domain.includes(problematic));
      const isCompatible = compatibleDomains.some(compatible => domain.includes(compatible));
      
      if (isProblematic) {
        setUrlStatus('restricted');
        setUrlWarning('⚠️ Este site provavelmente não funcionará em iframe devido a restrições de segurança. Você ainda pode adicioná-lo e usar as opções "Nova Aba" ou "Popup".');
      } else if (isCompatible) {
        setUrlStatus('compatible');
        setUrlWarning('✅ Este site deve funcionar bem em iframe!');
      } else {
        setUrlStatus('unknown');
        setUrlWarning('ℹ️ Compatibilidade desconhecida. O site será testado quando adicionado.');
      }
    } catch {
      setUrlWarning('❌ URL inválida. Verifique o formato.');
      setUrlStatus('unknown');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    // Auto-generate icon if not provided
    const icon = formData.icon || formData.name.charAt(0).toUpperCase();
    
    // Ensure URL has protocol
    let url = formData.url;
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    onAdd({
      name: formData.name.trim(),
      url: url,
      icon: icon,
      color: formData.color,
      category: formData.category,
      notifications: 0
    });

    onClose();
  };

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, url }));
    checkUrlCompatibility(url);
  };

  const handleUrlBlur = () => {
    if (formData.url && !formData.name) {
      // Try to extract domain name as site name
      try {
        const domain = new URL(formData.url.startsWith('http') ? formData.url : 'https://' + formData.url).hostname;
        const name = domain.replace('www.', '').split('.')[0];
        setFormData(prev => ({ 
          ...prev, 
          name: name.charAt(0).toUpperCase() + name.slice(1),
          icon: name.charAt(0).toUpperCase()
        }));
      } catch (e) {
        // Invalid URL, ignore
      }
    }
  };

  const getStatusIcon = () => {
    switch (urlStatus) {
      case 'compatible':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'restricted':
        return <AlertTriangle size={16} className="text-yellow-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (urlStatus) {
      case 'compatible':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'restricted':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getStatusTextColor = () => {
    switch (urlStatus) {
      case 'compatible':
        return 'text-green-700 dark:text-green-300';
      case 'restricted':
        return 'text-yellow-700 dark:text-yellow-300';
      default:
        return 'text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Adicionar Site</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Globe size={16} className="inline mr-2" />
              URL do Site
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleUrlBlur}
              placeholder="https://exemplo.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {urlWarning && (
              <div className={`mt-2 p-3 border rounded-lg ${getStatusColor()}`}>
                <div className="flex items-start gap-2">
                  {getStatusIcon()}
                  <p className={`text-sm ${getStatusTextColor()}`}>{urlWarning}</p>
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Site
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome que aparecerá na sidebar"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ícone (emoji ou letra)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value.slice(0, 2) }))}
              placeholder="📊 ou A"
              maxLength={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Palette size={16} className="inline mr-2" />
              Cor
            </label>
            <div className="grid grid-cols-8 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color 
                      ? 'border-gray-900 dark:border-white scale-110' 
                      : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: formData.color }}
              >
                {formData.icon || formData.name.charAt(0).toUpperCase() || '?'}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {formData.name || 'Nome do Site'}
              </span>
              {urlStatus === 'restricted' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
                  <AlertTriangle size={10} />
                  Iframe restrito
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 <strong>Dica:</strong> Sites como Gmail, WhatsApp, Facebook bloqueiam iframes por segurança. 
              Eles ainda funcionarão usando "Nova Aba" ou "Popup".
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSiteModal;