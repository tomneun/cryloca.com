
export interface OrderNotification {
  orderId: string;
  shopPseudonym: string;
  customerPseudonym?: string;
  products: Array<{
    id: string;
    title: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  currency: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'delivered';
}

export class SessionNotificationService {
  private static async getSessionBotConfig(pseudonym: string) {
    const config = localStorage.getItem(`session_bot_${pseudonym}`);
    return config ? JSON.parse(config) : null;
  }

  private static async sendSessionMessage(sessionId: string, message: string, encrypted = false) {
    // In a real implementation, this would make an API call to your backend
    // which would then use the session-cli to send the message
    console.log(`[Session Bot] Sending message to ${sessionId}:`, message);
    
    // For now, we'll simulate the message sending
    // In production, you'd have a backend endpoint like:
    // POST /api/session/send-message
    // { sessionId, message, encrypted }
    
    try {
      const response = await fetch('/api/session/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          encrypted
        })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Failed to send session message:', error);
      return false;
    }
  }

  static async notifyNewOrder(order: OrderNotification) {
    const botConfig = await this.getSessionBotConfig(order.shopPseudonym);
    
    if (!botConfig || !botConfig.botActive) {
      console.log(`[Session Bot] No active bot for shop: ${order.shopPseudonym}`);
      return false;
    }

    const orderMessage = {
      type: 'NEW_ORDER',
      orderId: order.orderId,
      shop: order.shopPseudonym,
      customer: order.customerPseudonym || 'Anonym',
      products: order.products,
      total: `${order.totalAmount} ${order.currency}`,
      timestamp: order.timestamp,
      status: order.status
    };

    const messageText = `🛒 NEUE BESTELLUNG #${order.orderId}

Shop: ${order.shopPseudonym}
Kunde: ${order.customerPseudonym || 'Anonym'}
Gesamtbetrag: ${order.totalAmount} ${order.currency}

Produkte:
${order.products.map(p => `- ${p.title} (${p.quantity}x ${p.price} ${order.currency})`).join('\n')}

Zeit: ${new Date(order.timestamp).toLocaleString('de-DE')}
Status: ${order.status}

---
LoveAble Session Bot
`;

    try {
      const success = await this.sendSessionMessage(
        botConfig.sessionId,
        botConfig.encryptionEnabled ? JSON.stringify(orderMessage) : messageText,
        botConfig.encryptionEnabled
      );

      if (success) {
        console.log(`[Session Bot] Order notification sent successfully to ${order.shopPseudonym}`);
        
        // Update last activity
        botConfig.lastActivity = new Date().toISOString();
        localStorage.setItem(`session_bot_${order.shopPseudonym}`, JSON.stringify(botConfig));
      }

      return success;
    } catch (error) {
      console.error('Failed to notify shop owner:', error);
      return false;
    }
  }

  static async notifyOrderStatusChange(orderId: string, shopPseudonym: string, newStatus: string) {
    const botConfig = await this.getSessionBotConfig(shopPseudonym);
    
    if (!botConfig || !botConfig.botActive) {
      return false;
    }

    const statusMessage = `📦 BESTELLSTATUS AKTUALISIERT

Bestellung: #${orderId}
Neuer Status: ${newStatus}
Zeit: ${new Date().toLocaleString('de-DE')}

---
LoveAble Session Bot
`;

    return await this.sendSessionMessage(botConfig.sessionId, statusMessage, botConfig.encryptionEnabled);
  }
}
