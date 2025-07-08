
import { AES, enc } from 'crypto-js';

// Verschlüsselungs-Utilities für Session-IDs
export class SessionEncryption {
  private static getDeviceKey(): string {
    let deviceKey = localStorage.getItem('loveable_device_key');
    if (!deviceKey) {
      // Generiere eindeutigen Device-Key basierend auf Browser-Fingerprint
      const fingerprint = this.generateFingerprint();
      deviceKey = AES.encrypt(fingerprint + Date.now().toString(), 'loveable_secret').toString();
      localStorage.setItem('loveable_device_key', deviceKey);
    }
    return deviceKey;
  }

  private static generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('LoveAble Security', 2, 2);
    }
    
    return [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
  }

  static encryptSessionId(sessionId: string): string {
    const deviceKey = this.getDeviceKey();
    return AES.encrypt(sessionId, deviceKey).toString();
  }

  static decryptSessionId(encryptedSessionId: string): string {
    try {
      const deviceKey = this.getDeviceKey();
      const bytes = AES.decrypt(encryptedSessionId, deviceKey);
      return bytes.toString(enc.Utf8);
    } catch (error) {
      console.error('Session-ID decryption failed:', error);
      return '';
    }
  }

  static secureDelete(key: string): void {
    // Überschreibe mehrfach für sichere Löschung
    for (let i = 0; i < 3; i++) {
      localStorage.setItem(key, Math.random().toString(36).repeat(100));
    }
    localStorage.removeItem(key);
  }
}
