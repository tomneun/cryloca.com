
export const validateUSDTAddress = (address: string): boolean => {
  // USDT can be on multiple networks, we'll check for common formats
  const tronRegex = /^T[A-Za-z0-9]{33}$/; // Tron (TRC-20)
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/; // Ethereum (ERC-20)
  const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/; // Bitcoin (Omni)
  
  return tronRegex.test(address) || ethereumRegex.test(address) || bitcoinRegex.test(address);
};

export const validateSessionId = (sessionId: string): boolean => {
  // Session ID should be 32-64 characters long, alphanumeric
  const sessionRegex = /^[a-zA-Z0-9]{32,64}$/;
  return sessionRegex.test(sessionId);
};
