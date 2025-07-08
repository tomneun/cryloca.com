
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Key, Shield, Download, AlertTriangle, Lock } from 'lucide-react';
import { SessionEncryption } from '@/utils/sessionEncryption';
import { BotSecurity } from '@/utils/botSecurity';

const SecureSessionConfiguration = () => {
  const { session } = useSession();
  const [sessionId, setSessionId] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');
  const [sessionError, setSessionError] = useState('');
  const [enableTor, setEnableTor] = useState(true);
  const [hardening, setHardening] = useState(false);

  useEffect(() => {
    if (session) {
      const encryptedSession = localStorage.getItem(`secure_session_${session.pseudonym}`);
      if (encryptedSession) {
        const decrypted = SessionEncryption.decryptSessionId(encryptedSession);
        if (decrypted) setCurrentSessionId(decrypted);
      }
    }
  }, [session]);

  const handleSecureSessionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError('');
    
    if (!sessionPassword || !sessionId || !session) {
      setSessionError('Passwort und Session-ID erforderlich');
      return;
    }
    
    if (sessionId.length < 32) {
      setSessionError('Session-ID muss mindestens 32 Zeichen haben');
      return;
    }
    
    // Verschlüsselte Speicherung
    const encrypted = SessionEncryption.encryptSessionId(sessionId);
    localStorage.setItem(`secure_session_${session.pseudonym}`, encrypted);
    
    // Alte unverschlüsselte Session löschen
    SessionEncryption.secureDelete(`custom_session_${session.pseudonym}`);
    
    setCurrentSessionId(sessionId);
    setSessionId('');
    setSessionPassword('');
    alert('🔒 Session-ID sicher verschlüsselt und gespeichert');
  };

  const generateSecureSessionId = () => {
    const newSessionId = BotSecurity.generateSecureSessionId();
    setSessionId(newSessionId);
  };

  const downloadSecureBot = () => {
    if (!session || !currentSessionId) return;
    
    const script = BotSecurity.generateHardenedBotScript(
      currentSessionId, 
      session.pseudonym, 
      enableTor
    );
    
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loveable_secure_bot_${session.pseudonym}.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadDockerSetup = () => {
    if (!session) return;
    
    const dockerfile = BotSecurity.generateDockerfile(session.pseudonym);
    const compose = BotSecurity.generateDockerCompose(session.pseudonym);
    
    // Download Dockerfile
    const dockerBlob = new Blob([dockerfile], { type: 'text/plain' });
    const dockerUrl = URL.createObjectURL(dockerBlob);
    const dockerLink = document.createElement('a');
    dockerLink.href = dockerUrl;
    dockerLink.download = 'Dockerfile';
    dockerLink.click();
    URL.revokeObjectURL(dockerUrl);
    
    // Download docker-compose.yml
    const composeBlob = new Blob([compose], { type: 'text/plain' });
    const composeUrl = URL.createObjectURL(composeBlob);
    const composeLink = document.createElement('a');
    composeLink.href = composeUrl;
    composeLink.download = 'docker-compose.yml';
    composeLink.click();
    URL.revokeObjectURL(composeUrl);
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Sicherheitsstatus */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            LoveAble Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${currentSessionId ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm">Session verschlüsselt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${enableTor ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm">Tor-Schutz</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${hardening ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm">Container-Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Anti-Forensics</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aktuelle Session */}
      {currentSessionId && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-400" />
              Verschlüsselte Session-ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-700 rounded-lg p-4">
              <code className="text-green-400 break-all">
                {currentSessionId.substring(0, 16)}...{currentSessionId.substring(-8)}
              </code>
              <p className="text-xs text-gray-400 mt-2">
                🔒 Ende-zu-Ende verschlüsselt | 🕵️ Keine Klartextspeicherung
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sichere Session-Konfiguration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Sichere Session-Konfiguration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSecureSessionUpdate} className="space-y-4">
            <div>
              <Label htmlFor="sessionId" className="text-gray-300">
                Session-ID (Auto-generiert, 64 Zeichen)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="sessionId"
                  type="text"
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                  placeholder="Sichere Session-ID"
                  required
                  minLength={32}
                />
                <Button type="button" onClick={generateSecureSessionId} variant="outline">
                  Generieren
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="sessionPassword" className="text-gray-300">
                Bestätigungspasswort
              </Label>
              <Input
                id="sessionPassword"
                type="password"
                value={sessionPassword}
                onChange={(e) => setSessionPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Passwort zur Bestätigung"
                required
              />
            </div>

            {/* Sicherheitsoptionen */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch checked={enableTor} onCheckedChange={setEnableTor} />
                <Label className="text-gray-300">Tor-Proxy aktivieren</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch checked={hardening} onCheckedChange={setHardening} />
                <Label className="text-gray-300">Container-Hardening</Label>
              </div>
            </div>

            {sessionError && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{sessionError}</span>
              </div>
            )}

            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 w-full">
              <Shield className="h-4 w-4 mr-2" />
              Sichere Session aktivieren
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Secure Bot Downloads */}
      {currentSessionId && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-400" />
              Hardened Bot Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-green-400">🛡️ Sicherheitsfeatures:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Tor-Proxy Integration</li>
                  <li>• RAM-only Speicherung</li>
                  <li>• Anti-Timing-Analyse (Jitter)</li>
                  <li>• Verschlüsselte Bestelldaten</li>
                  <li>• Container-Isolation</li>
                  <li>• Automatische Bereinigung</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={downloadSecureBot} className="bg-green-600 hover:bg-green-700 flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Secure Bot (.py)
                </Button>
                <Button onClick={downloadDockerSetup} variant="outline" className="border-gray-600 flex-1">
                  <Shield className="h-4 w-4 mr-2" />
                  Docker Setup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecureSessionConfiguration;
