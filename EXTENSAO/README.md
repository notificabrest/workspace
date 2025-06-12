# 🚀 Workspace Hub - Chrome Extension

## 📋 Instruções de Instalação

### 1. Preparar o Chrome
- Abra o Google Chrome ou Microsoft Edge
- Digite na barra de endereços: `chrome://extensions/`
- Ative o **"Modo do desenvolvedor"** (toggle no canto superior direito)

### 2. Instalar a Extensão
- Clique em **"Carregar sem compactação"**
- Selecione a pasta **EXTENSAO** que contém todos estes arquivos
- A extensão será instalada automaticamente

### 3. Verificar Instalação
- Você verá o ícone "WH" na barra de extensões do Chrome
- Clique no ícone para abrir o popup da extensão
- Clique em "🚀 Abrir Workspace Hub" para testar

## 🛠️ Como Funciona

Esta extensão resolve o problema de sites que bloqueiam iframes através de:

### 🛡️ Headers Removidos:
- `X-Frame-Options` - Remove restrições de iframe
- `Content-Security-Policy` - Remove políticas que bloqueiam embedding
- `X-Content-Type-Options` - Remove verificações de tipo de conteúdo

### 🚫 Scripts Bloqueados:
- Frame-busting scripts que detectam se estão em iframe
- Redirecionamentos automáticos para `top.location`
- Verificações de `window.parent` e `window.top`
- Scripts que tentam "quebrar" o iframe

### 🔒 Proteções Aplicadas:
- Override de propriedades `window.top`, `window.parent`, `window.frameElement`
- Bloqueio de `setTimeout` e `setInterval` maliciosos
- Interceptação de `document.write` com conteúdo frame-busting
- CSS para esconder elementos anti-iframe

## 🎯 Sites Compatíveis

Com esta extensão, você pode carregar no Workspace Hub:

### ✅ Email & Comunicação
- Gmail, Outlook, Yahoo Mail
- WhatsApp Web, Telegram Web
- Slack, Microsoft Teams, Discord

### ✅ Redes Sociais
- Facebook, Twitter/X, LinkedIn
- Instagram, TikTok, YouTube

### ✅ CRM & Vendas
- Pipedrive, Salesforce, HubSpot
- Zendesk, Freshworks, Zoho

### ✅ Produtividade
- Google Analytics, Google Ads
- Trello, Asana, Monday.com
- Notion, Airtable, Figma

### ✅ E praticamente qualquer outro site!

## 📁 Arquivos da Extensão

```
EXTENSAO/
├── manifest.json      # Configurações da extensão
├── background.js      # Remove headers de restrição
├── content.js         # Bloqueia scripts frame-busting
├── popup.html         # Interface da extensão
├── popup.js           # Lógica do popup
├── rules.json         # Regras declarativas
└── README.md          # Este arquivo
```

## 🔧 Solução de Problemas

### Site ainda não carrega?
1. ✅ Verifique se a extensão está ativa em `chrome://extensions/`
2. 🔄 Recarregue a página do Workspace Hub (F5)
3. 🧪 Use o botão "Testar Funcionalidade" no popup da extensão
4. 🔍 Abra o Console (F12) e verifique se há logs da extensão

### Extensão não aparece?
1. 🔧 Certifique-se que o "Modo do desenvolvedor" está ativo
2. 📁 Verifique se todos os arquivos estão na pasta EXTENSAO
3. 🔄 Tente recarregar a extensão em `chrome://extensions/`
4. 🌐 Teste em uma aba anônima/privada

### Logs de Debug
Abra o Console do navegador (F12) e procure por mensagens como:
- `🚀 Workspace Hub Extension: Background script iniciado`
- `✅ Regras de remoção de headers aplicadas`
- `🛡️ Bloqueado acesso a window.top`
- `🚫 Bloqueado setTimeout frame-busting`

## ⚠️ Importante

### Segurança
- ⚠️ Use apenas em sites confiáveis
- 🔒 A extensão modifica headers de segurança
- 🛡️ Mantenha-a ativa apenas quando necessário

### Compatibilidade
- ✅ Funciona no Chrome (versão 88+)
- ✅ Funciona no Microsoft Edge (versão 88+)
- ❌ Não funciona no Firefox (usa Manifest V2)
- ❌ Não funciona no Safari

### Performance
- ⚡ Impacto mínimo na performance
- 🔄 Processa apenas headers de resposta
- 💾 Não armazena dados pessoais

## 🆘 Suporte

Se tiver problemas:

1. **Verifique o Console**: Abra F12 e procure por erros
2. **Teste Isoladamente**: Use o botão "Testar Funcionalidade"
3. **Reinstale**: Remova e reinstale a extensão
4. **Verifique Permissões**: A extensão precisa de acesso a todos os sites

### Mensagens de Erro Comuns

| Erro | Solução |
|------|---------|
| "Manifest file is missing" | Verifique se o arquivo `manifest.json` está na pasta |
| "Service worker registration failed" | Recarregue a extensão |
| "Permissions denied" | Aceite as permissões solicitadas |
| "Site still blocked" | Verifique se a extensão está ativa |

## 🔄 Atualizações

Para atualizar a extensão:
1. Baixe a nova versão dos arquivos
2. Substitua os arquivos na pasta EXTENSAO
3. Vá em `chrome://extensions/`
4. Clique no botão "🔄 Recarregar" da extensão

## 📞 Informações Técnicas

### Manifest V3
Esta extensão usa o Manifest V3, a versão mais recente e segura do sistema de extensões do Chrome.

### Declarative Net Request
Usa a API `declarativeNetRequest` para modificar headers de forma eficiente e segura.

### Content Security Policy
A própria extensão segue CSP rigoroso para máxima segurança.

---

**🚀 Desenvolvido para Workspace Hub**  
*Versão 1.0.0 - Solução definitiva para restrições de iframe*

**Última atualização**: Dezembro 2024