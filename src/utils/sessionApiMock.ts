
// Mock API functions for Session bot integration
// In production, these would be actual API calls to your backend

export interface SessionApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export class SessionApiMock {
  static async sendMessage(sessionId: string, message: string, encrypted = false): Promise<SessionApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`[Mock API] Sending message to Session ID: ${sessionId}`);
    console.log(`[Mock API] Message: ${message}`);
    console.log(`[Mock API] Encrypted: ${encrypted}`);
    
    // Simulate successful sending
    return {
      success: true,
      message: 'Message sent successfully'
    };
  }

  static async registerBot(shopPseudonym: string, sessionId: string): Promise<SessionApiResponse> {
    console.log(`[Mock API] Registering bot for shop: ${shopPseudonym} with Session ID: ${sessionId}`);
    
    // Store in localStorage as mock database
    const registeredBots = JSON.parse(localStorage.getItem('registered_session_bots') || '{}');
    registeredBots[shopPseudonym] = {
      sessionId,
      registeredAt: new Date().toISOString(),
      active: true
    };
    localStorage.setItem('registered_session_bots', JSON.stringify(registeredBots));
    
    return {
      success: true,
      message: 'Bot registered successfully'
    };
  }

  static async deregisterBot(shopPseudonym: string): Promise<SessionApiResponse> {
    console.log(`[Mock API] Deregistering bot for shop: ${shopPseudonym}`);
    
    const registeredBots = JSON.parse(localStorage.getItem('registered_session_bots') || '{}');
    if (registeredBots[shopPseudonym]) {
      registeredBots[shopPseudonym].active = false;
      localStorage.setItem('registered_session_bots', JSON.stringify(registeredBots));
    }
    
    return {
      success: true,
      message: 'Bot deregistered successfully'
    };
  }

  static async getBotStatus(shopPseudonym: string): Promise<SessionApiResponse & { data?: any }> {
    const registeredBots = JSON.parse(localStorage.getItem('registered_session_bots') || '{}');
    const botData = registeredBots[shopPseudonym];
    
    return {
      success: true,
      data: botData || null
    };
  }
}
