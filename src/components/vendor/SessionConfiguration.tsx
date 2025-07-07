
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, AlertCircle } from 'lucide-react';
import { validateSessionId } from '@/utils/validationUtils';

const SessionConfiguration = () => {
  const { session } = useSession();
  const [sessionId, setSessionId] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    if (session) {
      const savedSession = localStorage.getItem(`custom_session_${session.pseudonym}`);
      if (savedSession) setCurrentSessionId(savedSession);
    }
  }, [session]);

  const handleSessionUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError('');
    
    if (!sessionPassword || !sessionId || !session) {
      setSessionError('Bitte geben Sie Ihr Passwort und die Session-ID ein');
      return;
    }
    
    if (!validateSessionId(sessionId)) {
      setSessionError('Ungültige Session-ID. Sie muss 32-64 Zeichen lang sein und nur Buchstaben und Zahlen enthalten.');
      return;
    }
    
    localStorage.setItem(`custom_session_${session.pseudonym}`, sessionId);
    setCurrentSessionId(sessionId);
    
    setSessionId('');
    setSessionPassword('');
    alert('Session-ID erfolgreich aktualisiert');
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Current Session ID Display */}
      {currentSessionId && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-green-400" />
              Aktuelle Session-ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-700 rounded-lg p-4">
              <code className="text-green-400 break-all">{currentSessionId}</code>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session ID Configuration */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-400" />
            Session-ID ändern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSessionUpdate} className="space-y-4">
            <div>
              <Label htmlFor="sessionId" className="text-gray-300">
                Neue Session-ID (32-64 Zeichen, nur Buchstaben und Zahlen)
              </Label>
              <Input
                id="sessionId"
                type="text"
                value={sessionId}
                onChange={(e) => {
                  setSessionId(e.target.value);
                  setSessionError('');
                }}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihre neue Session-ID ein"
                required
                minLength={32}
                maxLength={64}
              />
              {sessionError && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{sessionError}</span>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="sessionPassword" className="text-gray-300">
                Passwort zur Bestätigung
              </Label>
              <Input
                id="sessionPassword"
                type="password"
                value={sessionPassword}
                onChange={(e) => setSessionPassword(e.target.value)}
                className="mt-1 bg-gray-700 border-gray-600 text-gray-100"
                placeholder="Geben Sie Ihr Passwort ein"
                required
              />
            </div>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Session-ID aktualisieren
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionConfiguration;
