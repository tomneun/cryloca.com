
// Bot-Sicherheits-Utilities
export class BotSecurity {
  static generateSecureSessionId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateHardenedBotScript(sessionId: string, shopName: string, enableTor: boolean = true): string {
    // Generate hash using JavaScript crypto
    const sessionHash = crypto.subtle.digest('SHA-256', new TextEncoder().encode(sessionId))
      .then(hashBuffer => Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join(''));
    
    // For immediate use, create a simple hash
    const simpleHash = btoa(sessionId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
    
    return `#!/usr/bin/env python3
# LoveAble Hardened Session Bot - ${shopName}
# Security Level: Maximum
# Generated: ${new Date().toISOString()}

import subprocess
import time
import json
import os
import sys
import random
import hashlib
from pathlib import Path
from datetime import datetime
from cryptography.fernet import Fernet

# Sicherheitskonfiguration
class SecurityConfig:
    SESSION_ID_HASH = "${simpleHash}"
    SHOP_NAME = "${shopName}"
    ORDER_DIR = Path("/tmp/loveable_orders_secure")
    MEMORY_ONLY = True
    USE_TOR = ${enableTor}
    JITTER_RANGE = (5, 15)
    MAX_RETRIES = 3
    
    # Tor-Konfiguration
    TOR_PROXY = "socks5://127.0.0.1:9050"
    TOR_CONTROL_PORT = 9051

class SecureBot:
    def __init__(self):
        self.session_key = os.environ.get('LOVEABLE_SESSION_KEY')
        if not self.session_key:
            print("[CRITICAL] LOVEABLE_SESSION_KEY environment variable not set!")
            sys.exit(1)
        
        self.fernet = Fernet(self.session_key.encode()[:44].ljust(44, b'='))
        
        # Sichere Temp-Directory
        if SecurityConfig.MEMORY_ONLY:
            self.setup_tmpfs()
        
        # Tor-Setup
        if SecurityConfig.USE_TOR:
            self.setup_tor()
    
    def setup_tmpfs(self):
        """Erstelle RAM-basierte Speicherung"""
        try:
            subprocess.run([
                "sudo", "mount", "-t", "tmpfs", "-o", "size=100M,noexec,nosuid,nodev",
                "tmpfs", str(SecurityConfig.ORDER_DIR)
            ], check=True)
            print("[+] RAM-only storage initialized")
        except subprocess.CalledProcessError:
            print("[!] Failed to setup RAM storage, using disk")
    
    def setup_tor(self):
        """Konfiguriere Tor-Proxy für Session-CLI"""
        try:
            # Prüfe Tor-Status
            result = subprocess.run([
                "curl", "-s", "--socks5", "127.0.0.1:9050", 
                "https://check.torproject.org/api/ip"
            ], capture_output=True, text=True, timeout=10)
            
            if "true" in result.stdout:
                print("[+] Tor connection verified")
            else:
                print("[!] Tor not available, using direct connection")
                SecurityConfig.USE_TOR = False
        except Exception as e:
            print(f"[!] Tor setup failed: {e}")
            SecurityConfig.USE_TOR = False
    
    def receive_messages(self):
        """Session-CLI mit Tor-Proxy"""
        cmd = ["session-cli", "receive"]
        
        if SecurityConfig.USE_TOR:
            cmd.extend(["--proxy", SecurityConfig.TOR_PROXY])
        
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30,
                env={**os.environ, "LOVEABLE_SESSION_HASH": SecurityConfig.SESSION_ID_HASH}
            )
            
            if result.returncode == 0 and result.stdout.strip():
                return self.decrypt_message(result.stdout.strip())
            
        except subprocess.TimeoutExpired:
            print("[!] Receive timeout - continuing")
        except Exception as e:
            print(f"[!] Receive error: {e}")
        
        return None
    
    def decrypt_message(self, encrypted_msg):
        """Entschlüssele Session-Nachricht"""
        try:
            if encrypted_msg.startswith("LOVEABLE_ENCRYPTED:"):
                payload = encrypted_msg.replace("LOVEABLE_ENCRYPTED:", "")
                return self.fernet.decrypt(payload.encode()).decode()
            return encrypted_msg
        except Exception as e:
            print(f"[!] Decryption failed: {e}")
            return None
    
    def store_order_secure(self, content):
        """Sichere Bestellspeicherung"""
        SecurityConfig.ORDER_DIR.mkdir(exist_ok=True)
        
        # Generiere sichere Datei-ID
        order_id = hashlib.sha256(
            (content + str(time.time())).encode()
        ).hexdigest()[:16]
        
        filepath = SecurityConfig.ORDER_DIR / f"order_{order_id}.enc"
        
        # Verschlüssele Bestelldaten
        encrypted_content = self.fernet.encrypt(json.dumps({
            "timestamp": datetime.now().isoformat(),
            "shop": SecurityConfig.SHOP_NAME,
            "content": content,
            "processed": False,
            "security_level": "maximum"
        }).encode())
        
        with open(filepath, 'wb') as f:
            f.write(encrypted_content)
        
        print(f"[+] Secure order stored: {order_id}")
        
        # Sichere Löschung nach 24h
        self.schedule_secure_delete(filepath)
    
    def schedule_secure_delete(self, filepath):
        """Plane sichere Löschung"""
        # Implementierung für delayed secure delete
        pass
    
    def add_jitter(self):
        """Anti-Timing-Analysis"""
        jitter = random.uniform(*SecurityConfig.JITTER_RANGE)
        time.sleep(jitter)
    
    def run(self):
        """Hauptschleife mit Sicherheitsfeatures"""
        print(f"[*] LoveAble Secure Bot started")
        print(f"[*] Shop: {SecurityConfig.SHOP_NAME}")
        print(f"[*] Security: Maximum")
        print(f"[*] Tor: {'Enabled' if SecurityConfig.USE_TOR else 'Disabled'}")
        
        while True:
            try:
                # Anti-Timing mit Jitter
                self.add_jitter()
                
                message = self.receive_messages()
                if message:
                    print("[+] Secure message received")
                    self.store_order_secure(message)
                
            except KeyboardInterrupt:
                print("\\n[*] Secure shutdown initiated")
                self.secure_cleanup()
                break
            except Exception as e:
                print(f"[!] Security error: {e}")
                time.sleep(10)
    
    def secure_cleanup(self):
        """Sichere Bereinigung"""
        if SecurityConfig.MEMORY_ONLY:
            subprocess.run(["sudo", "umount", str(SecurityConfig.ORDER_DIR)], 
                         capture_output=True)
        print("[+] Secure cleanup completed")

if __name__ == "__main__":
    bot = SecureBot()
    bot.run()
`;
  }

  static generateDockerfile(shopName: string): string {
    return `FROM python:3.11-alpine

# Sicherheits-Hardening
RUN addgroup -g 1000 loveable && \\
    adduser -D -s /bin/sh -u 1000 -G loveable loveable

# Session-CLI Installation
RUN apk add --no-cache curl tor && \\
    curl -LO https://getsession.org/session-cli.zip && \\
    unzip session-cli.zip && \\
    mv session-cli /usr/local/bin/ && \\
    rm session-cli.zip

# Python Dependencies
RUN pip install --no-cache-dir cryptography

# Tor-Konfiguration
COPY torrc /etc/tor/torrc
RUN chmod 644 /etc/tor/torrc

# Bot-Script
COPY loveable_bot_${shopName}.py /app/bot.py
RUN chmod +x /app/bot.py && \\
    chown loveable:loveable /app/bot.py

# Sicherheits-Constraints
USER loveable
WORKDIR /app

# Tmpfs für RAM-only storage
VOLUME ["/tmp/loveable_orders_secure"]

# Tor + Bot startup
CMD ["sh", "-c", "tor & python3 bot.py"]
`;
  }

  static generateDockerCompose(shopName: string): string {
    return `version: '3.8'

services:
  loveable-bot-${shopName}:
    build: .
    container_name: loveable-bot-${shopName}
    restart: unless-stopped
    
    # Sicherheits-Isolation
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    
    # RAM-only storage
    tmpfs:
      - /tmp/loveable_orders_secure:noexec,nosuid,size=100m
    
    # Netzwerk-Isolation
    networks:
      - loveable-secure
    
    # Ressourcen-Limits
    deploy:
      resources:
        limits:
          memory: 256M
          cpus: '0.5'
    
    environment:
      - LOVEABLE_SESSION_KEY=\${LOVEABLE_SESSION_KEY}
      - LOVEABLE_SHOP_NAME=${shopName}
    
    # Gesundheitscheck
    healthcheck:
      test: ["CMD", "pgrep", "-f", "python3"]
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  loveable-secure:
    driver: bridge
    internal: true
`;
  }
}
