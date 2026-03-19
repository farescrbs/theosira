// Payment API Service - Multi-Payment Support

export interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
  addedAt: number;
}

export interface CryptoWallet {
  id: string;
  type: 'btc' | 'eth' | 'usdt' | 'usdc' | 'bnb' | 'sol';
  address: string;
  balance: number;
  network: string;
  isDefault: boolean;
}

export interface MobilePayment {
  id: string;
  type: 'apple_pay' | 'google_pay' | 'samsung_pay' | 'paypal';
  email?: string;
  phone?: string;
  isDefault: boolean;
  verified: boolean;
}

export interface PaymentMethod {
  id: string;
  category: 'card' | 'crypto' | 'mobile';
  method: PaymentCard | CryptoWallet | MobilePayment;
  enabled: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: number;
  description: string;
}

// Mock payment cards
const MOCK_CARDS: PaymentCard[] = [
  {
    id: 'card-1',
    type: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2026',
    holderName: 'John Doe',
    isDefault: true,
    addedAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'card-2',
    type: 'mastercard',
    last4: '5555',
    expiryMonth: '06',
    expiryYear: '2027',
    holderName: 'John Doe',
    isDefault: false,
    addedAt: Date.now() - 86400000 * 60,
  },
];

// Mock crypto wallets
const MOCK_WALLETS: CryptoWallet[] = [
  {
    id: 'wallet-1',
    type: 'eth',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    balance: 2.5,
    network: 'Ethereum',
    isDefault: true,
  },
  {
    id: 'wallet-2',
    type: 'btc',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    balance: 0.15,
    network: 'Bitcoin',
    isDefault: false,
  },
  {
    id: 'wallet-3',
    type: 'usdt',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    balance: 5000,
    network: 'Ethereum (ERC20)',
    isDefault: false,
  },
];

// Mock mobile payments
const MOCK_MOBILE_PAYMENTS: MobilePayment[] = [
  {
    id: 'mobile-1',
    type: 'apple_pay',
    email: 'user@icloud.com',
    isDefault: true,
    verified: true,
  },
  {
    id: 'mobile-2',
    type: 'google_pay',
    email: 'user@gmail.com',
    isDefault: false,
    verified: true,
  },
  {
    id: 'mobile-3',
    type: 'paypal',
    email: 'user@paypal.com',
    isDefault: false,
    verified: true,
  },
];

// Mock transactions
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    amount: 299,
    currency: 'USD',
    method: 'Visa •••• 4242',
    status: 'completed',
    date: Date.now() - 86400000 * 5,
    description: 'Premium Vault Subscription',
  },
  {
    id: 'tx-2',
    amount: 0.05,
    currency: 'ETH',
    method: 'Ethereum Wallet',
    status: 'completed',
    date: Date.now() - 86400000 * 15,
    description: 'NFT Marketplace Fee',
  },
  {
    id: 'tx-3',
    amount: 99,
    currency: 'USD',
    method: 'Apple Pay',
    status: 'completed',
    date: Date.now() - 86400000 * 30,
    description: 'Domain Registration',
  },
];

// Payment Service
class PaymentService {
  private cards: PaymentCard[] = MOCK_CARDS;
  private wallets: CryptoWallet[] = MOCK_WALLETS;
  private mobilePayments: MobilePayment[] = MOCK_MOBILE_PAYMENTS;
  private transactions: Transaction[] = MOCK_TRANSACTIONS;

  // Get all payment cards
  getCards(): PaymentCard[] {
    return this.cards;
  }

  // Get all crypto wallets
  getWallets(): CryptoWallet[] {
    return this.wallets;
  }

  // Get all mobile payments
  getMobilePayments(): MobilePayment[] {
    return this.mobilePayments;
  }

  // Get all transactions
  getTransactions(): Transaction[] {
    return this.transactions;
  }

  // Add payment card
  async addCard(card: Omit<PaymentCard, 'id' | 'addedAt'>): Promise<PaymentCard> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newCard: PaymentCard = {
      ...card,
      id: `card-${Date.now()}`,
      addedAt: Date.now(),
    };
    
