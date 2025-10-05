import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VendorContactProps {
  vendorPseudonym: string;
}

const VendorContact = ({ vendorPseudonym }: VendorContactProps) => {
  const [contactMethod, setContactMethod] = useState<'session' | 'signal'>('session');
  const [contactValue, setContactValue] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactValue || !message) {
      alert('Please fill in all fields');
      return;
    }

    // Save message for vendor
    const messages = JSON.parse(localStorage.getItem(`vendor_messages_${vendorPseudonym}`) || '[]');
    messages.push({
      id: 'MSG-' + Date.now(),
      contactMethod,
      contactValue,
      message,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem(`vendor_messages_${vendorPseudonym}`, JSON.stringify(messages));

    setSent(true);
    setContactValue('');
    setMessage('');

    setTimeout(() => setSent(false), 5000);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <MessageCircle className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-bold text-gray-100">Contact Vendor</h3>
      </div>

      {sent && (
        <Alert className="mb-4 bg-green-500/10 border-green-500">
          <AlertDescription className="text-green-400">
            Message sent! The vendor will contact you via your provided contact method.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <Label className="mb-2 block">Your Contact Method</Label>
          <RadioGroup value={contactMethod} onValueChange={(v: any) => setContactMethod(v)}>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="session" id="contact-session" />
                <Label htmlFor="contact-session" className="cursor-pointer">Session-ID</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="signal" id="contact-signal" />
                <Label htmlFor="contact-signal" className="cursor-pointer">Signal Number</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="contactValue">
            {contactMethod === 'session' ? 'Your Session-ID' : 'Your Signal Number'}
          </Label>
          <Input
            id="contactValue"
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={contactMethod === 'session' ? 'Session ID' : 'Signal Number'}
            className="bg-gray-700 border-gray-600"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            The vendor will use this to reply to you
          </p>
        </div>

        <div>
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message to the vendor..."
            className="bg-gray-700 border-gray-600 min-h-[120px]"
            required
          />
        </div>

        <Alert className="bg-blue-500/10 border-blue-500">
          <AlertDescription className="text-sm text-blue-400">
            Note: The vendor cannot reply here. They will contact you via your Session-ID or Signal Number.
          </AlertDescription>
        </Alert>

        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Card>
  );
};

export default VendorContact;
