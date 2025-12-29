# Migration Guide: HTTPS → HTTQ

## Quick Start

Migrating from HTTPS to HTTQ is designed to be seamless. In most cases, you only need to change a few lines of code.

## Server Migration

### Node.js / Express

**Before (HTTPS)**:
```javascript
const https = require('https');
const express = require('express');
const fs = require('fs');

const app = express();

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS server running on port 443');
});
```

**After (HTTQ)**:
```javascript
const httq = require('httq-protocol');
const express = require('express');
const fs = require('fs');

const app = express();

// Add HTTQ middleware (optional but recommended)
app.use(httq.middleware({
  algorithm: 'HTTQ-LATTICE-2048',
  hybridMode: true,
  fallbackToHTTPS: true
}));

const options = {
  key: fs.readFileSync('server-key.pem'),
  cert: fs.readFileSync('server-cert.pem'),
  pqcAlgorithm: 'HTTQ-LATTICE-2048'
};

httq.createServer(options, app).listen(8443, () => {
  console.log('HTTQ server running on port 8443');
});
```

### Python / Flask

**Before (HTTPS)**:
```python
from flask import Flask
import ssl

app = Flask(__name__)

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain('server-cert.pem', 'server-key.pem')

app.run(host='0.0.0.0', port=443, ssl_context=context)
```

**After (HTTQ)**:
```python
from flask import Flask
from httq_protocol import HTTPQContext

app = Flask(__name__)

context = HTTPQContext(
    cert='server-cert.pem',
    key='server-key.pem',
    algorithm='HTTQ-LATTICE-2048'
)

app.run(host='0.0.0.0', port=8443, httq_context=context)
```

## Client Migration

### JavaScript / Fetch API

**Before (HTTPS)**:
```javascript
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

**After (HTTQ)**:
```javascript
import { HTTPQClient } from 'httq-protocol/client';

const client = new HTTPQClient({
  quantumSafe: true,
  fallbackToHTTPS: true
});

const response = await client.fetch('httq://api.example.com/data');
const data = await response.json();
```

### Python / Requests

**Before (HTTPS)**:
```python
import requests

response = requests.get('https://api.example.com/data')
data = response.json()
```

**After (HTTQ)**:
```python
import httq_requests

response = httq_requests.get('httq://api.example.com/data')
data = response.json()
```

## Configuration Options

### Security Levels

Choose based on your security requirements:

```javascript
// Level 1: IoT, Mobile, Real-time applications
algorithm: 'HTTQ-LATTICE-1024'  // 128-bit quantum security

// Level 3: Enterprise, Healthcare, E-commerce (RECOMMENDED)
algorithm: 'HTTQ-LATTICE-2048'  // 192-bit quantum security

// Level 5: Government, Defense, Finance
algorithm: 'HTTQ-LATTICE-4096'  // 256-bit quantum security
```

### Hybrid Mode

Combine classical and post-quantum crypto:

```javascript
httq.middleware({
  hybridMode: true,  // Use both classical + PQC
  classicalAlgorithm: 'ECDHE-RSA-AES256-GCM-SHA384',
  pqcAlgorithm: 'HTTQ-LATTICE-2048'
})
```

### Fallback Strategy

Handle clients that don't support HTTQ:

```javascript
httq.middleware({
  fallbackToHTTPS: true,  // Allow HTTPS connections
  requireHTTQ: false,     // Don't enforce HTTQ
  logFallbacks: true      // Log when fallback occurs
})
```

## Performance Tuning

### Connection Pooling

```javascript
const client = new HTTPQClient({
  poolSize: 10,           // Reuse connections
  keepAlive: true,
  timeout: 30000
});
```

### Caching

```javascript
const client = new HTTPQClient({
  cachePublicKeys: true,  // Cache server public keys
  cacheDuration: 3600000  // 1 hour
});
```

## Deployment Checklist

- [ ] Update server code to use HTTQ
- [ ] Generate post-quantum certificates
- [ ] Configure firewall for HTTQ port (default: 8443)
- [ ] Update DNS records (optional: HTTQ SRV records)
- [ ] Test with HTTQ client
- [ ] Monitor performance metrics
- [ ] Enable fallback for legacy clients
- [ ] Update documentation
- [ ] Train team on HTTQ

## Troubleshooting

### Issue: "HTTQ handshake failed"

**Solution**: Check that both client and server support the same algorithm:

```javascript
// Server
console.log(httq.getSupportedAlgorithms());

// Client
const client = new HTTPQClient({ debug: true });
```

### Issue: "Performance degradation"

**Solution**: Use a lower security level or enable caching:

```javascript
httq.middleware({
  algorithm: 'HTTQ-LATTICE-1024',  // Faster
  cachePublicKeys: true
})
```

### Issue: "Certificate validation failed"

**Solution**: Ensure you have post-quantum certificates:

```bash
# Generate HTTQ certificate
httq-keygen --algorithm HTTQ-LATTICE-2048 --output server
```

## Best Practices

1. **Start with Hybrid Mode**: Transition gradually
2. **Use Recommended Security Level**: HTTQ-LATTICE-2048
3. **Enable Fallback**: Don't break existing clients
4. **Monitor Performance**: Track handshake times
5. **Update Regularly**: Stay current with protocol updates
6. **Test Thoroughly**: Use test vectors for validation

## Support

- **Documentation**: https://httq.org/docs
- **GitHub Issues**: https://github.com/httq-protocol/httq/issues
- **Discord**: https://discord.gg/httq
- **Email**: support@httq.org

---

**Ready to go quantum-safe?** 🚀🔐⚛️
