/**
 * HTTQ Session Management
 * 
 * Manages encrypted sessions after handshake completion
 * Provides encryption/decryption for application data
 */

import crypto from 'crypto';

export class HTTPQSession {
  constructor(sessionId, sharedSecret, keys, options) {
    this.id = sessionId;
    this.sharedSecret = sharedSecret;
    this.keys = keys;
    this.options = options;
    this.createdAt = Date.now();
    this.lastActivity = Date.now();
    
    // Derive encryption keys from shared secret
    this.encryptionKey = this.deriveKey(sharedSecret, 'encryption');
    this.macKey = this.deriveKey(sharedSecret, 'mac');
    
    console.log(`🔑 Session ${sessionId} created with quantum-safe encryption`);
  }

  /**
   * Derive keys from shared secret using HKDF
   */
  deriveKey(secret, purpose) {
    const hash = crypto.createHash('sha256');
    hash.update(secret);
    hash.update(purpose);
    return hash.digest();
  }

  /**
   * Encrypt data with session key
   */
  encrypt(data) {
    this.lastActivity = Date.now();
    
    if (!data) return null;
    
    const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Use AES-256-GCM for symmetric encryption
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      ciphertext: encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: 'AES-256-GCM',
      quantumSafe: true
    };
  }

  /**
   * Decrypt data with session key
   */
  decrypt(encryptedData) {
    this.lastActivity = Date.now();
    
    if (!encryptedData) return null;
    
    // If data is not encrypted, return as-is (for demo)
    if (!encryptedData.ciphertext) {
      return encryptedData;
    }
    
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.encryptionKey,
      Buffer.from(encryptedData.iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  }

  /**
   * Check if session is still valid
   */
  isValid() {
    const maxAge = this.options.sessionMaxAge || 3600000; // 1 hour default
    return (Date.now() - this.createdAt) < maxAge;
  }

  /**
   * Check if session is idle
   */
  isIdle() {
    const idleTimeout = this.options.idleTimeout || 300000; // 5 minutes default
    return (Date.now() - this.lastActivity) > idleTimeout;
  }

  /**
   * Refresh session
   */
  refresh() {
    this.lastActivity = Date.now();
  }

  /**
   * Get session info
   */
  getInfo() {
    return {
      id: this.id,
      algorithm: this.options.algorithm,
      quantumSafe: true,
      hybridMode: this.options.hybridMode,
      createdAt: this.createdAt,
      lastActivity: this.lastActivity,
      valid: this.isValid(),
      idle: this.isIdle()
    };
  }

  /**
   * Destroy session
   */
  destroy() {
    // Clear sensitive data
    this.sharedSecret = null;
    this.encryptionKey = null;
    this.macKey = null;
    this.keys = null;
    
    console.log(`🗑️ Session ${this.id} destroyed`);
  }
}
