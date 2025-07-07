
import { useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useSessionBot } from '@/hooks/useSessionBot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Bot, Shield, Key, Download, Copy } from 'lucide-react';

const SessionBotTab = () => {
  const { session } = useSession();
  const { config, activateBot, deactivateBot, updateConfig } = useSessionBot(session?.pseudonym || '');
  const [sessionId, setSessionId] = useState('');
  const [pgpKey, setPgpKey] = useState('');
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);

  if (!session) return null;

  const handleActivateBot = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.length >= 32) {
      activateBot(sessionId, encryptionEnabled, pgpKey);
      setSessionId('');
      setPgpKey('');
      alert('Session Bot erfolgreich aktiviert!');
    }
  };

  const generateBotScript = () => {
    if (!config) return '';
    
    return `#!/usr/bin/env python3
# LoveAble Session Order Bot
# Shop: ${session.pseudonym}
# Session ID: ${config.sessionId}

import subprocess
import time
import json
import os
from pathlib import Path
from datetime import datetime

# Configuration
SESSION_ID = "${config.sessionId}"
ORDER_DIR = Path("/home/user/loveable_orders")
ENCRYPTION_ENABLED = ${config.encryptionEnabled}
CHECK_INTERVAL = 10  # seconds

def receive_messages():
    """Receive messages from Session CLI"""
    try:
        result = subprocess.run(
            ["session-cli", "receive", "--session-id", SESSION_ID], 
            capture_output=True, 
            text=True,
            timeout=30
        )
        return result.stdout.strip() if result.returncode == 0 else None
    except Exception as e:
        print(f"Error receiving messages: {e}")
        return None

def decrypt_message(msg):
    """Decrypt message if encryption is enabled"""
    if not ENCRYPTION_ENABLED:
        return msg
    
    try:
        # Add your GPG decryption logic here
        # This is a placeholder - implement actual decryption
        return msg
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

def store_order(content):
    """Store order data locally"""
    ORDER_DIR.mkdir(exist_ok=True)
    
    timestamp = datetime.now().isoformat()
    filename = f"order_{int(time.time())}.json"
    filepath = ORDER_DIR / filename
    
    order_data = {
        "timestamp": timestamp,
        "shop": "${session.pseudonym}",
        "content": content,
        "processed": False
    }
    
    with open(filepath, 'w') as f:
        json.dump(order_data, f, indent=2)
    
    print(f"[+] Neue Bestellung gespeichert: {filepath}")

def main():
    """Main bot loop"""
    print(f"[*] LoveAble Session Bot gestartet für Shop: ${session.pseudonym}")
    print(f"[*] Session ID: {SESSION_ID}")
    print(f"[*] Bestellungen werden gespeichert in: {ORDER_DIR}")
    
    while True:
        try:
            message = receive_messages()
            if message:
                print("[!] Neue Nachricht empfangen")
                
                decrypted = decrypt_message(message)
                if decrypted:
                    store_order(decrypted)
                else:
                    print("[!] Entschlüsselung fehlgeschlagen")
            
            time.sleep(CHECK_INTERVAL)
            
        except KeyboardInterrupt:
            print("\\n[*] Bot gestoppt")
            break
        except Exception as e:
            print(f"[!] Fehler: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
`;
  };

  const generateSystemdService = () => {
    return `[Unit]
Description=LoveAble Session Order Bot - ${session.pseudonym}
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /home/user/loveable_session_bot_${session.pseudonym}.py
Restart=always
RestartSec=10
User=user
WorkingDirectory=/home/user

[Install]
WantedBy=default.target
`;
  };

  const downloadBotScript = () => {
    const script = generateBotScript();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loveable_session_bot_${session.pseudonym}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSystemdService = () => {
    const service = generateSystemdService();
    const blob = new Blob([service], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loveable-bot-${session.pseudonym}.service`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySessionId = () => {
    if (config?.sessionId) {
      navigator.clipboard.writeText(config.sessionId);
      alert('Session ID kopiert!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Bot Status */}
      {config && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className={`h-5 w-5 ${config.botActive ? 'text-green-400' : 'text-red-400'}`} />
              Session Bot Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${config.botActive ? 'bg-green-600' : 'bg-red-600'}`}>
                  {config.botActive ? 'Aktiv' : 'Inaktiv'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Session ID:</span>
                <div className="flex items-center gap-2">
                  <code className="text-green-400 text-sm">{config.sessionId.substring(0, 12)}...</code>
                  <Button size="sm" variant="ghost" onClick={copySessionId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Verschlüsselung:</span>
                <span className={`px-2 py-1 rounded text-sm ${config.encryptionEnabled ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  {config.encryptionEnabled ? 'Aktiviert' : 'Deaktiviert'}
                </span>
              </div>
              {config.lastActivity && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Letzte Aktivität:</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(config.lastActivity).toLocaleString('de-DE')}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bot Setup */}
      {!config?.botActive && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-400" />
              Session Bot aktivieren
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleActivateBot} className="space-y-4">
              <div>
                <Label htmlFor="sessionId" className="text-gray-300">
                  Session ID (mindestens 32 Zeichen)
                </Label>
                <Input
                  id="sessionId"
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Geben Sie Ihre Session ID ein"
                  required
                  minLength={32}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={encryptionEnabled}
                  onCheckedChange={setEncryptionEnabled}
                />
                <Label className="text-gray-300">PGP Verschlüsselung aktivieren</Label>
              </div>

              {encryptionEnabled && (
                <div>
                  <Label htmlFor="pgpKey" className="text-gray-300">
                    PGP Public Key (optional)
                  </Label>
                  <Textarea
                    id="pgpKey"
                    value={pgpKey}
                    onChange={(e) => setPgpKey(e.target.value)}
                    className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                    placeholder="-----BEGIN PGP PUBLIC KEY BLOCK-----"
                    rows={4}
                  />
                </div>
              )}

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full">
                <Shield className="h-4 w-4 mr-2" />
                Bot aktivieren
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bot Downloads */}
      {config?.botActive && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-400" />
              Bot Installation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-200">Installationsanleitung:</h4>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Session CLI installieren: <code className="bg-gray-800 px-1 rounded">curl -LO https://getsession.org/session-cli.zip</code></li>
                  <li>Bot-Script herunterladen und ausführbar machen</li>
                  <li>Systemd Service für Autostart einrichten</li>
                  <li>Bot starten: <code className="bg-gray-800 px-1 rounded">sudo systemctl start loveable-bot-{session.pseudonym}</code></li>
                </ol>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={downloadBotScript} className="bg-purple-600 hover:bg-purple-700 flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Bot Script (.py)
                </Button>
                <Button onClick={downloadSystemdService} variant="outline" className="border-gray-600 flex-1">
                  <Key className="h-4 w-4 mr-2" />
                  Systemd Service
                </Button>
              </div>

              <Button 
                onClick={deactivateBot} 
                variant="destructive" 
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Bot deaktivieren
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionBotTab;