    this.cards.push(newCard);
    return newCard;
  }

  // Add crypto wallet
  async addWallet(wallet: Omit<CryptoWallet, 'id'>): Promise<CryptoWallet> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newWallet: CryptoWallet = {
      ...wallet,
      id: `wallet-${Date.now()}`,
    };
    
    this.wallets.push(newWallet);
    return newWallet;
  }

  // Add mobile payment
  async addMobilePayment(payment: Omit<MobilePayment, 'id' | 'verified'>): Promise<MobilePayment> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPayment: MobilePayment = {
      ...payment,
      id: `mobile-${Date.now()}`,
      verified: true,
    };
    
    this.mobilePayments.push(newPayment);
    return newPayment;
  }

  // Remove payment method
  async removeCard(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.cards = this.cards.filter(c => c.id !== id);
    return true;
  }

  async removeWallet(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.wallets = this.wallets.filter(w => w.id !== id);
    return true;
  }

  async removeMobilePayment(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.mobilePayments = this.mobilePayments.filter(m => m.id !== id);
    return true;
  }

  // Set default payment method
  async setDefaultCard(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.cards = this.cards.map(c => ({
      ...c,
      isDefault: c.id === id,
    }));
    return true;
  }

  async setDefaultWallet(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.wallets = this.wallets.map(w => ({
      ...w,
      isDefault: w.id === id,
    }));
    return true;
  }

  async setDefaultMobilePayment(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.mobilePayments = this.mobilePayments.map(m => ({
      ...m,
      isDefault: m.id === id,
    }));
    return true;
  }

  // Process payment
  async processPayment(amount: number, currency: string, methodId: string): Promise<Transaction> {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      amount,
      currency,
      method: methodId,
      status: 'completed',
      date: Date.now(),
      description: 'Payment processed',
    };
    
    this.transactions.unshift(transaction);
    return transaction;
  }

  // Get payment stats
  getStats() {
    return {
      totalCards: this.cards.length,
      totalWallets: this.wallets.length,
      totalMobilePayments: this.mobilePayments.length,
      totalTransactions: this.transactions.length,
      totalSpent: this.transactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.currency === 'USD' ? t.amount : 0), 0),
    };
  }
}

// Export singleton
export const paymentService = new PaymentService();

// Export functions
export function getPaymentCards(): PaymentCard[] {
  return paymentService.getCards();
}

export function getCryptoWallets(): CryptoWallet[] {
  return paymentService.getWallets();
}

export function getMobilePayments(): MobilePayment[] {
  return paymentService.getMobilePayments();
}

export function getTransactions(): Transaction[] {
  return paymentService.getTransactions();
}

export async function addPaymentCard(card: Omit<PaymentCard, 'id' | 'addedAt'>): Promise<PaymentCard> {
  return paymentService.addCard(card);
}

export async function addCryptoWallet(wallet: Omit<CryptoWallet, 'id'>): Promise<CryptoWallet> {
  return paymentService.addWallet(wallet);
}

export async function addMobilePayment(payment: Omit<MobilePayment, 'id' | 'verified'>): Promise<MobilePayment> {
  return paymentService.addMobilePayment(payment);
}

export async function removePaymentCard(id: string): Promise<boolean> {
  return paymentService.removeCard(id);
}

export async function removeCryptoWallet(id: string): Promise<boolean> {
  return paymentService.removeWallet(id);
}

export async function removeMobilePayment(id: string): Promise<boolean> {
  return paymentService.removeMobilePayment(id);
}

export async function setDefaultCard(id: string): Promise<boolean> {
  return paymentService.setDefaultCard(id);
}

export async function setDefaultWallet(id: string): Promise<boolean> {
  return paymentService.setDefaultWallet(id);
}

export async function setDefaultMobilePayment(id: string): Promise<boolean> {
  return paymentService.setDefaultMobilePayment(id);
}

export async function processPayment(amount: number, currency: string, methodId: string): Promise<Transaction> {
  return paymentService.processPayment(amount, currency, methodId);
}

export function getPaymentStats() {
  return paymentService.getStats();
}
