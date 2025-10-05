import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bot, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TelegramBotTab = () => {
  const { session } = useSession();
  const [botEnabled, setBotEnabled] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [groupId, setGroupId] = useState('');
  const [savedBotToken, setSavedBotToken] = useState('');
  const [savedGroupId, setSavedGroupId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.pseudonym) {
      const saved = localStorage.getItem(`telegram_bot_${session.pseudonym}`);
      if (saved) {
        const data = JSON.parse(saved);
        setBotEnabled(data.enabled || false);
        setSavedBotToken(data.botToken || '');
        setSavedGroupId(data.groupId || '');
        setBotToken(data.botToken || '');
        setGroupId(data.groupId || '');
      }
    }
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (botEnabled && (!botToken || !groupId)) {
      setError('Bot Token and Group ID are required when bot is enabled');
      return;
    }

    if (session?.pseudonym) {
      const data = {
        enabled: botEnabled,
        botToken: botToken,
        groupId: groupId,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`telegram_bot_${session.pseudonym}`, JSON.stringify(data));
      setSavedBotToken(botToken);
      setSavedGroupId(groupId);
      alert('Telegram Bot configuration saved!');
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Bot className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold text-gray-100">Telegram Bot Integration</h2>
            <p className="text-gray-400">Manage your shop via Telegram (Optional)</p>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-500/10 border-blue-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            With Telegram Bot enabled, you can manage all shop functions directly from Telegram.
            This is completely optional - you can still use the web interface.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
            <div>
              <Label className="text-lg">Enable Telegram Bot</Label>
              <p className="text-sm text-gray-400">Turn on to configure bot integration</p>
            </div>
            <Switch
              checked={botEnabled}
              onCheckedChange={setBotEnabled}
            />
          </div>

          {botEnabled && (
            <div className="space-y-4 p-4 bg-gray-700/50 rounded-lg">
              <div>
                <Label htmlFor="botToken">Bot Token</Label>
                <Input
                  id="botToken"
                  type="password"
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="bg-gray-800 border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Get from @BotFather on Telegram
                </p>
              </div>

              <div>
                <Label htmlFor="groupId">Group ID</Label>
                <Input
                  id="groupId"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  placeholder="-1001234567890"
                  className="bg-gray-800 border-gray-600"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Use @userinfobot in your group to get the ID
                </p>
              </div>

              {error && (
                <Alert className="bg-red-500/10 border-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-800 p-4 rounded border border-gray-600">
                <h3 className="text-sm font-semibold text-gray-200 mb-2">Setup Instructions:</h3>
                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                  <li>Create a bot with @BotFather on Telegram</li>
                  <li>Copy the bot token and paste above</li>
                  <li>Create a private group and add your bot</li>
                  <li>Add @userinfobot to get the group ID</li>
                  <li>Remove @userinfobot and paste the ID above</li>
                  <li>Save configuration and start managing via Telegram!</li>
                </ol>
              </div>

              <div className="bg-blue-500/10 border border-blue-500 rounded p-4">
                <h3 className="text-sm font-semibold text-blue-400 mb-2">Available Commands:</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li><code className="bg-gray-800 px-1 rounded">/orders</code> - View all orders</li>
                  <li><code className="bg-gray-800 px-1 rounded">/products</code> - List all products</li>
                  <li><code className="bg-gray-800 px-1 rounded">/stats</code> - Shop statistics</li>
                  <li><code className="bg-gray-800 px-1 rounded">/neworder</code> - Get notified of new orders</li>
                </ul>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full">
            Save Telegram Bot Configuration
          </Button>
        </form>

        {savedBotToken && botEnabled && (
          <div className="mt-6 p-4 bg-green-500/10 border border-green-500 rounded">
            <p className="text-sm text-green-400 font-semibold">✓ Bot is configured and active</p>
            <p className="text-xs text-gray-400 mt-1">Group ID: {savedGroupId}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TelegramBotTab;
