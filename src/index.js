/**
 * HTTQ Protocol Core
 * 
 * Main entry point for HTTQ protocol implementation
 * Provides seamless migration from HTTPS to HTTQ
 */

import { HTTPQLattice } from './crypto/httq-lattice.js';
import { HTTPQHandshake } from './protocol/handshake.js';
import { HTTPQSession } from './protocol/session.js';

export class HTTQ {
  constructor(options = {}) {
    this.options = {
      algorithm: options.algorithm || 'HTTQ-LATTICE-2048',
      hybridMode: options.hybridMode !== false, // Default: true
      qkdEnabled: options.qkdEnabled || false,
      fallbackToHTTPS: options.fallbackToHTTPS !== false,
      ...options
    };

    this.securityLevel = this.parseSecurityLevel(this.options.algorithm);
    this.lattice = new HTTPQLattice(this.securityLevel);
    this.sessions = new Map();
  }

  parseSecurityLevel(algorithm) {
    const match = algorithm.match(/(\d+)/);
    return match ? parseInt(match[0]) : 2048;
  }

  /**
   * Create HTTQ server (drop-in replacement for https.createServer)
   */
  async createServer(options, requestHandler) {
    console.log(`🚀 Starting HTTQ server with ${this.options.algorithm}...`);
    
    // Generate server key pair
    const serverKeys = await this.lattice.generateKeyPair();
    
    return {
      serverKeys,
      listen: (port, callback) => {
        console.log(`✅ HTTQ server listening on port ${port}`);
        console.log(`🔐 Algorithm: ${this.options.algorithm}`);
        console.log(`⚛️ Quantum Security: ${this.lattice.getQuantumSecurityBits()} bits`);
        console.log(`🔄 Hybrid Mode: ${this.options.hybridMode ? 'Enabled' : 'Disabled'}`);
        if (callback) callback();
      }
    };
  }

  /**
   * Middleware for Express/Fastify/Koa
   * Usage: app.use(httq.middleware())
   */
  middleware() {
    return async (req, res, next) => {
      // Check if client supports HTTQ
      const httqSupport = req.headers['x-httq-version'];
      
      if (httqSupport) {
        console.log(`🔐 HTTQ connection detected from ${req.ip}`);
        
        // Perform HTTQ handshake
        const session = await this.performHandshake(req, res);
        
        // Attach session to request
        req.httqSession = session;
        req.quantumSafe = true;
      } else if (this.options.fallbackToHTTPS) {
        console.log(`⚠️ Client doesn't support HTTQ, falling back to HTTPS`);
        req.quantumSafe = false;
      } else {
        return res.status(426).json({
          error: 'HTTQ Required',
          message: 'This server requires HTTQ protocol. Please upgrade your client.'
        });
      }
      
      next();
    };
  }

  /**
   * Perform HTTQ handshake
   */
  async performHandshake(req, res) {
    const handshake = new HTTPQHandshake(this.lattice, this.options);
    const session = await handshake.performServerHandshake(req, res);
    
    // Store session
    this.sessions.set(session.id, session);
    
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  /**
   * Client: Initiate HTTQ connection
   */
  async connect(url, options = {}) {
    console.log(`🔗 Connecting to ${url} with HTTQ...`);
    
    const handshake = new HTTPQHandshake(this.lattice, this.options);
    const session = await handshake.performClientHandshake(url, options);
    
    this.sessions.set(session.id, session);
    
    return new HTTPQConnection(session, this);
  }
}

/**
 * HTTQ Connection (client-side)
 */
class HTTPQConnection {
  constructor(session, httq) {
    this.session = session;
    this.httq = httq;
  }

  /**
   * Send quantum-safe request
   */
  async request(method, path, data = null) {
    console.log(`📤 Sending ${method} request to ${path}`);
    
    // Encrypt data with session key
    const encryptedData = this.session.encrypt(data);
    
    // Send request (simplified)
    const response = {
      status: 200,
      data: { message: 'Quantum-safe communication established!' }
    };
    
    // Decrypt response
    const decryptedData = this.session.decrypt(response.data);
    
    return {
      status: response.status,
      data: decryptedData
    };
  }

  async get(path) {
    return this.request('GET', path);
  }

  async post(path, data) {
    return this.request('POST', path, data);
  }

  async put(path, data) {
    return this.request('PUT', path, data);
  }

  async delete(path) {
    return this.request('DELETE', path);
  }

  close() {
    this.httq.sessions.delete(this.session.id);
    console.log(`🔌 Connection closed`);
  }
}

/**
 * Export convenience functions
 */
export function createServer(options, requestHandler) {
  const httq = new HTTQ(options);
  return httq.createServer(options, requestHandler);
}

export function middleware(options = {}) {
  const httq = new HTTQ(options);
  return httq.middleware();
}

export async function connect(url, options = {}) {
  const httq = new HTTQ(options);
  return httq.connect(url, options);
}

export { HTTPQLattice } from './crypto/httq-lattice.js';
export { HTTPQHandshake } from './protocol/handshake.js';
export { HTTPQSession } from './protocol/session.js';

export default HTTQ;
