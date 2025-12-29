/**
 * HTTQ Protocol - Chrome Browser Extension
 * 
 * Automatically upgrades HTTPS connections to HTTQ when available
 * Provides visual indicator of quantum-safe connections
 */

// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('🔐⚛️ HTTQ Extension installed');
});

// Intercept web requests
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    
    // Check if server supports HTTQ
    if (url.protocol === 'https:') {
      // Try to upgrade to HTTQ
      const httqUrl = url.href.replace('https://', 'httq://');
      
      // Check HTTQ support (simplified)
      checkHTTQSupport(url.hostname).then(supported => {
        if (supported) {
          console.log(`✅ Upgrading ${url.hostname} to HTTQ`);
          chrome.tabs.update(details.tabId, { url: httqUrl });
        }
      });
    }
    
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Check if server supports HTTQ
async function checkHTTQSupport(hostname) {
  try {
    const response = await fetch(`https://${hostname}`, {
      method: 'HEAD',
      headers: {
        'X-HTTQ-Check': 'true'
      }
    });
    
    return response.headers.get('X-HTTQ-Version') !== null;
  } catch (error) {
    return false;
  }
}

// Update page action icon based on connection security
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    
    if (url.protocol === 'httq:') {
      // Quantum-safe connection
      chrome.action.setIcon({
        tabId: tabId,
        path: {
          "16": "icons/httq-16.png",
          "32": "icons/httq-32.png",
          "48": "icons/httq-48.png",
          "128": "icons/httq-128.png"
        }
      });
      
      chrome.action.setTitle({
        tabId: tabId,
        title: '🔐 Quantum-Safe Connection (HTTQ)'
      });
      
      chrome.action.setBadgeText({
        tabId: tabId,
        text: 'Q-SAFE'
      });
      
      chrome.action.setBadgeBackgroundColor({
        tabId: tabId,
        color: '#000000'
      });
    } else if (url.protocol === 'https:') {
      // Regular HTTPS (vulnerable to quantum attacks)
      chrome.action.setTitle({
        tabId: tabId,
        title: '⚠️ Not Quantum-Safe (HTTPS)'
      });
      
      chrome.action.setBadgeText({
        tabId: tabId,
        text: 'VULN'
      });
      
      chrome.action.setBadgeBackgroundColor({
        tabId: tabId,
        color: '#666666'
      });
    }
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: 'popup.html'
  });
});

// Message handler for content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConnectionInfo') {
    const url = new URL(sender.tab.url);
    
    sendResponse({
      protocol: url.protocol,
      quantumSafe: url.protocol === 'httq:',
      algorithm: request.algorithm || 'HTTQ-LATTICE-2048',
      securityBits: url.protocol === 'httq:' ? 192 : 0
    });
  }
  
  return true;
});
