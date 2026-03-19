// Universal Authentication Service - Multi-Wallet & Multi-Device Connection

export interface WalletProvider {
  id: string;
  name: string;
  icon: string;
  type: 'web3' | 'email' | 'social' | 'biometric';
  available: boolean;
  description: string;
}

export interface ConnectedAccount {
  id: string;
  provider: string;
  address?: string;
  email?: string;
  username?: string;
  connectedAt: number;
  verified: boolean;
  isPrimary: boolean;
}

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  os: string;
  browser: string;
  lastActive: number;
  trusted: boolean;
}

export interface AuthSession {
  sessionId: string;
  userId: string;
  accounts: ConnectedAccount[];
  devices: DeviceInfo[];
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  createdAt: number;
  expiresAt: number;
}

// Available wallet providers
export const WALLET_PROVIDERS: WalletProvider[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    type: 'web3',
    available: true,
    description: 'Connexion avec MetaMask',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    type: 'web3',
    available: true,
    description: 'Scanner avec votre wallet mobile',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    type: 'web3',
    available: true,
    description: 'Connexion avec Coinbase Wallet',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    type: 'web3',
    available: true,
    description: 'Wallet Solana premium',
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '⚡',
    type: 'web3',
    available: true,
    description: 'Connexion avec Trust Wallet',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    icon: '🔐',
    type: 'web3',
    available: true,
    description: 'Hardware wallet sécurisé',
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    type: 'email',
    available: true,
    description: 'Connexion par email + mot de passe',
  },
  {
    id: 'google',
    name: 'Google',
    icon: '🔴',
    type: 'social',
    available: true,
    description: 'Connexion avec Google',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '🍎',
    type: 'social',
    available: true,
    description: 'Connexion avec Apple ID',
  },
  {
    id: 'biometric',
    name: 'Biométrique',
    icon: '👆',
    type: 'biometric',
    available: true,
    description: 'Face ID / Touch ID / Fingerprint',
  },
];

// Mock connected accounts
const MOCK_ACCOUNTS: ConnectedAccount[] = [
  {
    id: 'acc-1',
    provider: 'metamask',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    connectedAt: Date.now() - 86400000 * 7,
    verified: true,
    isPrimary: true,
  },
  {
    id: 'acc-2',
    provider: 'email',
    email: 'user@thesoria.com',
    connectedAt: Date.now() - 86400000 * 30,
    verified: true,
    isPrimary: false,
  },
  {
    id: 'acc-3',
    provider: 'google',
    email: 'user@gmail.com',
    username: 'CryptoUser',
    connectedAt: Date.now() - 86400000 * 15,
    verified: true,
    isPrimary: false,
  },
];

// Mock devices
const MOCK_DEVICES: DeviceInfo[] = [
  {
    id: 'dev-1',
    name: 'MacBook Pro',
    type: 'desktop',
    os: 'macOS 14.0',
    browser: 'Chrome 120',
    lastActive: Date.now() - 3600000,
    trusted: true,
  },
  {
    id: 'dev-2',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    os: 'iOS 17.2',
    browser: 'Safari',
    lastActive: Date.now() - 7200000,
    trusted: true,
  },
  {
    id: 'dev-3',
    name: 'iPad Air',
    type: 'tablet',
    os: 'iPadOS 17.1',
    browser: 'Safari',
    lastActive: Date.now() - 86400000 * 2,
    trusted: false,
  },
];

// Universal Auth Service
class UniversalAuthService {
  private session: AuthSession | null = null;

  // Connect with provider
  async connect(providerId: string, credentials?: any): Promise<ConnectedAccount> {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const provider = WALLET_PROVIDERS.find(p => p.id === providerId);
    if (!provider) throw new Error('Provider not found');

    const account: ConnectedAccount = {
      id: `acc-${Date.now()}`,
      provider: providerId,
      connectedAt: Date.now(),
      verified: true,
      isPrimary: false,
    };

    // Add provider-specific data
    if (provider.type === 'web3') {
      account.address = this.generateAddress();
    } else if (provider.type === 'email' || provider.type === 'social') {
      account.email = credentials?.email || 'user@example.com';
      account.username = credentials?.username;
    }

    return account;
  }

  // Disconnect account
  async disconnect(accountId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }

  // Get current session
  getSession(): AuthSession | null {
    if (!this.session) {
      this.session = {
        sessionId: `session-${Date.now()}`,
        userId: 'user-12345',
        accounts: MOCK_ACCOUNTS,
        devices: MOCK_DEVICES,
        twoFactorEnabled: true,
        biometricEnabled: true,
        createdAt: Date.now() - 86400000 * 7,
        expiresAt: Date.now() + 86400000 * 30,
      };
    }
    return this.session;
  }

