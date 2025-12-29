# HTTQ Protocol - AWS Lambda Integration

## Overview

Deploy HTTQ-enabled APIs on AWS Lambda with API Gateway integration.

## Architecture

```
Client (HTTQ) → API Gateway → Lambda (HTTQ Handler) → Your Application
```

## Setup

### 1. Install Dependencies

```bash
npm install httq-protocol aws-sdk
```

### 2. Create Lambda Handler

```javascript
// lambda/handler.js
const httq = require('httq-protocol');

exports.handler = async (event) => {
  // Check if request supports HTTQ
  const httqVersion = event.headers['x-httq-version'];
  
  if (httqVersion) {
    console.log('🔐 HTTQ request detected');
    
    // Initialize HTTQ
    const httqServer = new httq.HTTQ({
      algorithm: 'HTTQ-LATTQ-2048',
      hybridMode: true
    });
    
    // Perform handshake
    const session = await httqServer.performHandshake(event);
    
    // Process request with quantum-safe encryption
    const response = await processQuantumSafeRequest(event, session);
    
    return {
      statusCode: 200,
      headers: {
        'X-HTTQ-Version': 'HTTQ/1.0',
        'X-HTTQ-Algorithm': 'HTTQ-LATTICE-2048',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };
  }
  
  // Fallback to regular HTTPS
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Regular HTTPS response' })
  };
};

async function processQuantumSafeRequest(event, session) {
  // Your application logic here
  return {
    message: 'Quantum-safe response',
    quantumSafe: true,
    algorithm: session.algorithm,
    securityBits: session.securityBits
  };
}
```

### 3. Deploy with Serverless Framework

```yaml
# serverless.yml
service: httq-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  api:
    handler: lambda/handler.handler
    events:
      - http:
          path: /api/{proxy+}
          method: ANY
          cors: true

plugins:
  - serverless-offline
```

### 4. Deploy

```bash
serverless deploy
```

## Azure Functions Integration

```javascript
// Azure Function
const httq = require('httq-protocol');

module.exports = async function (context, req) {
  const httqVersion = req.headers['x-httq-version'];
  
  if (httqVersion) {
    const httqServer = new httq.HTTQ({
      algorithm: 'HTTQ-LATTICE-2048'
    });
    
    const session = await httqServer.performHandshake(req);
    
    context.res = {
      status: 200,
      headers: {
        'X-HTTQ-Version': 'HTTQ/1.0',
        'Content-Type': 'application/json'
      },
      body: {
        message: 'Quantum-safe Azure Function',
        quantumSafe: true
      }
    };
  } else {
    context.res = {
      status: 200,
      body: { message: 'Regular HTTPS' }
    };
  }
};
```

## Google Cloud Functions Integration

```javascript
// Google Cloud Function
const httq = require('httq-protocol');

exports.httqApi = async (req, res) => {
  const httqVersion = req.headers['x-httq-version'];
  
  if (httqVersion) {
    const httqServer = new httq.HTTQ({
      algorithm: 'HTTQ-LATTICE-2048'
    });
    
    const session = await httqServer.performHandshake(req);
    
    res.set('X-HTTQ-Version', 'HTTQ/1.0');
    res.status(200).json({
      message: 'Quantum-safe Google Cloud Function',
      quantumSafe: true,
      algorithm: session.algorithm
    });
  } else {
    res.status(200).json({ message: 'Regular HTTPS' });
  }
};
```

## Cloudflare Workers Integration

```javascript
// Cloudflare Worker
import { HTTQ } from 'httq-protocol';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const httqVersion = request.headers.get('x-httq-version');
  
  if (httqVersion) {
    const httq = new HTTQ({
      algorithm: 'HTTQ-LATTICE-2048'
    });
    
    const session = await httq.performHandshake(request);
    
    return new Response(JSON.stringify({
      message: 'Quantum-safe Cloudflare Worker',
      quantumSafe: true
    }), {
      headers: {
        'X-HTTQ-Version': 'HTTQ/1.0',
        'Content-Type': 'application/json'
      }
    });
  }
  
  return new Response('Regular HTTPS');
}
```

## Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8443

CMD ["node", "src/server/demo-server.js"]
```

```bash
# Build and run
docker build -t httq-server .
docker run -p 8443:8443 httq-server
```

## Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httq-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: httq-server
  template:
    metadata:
      labels:
        app: httq-server
    spec:
      containers:
      - name: httq-server
        image: httq-server:latest
        ports:
        - containerPort: 8443
        env:
        - name: HTTQ_ALGORITHM
          value: "HTTQ-LATTICE-2048"
---
apiVersion: v1
kind: Service
metadata:
  name: httq-service
spec:
  selector:
    app: httq-server
  ports:
  - protocol: TCP
    port: 8443
    targetPort: 8443
  type: LoadBalancer
```

## Performance Optimization

### 1. Connection Pooling

```javascript
const httq = new HTTQ({
  poolSize: 100,
  keepAlive: true,
  timeout: 30000
});
```

### 2. Caching

```javascript
const httq = new HTTQ({
  cachePublicKeys: true,
  cacheDuration: 3600000  // 1 hour
});
```

### 3. Load Balancing

Use AWS ALB, Azure Load Balancer, or GCP Load Balancer with HTTQ-aware health checks.

## Monitoring

### CloudWatch Metrics (AWS)

```javascript
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

// Log HTTQ metrics
await cloudwatch.putMetricData({
  Namespace: 'HTTQ',
  MetricData: [{
    MetricName: 'HandshakeDuration',
    Value: duration,
    Unit: 'Milliseconds'
  }]
}).promise();
```

## Security Best Practices

1. **Use Environment Variables** for configuration
2. **Enable Hybrid Mode** for transition period
3. **Monitor Performance** metrics
4. **Rotate Keys** regularly
5. **Enable Logging** for audit trails

## Cost Optimization

- Use serverless for variable workloads
- Enable caching to reduce handshake overhead
- Use connection pooling for high-traffic APIs
- Consider reserved instances for predictable loads

---

**Ready for cloud deployment!** 🚀☁️🔐
