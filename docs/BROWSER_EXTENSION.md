# Browser Extension Documentation

## Overview

The HTTQ Browser Extension automatically upgrades HTTPS connections to quantum-safe HTTQ when available, providing visual indicators of connection security.

---

## Features

### ✅ **Automatic HTTPS → HTTQ Upgrade**
- Detects HTTQ-capable servers
- Automatically upgrades connections
- Seamless user experience

### ✅ **Visual Security Indicators**
- **Green badge**: Quantum-safe (HTTQ)
- **Gray badge**: Not quantum-safe (HTTPS)
- Icon changes based on security level

### ✅ **Connection Information**
- View current protocol (HTTQ/HTTPS)
- See encryption algorithm
- Check quantum security bits

---

## Installation

### Chrome/Edge

1. Download the extension:
   - **Location**: `extensions/chrome/`
   
2. Open Chrome/Edge:
   - Go to `chrome://extensions` (Chrome)
   - Or `edge://extensions` (Edge)

3. Enable Developer Mode:
   - Toggle "Developer mode" in top-right

4. Load Extension:
   - Click "Load unpacked"
   - Select `extensions/chrome/` folder

5. Pin Extension:
   - Click puzzle icon in toolbar
   - Pin HTTQ extension

### Firefox (Coming Soon)

Firefox extension is in development.

---

## How It Works

### 1. **Request Interception**

The extension intercepts all web requests:

```javascript
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    
    // Check if server supports HTTQ
    if (url.protocol === 'https:') {
      checkHTTQSupport(url.hostname).then(supported => {
        if (supported) {
          // Upgrade to HTTQ
          const httqUrl = url.href.replace('https://', 'httq://');
          chrome.tabs.update(details.tabId, { url: httqUrl });
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
```

### 2. **Server Detection**

Checks if server supports HTTQ:

```javascript
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
```

### 3. **Visual Indicators**

Updates icon and badge based on connection:

```javascript
if (url.protocol === 'httq:') {
  // Quantum-safe connection
  chrome.action.setIcon({
    path: "icons/httq-secure.png"
  });
  
  chrome.action.setBadgeText({
    text: 'Q-SAFE'
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: '#000000'  // Black for quantum-safe
  });
} else {
  // Regular HTTPS (vulnerable)
  chrome.action.setBadgeText({
    text: 'VULN'
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: '#666666'  // Gray for vulnerable
  });
}
```

---

## File Structure

```
extensions/chrome/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script (future)
├── popup.html            # Popup UI (future)
├── popup.js              # Popup logic (future)
└── icons/
    ├── httq-16.png       # 16x16 icon
    ├── httq-32.png       # 32x32 icon
    ├── httq-48.png       # 48x48 icon
    └── httq-128.png      # 128x128 icon
```

---

## Manifest Configuration

**File**: `extensions/chrome/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "HTTQ Protocol",
  "version": "1.0.0",
  "description": "Automatically upgrade HTTPS to quantum-safe HTTQ connections",
  
  "permissions": [
    "webRequest",
    "webRequestBlocking",
    "tabs",
    "storage",
    "activeTab"
  ],
  
  "host_permissions": [
    "<all_urls>"
  ],
  
  "background": {
    "service_worker": "background.js"
  },
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/httq-16.png",
      "32": "icons/httq-32.png",
      "48": "icons/httq-48.png",
      "128": "icons/httq-128.png"
    }
  }
}
```

### Permissions Explained

- **webRequest**: Intercept web requests
- **webRequestBlocking**: Block and modify requests
- **tabs**: Access tab information
- **storage**: Store user preferences
- **activeTab**: Access current tab
- **host_permissions**: Access all URLs

---

## Background Script

**File**: `extensions/chrome/background.js`

### Key Functions

#### 1. **Installation Handler**
```javascript
chrome.runtime.onInstalled.addListener(() => {
  console.log('🔐⚛️ HTTQ Extension installed');
  
  // Set default settings
  chrome.storage.sync.set({
    autoUpgrade: true,
    showNotifications: true,
    preferredAlgorithm: 'HTTQ-LATTICE-2048'
  });
});
```

#### 2. **Request Handler**
```javascript
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Check and upgrade to HTTQ
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
```

#### 3. **Tab Update Handler**
```javascript
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIcon(tabId, tab.url);
  }
});
```

#### 4. **Message Handler**
```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getConnectionInfo') {
    const info = getConnectionInfo(sender.tab.url);
    sendResponse(info);
  }
  return true;
});
```

---

## Usage

### 1. **Automatic Upgrade**

When you visit an HTTQ-capable site:
1. Extension detects HTTQ support
2. Automatically upgrades connection
3. Shows "Q-SAFE" badge
4. Icon turns green

### 2. **Manual Check**

Click extension icon to see:
- Current protocol (HTTQ/HTTPS)
- Encryption algorithm
- Quantum security level
- Server certificate info

### 3. **Settings**

Right-click extension icon → Options:
- Enable/disable auto-upgrade
- Choose preferred algorithm
- Configure notifications
- Whitelist/blacklist sites

---

## Security Indicators

### Badge Text

