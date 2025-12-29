/**
 * HTTQ Demo Server
 * 
 * Interactive demonstration of HTTQ protocol
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { HTTPQLattice } from '../crypto/httq-lattice.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../demo/public')));

// Initialize HTTQ
const lattice1024 = new HTTPQLattice(1024);
const lattice2048 = new HTTPQLattice(2048);
const lattice4096 = new HTTPQLattice(4096);

// Store sessions
const sessions = new Map();

// API Routes

/**
 * Generate key pair
 */
app.post('/api/generate-keys', async (req, res) => {
  try {
    const { securityLevel } = req.body;
    const lattice = securityLevel === 1024 ? lattice1024 : 
                    securityLevel === 4096 ? lattice4096 : lattice2048;
    
    const startTime = Date.now();
    const keyPair = await lattice.generateKeyPair();
    const duration = Date.now() - startTime;
    
    res.json({
      success: true,
      keyPair,
      duration,
      stats: {
        publicKeySize: Buffer.from(keyPair.publicKey, 'base64').length,
        privateKeySize: Buffer.from(keyPair.privateKey, 'base64').length,
        securityBits: keyPair.securityBits
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Encapsulate shared secret
 */
app.post('/api/encapsulate', async (req, res) => {
  try {
    const { publicKey, securityLevel } = req.body;
    const lattice = securityLevel === 1024 ? lattice1024 : 
                    securityLevel === 4096 ? lattice4096 : lattice2048;
    
    const startTime = Date.now();
    const result = await lattice.encapsulate(publicKey);
    const duration = Date.now() - startTime;
    
    res.json({
      success: true,
      ciphertext: result.ciphertext,
      sharedSecret: result.sharedSecret,
      duration,
      stats: {
        ciphertextSize: Buffer.from(result.ciphertext, 'base64').length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Decapsulate shared secret
 */
app.post('/api/decapsulate', async (req, res) => {
  try {
    const { ciphertext, privateKey, securityLevel } = req.body;
    const lattice = securityLevel === 1024 ? lattice1024 : 
                    securityLevel === 4096 ? lattice4096 : lattice2048;
    
    const startTime = Date.now();
    const sharedSecret = await lattice.decapsulate(ciphertext, privateKey);
    const duration = Date.now() - startTime;
    
    res.json({
      success: true,
      sharedSecret,
      duration
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Full handshake simulation
 */
app.post('/api/simulate-handshake', async (req, res) => {
  try {
    const { securityLevel } = req.body;
    const lattice = securityLevel === 1024 ? lattice1024 : 
                    securityLevel === 4096 ? lattice4096 : lattice2048;
    
    const timeline = [];
    const startTime = Date.now();
    
    // Step 1: Server generates key pair
    timeline.push({ step: 'Server Key Generation', time: Date.now() - startTime });
    const serverKeys = await lattice.generateKeyPair();
    timeline.push({ step: 'Server Key Generation Complete', time: Date.now() - startTime });
    
    // Step 2: Client encapsulates
    timeline.push({ step: 'Client Encapsulation', time: Date.now() - startTime });
    const { ciphertext, sharedSecret: clientSecret } = await lattice.encapsulate(serverKeys.publicKey);
    timeline.push({ step: 'Client Encapsulation Complete', time: Date.now() - startTime });
    
    // Step 3: Server decapsulates
    timeline.push({ step: 'Server Decapsulation', time: Date.now() - startTime });
    const serverSecret = await lattice.decapsulate(ciphertext, serverKeys.privateKey);
    timeline.push({ step: 'Server Decapsulation Complete', time: Date.now() - startTime });
    
    const totalDuration = Date.now() - startTime;
    const success = clientSecret === serverSecret;
    
    res.json({
      success,
      timeline,
      totalDuration,
      sharedSecret: clientSecret,
      matched: success,
      algorithm: `HTTQ-LATTICE-${securityLevel}`,
      quantumSecurityBits: lattice.getQuantumSecurityBits()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Compare with HTTPS
 */
app.get('/api/compare-performance', async (req, res) => {
  try {
    const results = [];
    
    // Test all security levels
    for (const level of [1024, 2048, 4096]) {
      const lattice = level === 1024 ? lattice1024 : 
                      level === 4096 ? lattice4096 : lattice2048;
      
      const start = Date.now();
      const keys = await lattice.generateKeyPair();
      const { ciphertext, sharedSecret } = await lattice.encapsulate(keys.publicKey);
      await lattice.decapsulate(ciphertext, keys.privateKey);
      const duration = Date.now() - start;
      
      results.push({
        algorithm: `HTTQ-LATTICE-${level}`,
        handshakeDuration: duration,
        quantumSecurityBits: lattice.getQuantumSecurityBits(),
        publicKeySize: Buffer.from(keys.publicKey, 'base64').length,
        ciphertextSize: Buffer.from(ciphertext, 'base64').length
      });
    }
    
    // Simulated HTTPS (RSA-2048) for comparison
    results.push({
      algorithm: 'HTTPS (RSA-2048)',
      handshakeDuration: 45, // Typical RSA handshake
      quantumSecurityBits: 0, // Not quantum-safe!
      publicKeySize: 294,
      ciphertextSize: 256
    });
    
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../demo/public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔐⚛️  HTTQ Protocol Demo Server                        ║
║                                                           ║
║   HyperText Transfer Quantum                              ║
║   Protecting today's data from tomorrow's quantum         ║
║   computers                                               ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   🌐 Server running at: http://localhost:${PORT}            ║
║                                                           ║
║   📊 Available Algorithms:                                ║
║      • HTTQ-LATTICE-1024 (128-bit quantum security)      ║
║      • HTTQ-LATTICE-2048 (192-bit quantum security)      ║
║      • HTTQ-LATTICE-4096 (256-bit quantum security)      ║
║                                                           ║
║   🚀 Features:                                            ║
║      ✅ Post-Quantum Cryptography                         ║
║      ✅ Lattice-Based Key Exchange                        ║
║      ✅ Quantum-Resistant Signatures                      ║
║      ✅ Hybrid Encryption Mode                            ║
║      ✅ QKD Ready                                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
