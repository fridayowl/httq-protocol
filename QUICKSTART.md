# Quick Start Guide

## Installation

```bash
npm install httq-protocol
```

## Server Example (5 minutes)

```javascript
const httq = require('httq-protocol');
const express = require('express');

const app = express();

// Add HTTQ middleware - ONE LINE!
app.use(httq.middleware());

app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'Quantum-safe!',
    quantumSafe: req.quantumSafe // true if using HTTQ
  });
});

httq.createServer(app).listen(8443);
```

## Client Example (2 minutes)

```javascript
import { HTTPQClient } from 'httq-protocol/client';

const client = new HTTPQClient();

const response = await client.fetch('httq://localhost:8443/api/data');
const data = await response.json();

console.log(data); // { message: 'Quantum-safe!', quantumSafe: true }
```

## Try the Demo

```bash
git clone https://github.com/httq-protocol/httq.git
cd httq
npm install
npm start
```

Open http://localhost:3000 in your browser!

## Next Steps

- Read the [Migration Guide](./docs/MIGRATION.md)
- Explore the [Protocol Specification](./docs/PROTOCOL.md)
- Check out [Examples](./examples/)
- Join our [Discord](https://discord.gg/httq)

---

**That's it! You're now quantum-safe! 🔐⚛️**