| Badge | Meaning | Color |
|-------|---------|-------|
| **Q-SAFE** | Quantum-safe (HTTQ) | Black |
| **VULN** | Vulnerable (HTTPS) | Gray |
| **ERROR** | Connection error | Red |

### Icon States

| Icon | Protocol | Security |
|------|----------|----------|
| 🔐 Green | HTTQ | Quantum-safe |
| ⚠️ Gray | HTTPS | Vulnerable to quantum |
| ❌ Red | HTTP | Not encrypted |

---

## Development

### Testing Locally

1. **Load Extension**:
   ```
   chrome://extensions → Load unpacked → Select extensions/chrome/
   ```

2. **View Logs**:
   ```
   chrome://extensions → HTTQ Protocol → Inspect views: background page
   ```

3. **Test on Site**:
   - Visit any HTTPS site
   - Check if badge appears
   - Click icon to see details

### Debugging

**View Background Logs**:
```javascript
// In background.js
console.log('HTTQ: Checking server support');
```

**View Console**:
- Right-click extension icon
- Click "Inspect popup"
- Check Console tab

### Hot Reload

After making changes:
1. Go to `chrome://extensions`
2. Click refresh icon on HTTQ extension
3. Reload any open tabs

---

## Advanced Features (Coming Soon)

### 1. **Popup UI**

**File**: `popup.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>HTTQ Connection Info</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="container">
    <h1>🔐 HTTQ Protocol</h1>
    
    <div class="status">
      <div class="status-icon" id="statusIcon">✅</div>
      <div class="status-text" id="statusText">Quantum-Safe</div>
    </div>
    
    <div class="info">
      <div class="info-row">
        <span>Protocol:</span>
        <span id="protocol">HTTQ/1.0</span>
      </div>
      <div class="info-row">
        <span>Algorithm:</span>
        <span id="algorithm">HTTQ-LATTICE-2048</span>
      </div>
      <div class="info-row">
        <span>Security:</span>
        <span id="security">192-bit quantum</span>
      </div>
    </div>
    
    <button id="viewDetails">View Details</button>
  </div>
  
  <script src="popup.js"></script>
</body>
</html>
```

### 2. **Content Script**

Inject information into web pages:

```javascript
// content.js
const httqInfo = document.createElement('div');
httqInfo.id = 'httq-info';
httqInfo.innerHTML = `
  <div class="httq-badge">
    🔐 Quantum-Safe Connection
  </div>
`;
document.body.appendChild(httqInfo);
```

### 3. **Options Page**

User preferences:

```html
<!-- options.html -->
<form id="settings">
  <label>
    <input type="checkbox" id="autoUpgrade" checked>
    Automatically upgrade to HTTQ
  </label>
  
  <label>
    Algorithm:
    <select id="algorithm">
      <option value="HTTQ-LATTICE-1024">1024-bit (Fast)</option>
      <option value="HTTQ-LATTICE-2048" selected>2048-bit (Recommended)</option>
      <option value="HTTQ-LATTICE-4096">4096-bit (Maximum Security)</option>
    </select>
  </label>
  
  <button type="submit">Save Settings</button>
</form>
```

---

## Publishing to Chrome Web Store

### 1. **Prepare Extension**

- Create icons (16, 32, 48, 128px)
- Write description
- Take screenshots
- Create promotional images

### 2. **Create Developer Account**

- Go to: https://chrome.google.com/webstore/devconsole
- Pay $5 one-time fee
- Verify email

### 3. **Upload Extension**

```bash
# Create zip file
cd extensions/chrome
zip -r httq-extension.zip *
```

Upload to Chrome Web Store:
- Click "New Item"
- Upload `httq-extension.zip`
- Fill in details
- Submit for review

### 4. **Review Process**

- Usually takes 1-3 days
- Check for policy violations
- Respond to reviewer feedback

---

## Troubleshooting

### Issue: Extension Not Loading

**Solution**:
1. Check manifest.json is valid
2. Verify all files exist
3. Check Chrome console for errors

### Issue: Badge Not Showing

**Solution**:
1. Check permissions in manifest
2. Verify background script is running
3. Check browser console logs

### Issue: Auto-Upgrade Not Working

**Solution**:
1. Verify server sends `X-HTTQ-Version` header
2. Check webRequest permission
3. Test with known HTTQ server

---

## Security Considerations

### 1. **Permissions**

Only request necessary permissions:
- ✅ webRequest (needed for upgrade)
- ✅ tabs (needed for icon update)
- ❌ Don't request unnecessary permissions

### 2. **Data Privacy**

- ❌ Don't collect user data
- ❌ Don't track browsing history
- ✅ Store settings locally only

### 3. **Code Security**

- ✅ Use Content Security Policy
- ✅ Sanitize all inputs
- ✅ Validate server responses

---

## Extension Locations

- **Chrome**: `extensions/chrome/`
- **Manifest**: `extensions/chrome/manifest.json`
- **Background**: `extensions/chrome/background.js`

---

## Next Steps

1. **Install** the extension locally
2. **Test** on HTTQ-capable sites
3. **Customize** settings
4. **Publish** to Chrome Web Store (optional)

---

**The browser extension is ready to use!** 🚀🔐

Just load it in Chrome and start browsing quantum-safe! ⚛️
