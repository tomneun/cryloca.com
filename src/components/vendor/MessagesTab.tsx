import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Mail, Phone } from 'lucide-react';
import { useSession } from '@/hooks/useSession';

interface Message {
  id: string;
  contactMethod: 'session' | 'signal';
  contactValue: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const MessagesTab = () => {
  const { session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (session) {
      const stored = localStorage.getItem(`vendor_messages_${session.pseudonym}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    }
  }, [session]);

  const markAsRead = (messageId: string) => {
    const updated = messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    setMessages(updated);
    if (session) {
      localStorage.setItem(`vendor_messages_${session.pseudonym}`, JSON.stringify(updated));
    }
  };

  const deleteMessage = (messageId: string) => {
    const updated = messages.filter(msg => msg.id !== messageId);
    setMessages(updated);
    if (session) {
      localStorage.setItem(`vendor_messages_${session.pseudonym}`, JSON.stringify(updated));
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-blue-400" />
            Customer Messages
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <Card 
                  key={msg.id} 
                  className={`border ${msg.read ? 'border-gray-600 bg-gray-700/50' : 'border-blue-500 bg-gray-700'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {msg.contactMethod === 'session' ? (
                          <Mail className="h-4 w-4 text-blue-400" />
                        ) : (
                          <Phone className="h-4 w-4 text-green-400" />
                        )}
                        <span className="text-sm font-medium text-gray-300">
                          {msg.contactMethod === 'session' ? 'Session ID' : 'Signal'}
                        </span>
                        {!msg.read && (
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">NEW</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="mb-3 p-3 bg-gray-800 rounded border border-gray-600">
                      <p className="text-xs text-gray-400 mb-1">Contact:</p>
                      <p className="text-sm font-mono text-gray-200 break-all">{msg.contactValue}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    <div className="flex gap-2">
                      {!msg.read && (
                        <Button
                          size="sm"
                          onClick={() => markAsRead(msg.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMessage(msg.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
