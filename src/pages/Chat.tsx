
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react';

const Chat = () => {
  const { withPseudonym } = useParams<{ withPseudonym: string }>();
  const { session } = useSession();
  const [messages, setMessages] = useState<Array<{id: string, from: string, text: string, timestamp: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();

  if (!session || !withPseudonym) {
    navigate('/');
    return null;
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      from: session.pseudonym,
      text: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/90 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-red-500" />
              <h1 className="text-xl font-bold">Chat mit @{withPseudonym}</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 container mx-auto px-4 py-4 flex flex-col max-w-2xl">
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mb-4">
          <p className="text-yellow-300 text-sm">
            <strong>Demo-Chat:</strong> Nachrichten werden nur lokal gespeichert. 
            In der echten Version würde Ende-zu-Ende-Verschlüsselung verwendet.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 mb-4 min-h-0 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-600" />
              <p>Keine Nachrichten. Schreiben Sie die erste Nachricht!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.from === session.pseudonym ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.from === session.pseudonym
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 border border-gray-700'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.from === session.pseudonym ? 'text-red-200' : 'text-gray-400'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString('de-DE')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nachricht eingeben..."
            className="bg-gray-800 border-gray-600 text-gray-100 focus:border-red-500"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