  // Get connected accounts
  getAccounts(): ConnectedAccount[] {
    return this.getSession()?.accounts || [];
  }

  // Get devices
  getDevices(): DeviceInfo[] {
    return this.getSession()?.devices || [];
  }

  // Set primary account
  async setPrimaryAccount(accountId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const session = this.getSession();
    if (!session) return false;

    session.accounts = session.accounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === accountId,
    }));
    return true;
  }

  // Remove device
  async removeDevice(deviceId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const session = this.getSession();
    if (!session) return false;

    session.devices = session.devices.filter(d => d.id !== deviceId);
    return true;
  }

  // Trust device
  async trustDevice(deviceId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const session = this.getSession();
    if (!session) return false;

    session.devices = session.devices.map(d => 
      d.id === deviceId ? { ...d, trusted: true } : d
    );
    return true;
  }

  // Enable 2FA
  async enable2FA(): Promise<{ secret: string; qrCode: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const session = this.getSession();
    if (session) {
      session.twoFactorEnabled = true;
    }
    return {
      secret: 'JBSWY3DPEHPK3PXP',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    };
  }

  // Disable 2FA
  async disable2FA(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const session = this.getSession();
    if (session) {
      session.twoFactorEnabled = false;
    }
    return true;
  }

  // Enable biometric
  async enableBiometric(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const session = this.getSession();
    if (session) {
      session.biometricEnabled = true;
    }
    return true;
  }

  // Disable biometric
  async disableBiometric(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const session = this.getSession();
    if (session) {
      session.biometricEnabled = false;
    }
    return true;
  }

  // Export vault data
  async exportData(): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const data = {
      accounts: this.getAccounts(),
      exportedAt: Date.now(),
      version: '1.0.0',
    };
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  // Import vault data
  async importData(file: File): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  }

  // Sync across devices
  async syncDevices(): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return true;
  }

  // Generate mock wallet address
  private generateAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)];
    }
    return address;
  }

  // Get stats
  getStats() {
    const session = this.getSession();
    return {
      totalAccounts: session?.accounts.length || 0,
      connectedDevices: session?.devices.length || 0,
      trustedDevices: session?.devices.filter(d => d.trusted).length || 0,
      securityScore: this.calculateSecurityScore(),
    };
  }

  // Calculate security score
  private calculateSecurityScore(): number {
    const session = this.getSession();
    if (!session) return 0;

    let score = 60; // Base score

    // Multiple accounts
    if (session.accounts.length > 1) score += 10;
    if (session.accounts.length > 2) score += 5;

    // 2FA enabled
    if (session.twoFactorEnabled) score += 15;

    // Biometric enabled
    if (session.biometricEnabled) score += 10;

    return Math.min(score, 100);
  }
}

// Export singleton
export const authService = new UniversalAuthService();

// Export functions
export async function connectWallet(providerId: string, credentials?: any): Promise<ConnectedAccount> {
  return authService.connect(providerId, credentials);
}

export async function disconnectAccount(accountId: string): Promise<boolean> {
  return authService.disconnect(accountId);
}

export function getAuthSession(): AuthSession | null {
  return authService.getSession();
}

export function getConnectedAccounts(): ConnectedAccount[] {
  return authService.getAccounts();
}

export function getConnectedDevices(): DeviceInfo[] {
  return authService.getDevices();
}

export async function setPrimaryAccount(accountId: string): Promise<boolean> {
  return authService.setPrimaryAccount(accountId);
}

export async function removeDevice(deviceId: string): Promise<boolean> {
  return authService.removeDevice(deviceId);
}

export async function trustDevice(deviceId: string): Promise<boolean> {
  return authService.trustDevice(deviceId);
}

export async function enable2FA(): Promise<{ secret: string; qrCode: string }> {
  return authService.enable2FA();
}

export async function disable2FA(): Promise<boolean> {
  return authService.disable2FA();
}

export async function enableBiometric(): Promise<boolean> {
  return authService.enableBiometric();
}

export async function disableBiometric(): Promise<boolean> {
  return authService.disableBiometric();
}

export async function exportVaultData(): Promise<Blob> {
  return authService.exportData();
}

export async function importVaultData(file: File): Promise<boolean> {
  return authService.importData(file);
}

export async function syncAcrossDevices(): Promise<boolean> {
  return authService.syncDevices();
}

export function getAuthStats() {
  return authService.getStats();
}

export function getAvailableProviders(): WalletProvider[] {
  return WALLET_PROVIDERS;
}
