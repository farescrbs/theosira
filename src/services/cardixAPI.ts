// Cardix API Service - Crypto Payment Card Integration
// API: https://cardix.me | Partner Code: NKFDRXGE
// Documentation: Cardix provides virtual & physical crypto-funded debit cards

const CARDIX_BASE_URL = 'https://cardix.me';
const CARDIX_PARTNER_CODE = 'NKFDRXGE';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CardixConfig {
  baseUrl: string;
  partnerCode: string;
  apiVersion: string;
}

export interface CardixCardRequest {
  type: 'virtual' | 'physical';
  currency: 'EUR' | 'USD' | 'GBP';
  tier: 'standard' | 'premium' | 'black';
  fundingSource: 'btc' | 'eth' | 'usdt' | 'usdc' | 'matic' | 'sol';
  holderFirstName: string;
  holderLastName: string;
  email: string;
  dailyLimit?: number;
  monthlyLimit?: number;
  label?: string;
}

export interface CardixCard {
  id: string;
  cardId: string;
  maskedPan: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cvv?: string;
  type: 'virtual' | 'physical';
  tier: 'standard' | 'premium' | 'black';
  currency: 'EUR' | 'USD' | 'GBP';
  status: 'active' | 'frozen' | 'pending' | 'blocked';
  fundingSource: string;
  balance: number;
  dailyLimit: number;
  monthlyLimit: number;
  dailySpent: number;
  monthlySpent: number;
  holderName: string;
  email: string;
  label: string;
  createdAt: string;
  activatedAt?: string;
  network: 'visa' | 'mastercard';
  is3DSecure: boolean;
  contactless: boolean;
  onlinePayments: boolean;
  atmWithdrawal: boolean;
  internationalPayments: boolean;
}

export interface CardixTransaction {
  id: string;
  cardId: string;
  type: 'purchase' | 'atm' | 'refund' | 'topup' | 'fee';
  merchant: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'declined' | 'refunded';
  category: string;
  mcc: string;
  country: string;
  timestamp: string;
  authCode?: string;
}

export interface CardixTopUpRequest {
  cardId: string;
  amount: number;
  fromCrypto: 'btc' | 'eth' | 'usdt' | 'usdc' | 'matic' | 'sol';
  network?: string;
}

export interface CardixTopUpResponse {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  depositAddress: string;
  amount: number;
  cryptoAmount: number;
  cryptoCurrency: string;
  exchangeRate: number;
  fee: number;
  expiresAt: string;
}

export interface CardixFees {
  cardCreation: { virtual: number; physical: number };
  monthlyMaintenance: { standard: number; premium: number; black: number };
  topUp: { percentage: number; minFee: number };
  atmWithdrawal: { domestic: number; international: number };
  foreignExchange: number;
  inactivity: number;
}

export interface CardixLimits {
  daily: { standard: number; premium: number; black: number };
  monthly: { standard: number; premium: number; black: number };
  atm: { standard: number; premium: number; black: number };
  topUp: { min: number; max: number };
}

export interface CardixKYCStatus {
  level: 'none' | 'basic' | 'enhanced' | 'full';
  status: 'pending' | 'verified' | 'rejected';
  requiredDocuments: string[];
  submittedDocuments: string[];
  verifiedAt?: string;
}

// ─── Configuration ───────────────────────────────────────────────────────────

export const CARDIX_CONFIG: CardixConfig = {
  baseUrl: CARDIX_BASE_URL,
  partnerCode: CARDIX_PARTNER_CODE,
  apiVersion: 'v1',
};

export const CARDIX_FEES: CardixFees = {
  cardCreation: { virtual: 0, physical: 9.99 },
  monthlyMaintenance: { standard: 1.99, premium: 4.99, black: 0 },
  topUp: { percentage: 1.5, minFee: 0.50 },
  atmWithdrawal: { domestic: 1.50, international: 2.50 },
  foreignExchange: 0.5,
  inactivity: 3.00,
};

export const CARDIX_LIMITS: CardixLimits = {
  daily: { standard: 2500, premium: 10000, black: 50000 },
  monthly: { standard: 10000, premium: 50000, black: 250000 },
  atm: { standard: 500, premium: 2000, black: 10000 },
  topUp: { min: 10, max: 50000 },
};

export const CARDIX_TIER_DETAILS = {
  standard: {
    name: 'Standard',
    color: 'from-slate-500 to-slate-700',
    accentColor: '#94a3b8',
    cashback: 0.5,
    features: [
      'Carte virtuelle gratuite',
      'Paiements en ligne',
      'Top-up crypto instantané',
      'Notifications push',
      'Support par email',
    ],
    networks: ['visa'],
  },
  premium: {
    name: 'Premium',
    color: 'from-[#d4af37] to-amber-700',
    accentColor: '#d4af37',
    cashback: 2.0,
    features: [
      'Carte virtuelle + physique',
      'Cashback 2% crypto',
      'Retraits ATM inclus',
      'Apple Pay & Google Pay',
      '3D Secure renforcé',
      'Support prioritaire 24/7',
      'Sans frais à l\'étranger',
    ],
    networks: ['visa', 'mastercard'],
  },
  black: {
    name: 'Black Edition',
    color: 'from-slate-900 to-black',
    accentColor: '#d4af37',
    cashback: 5.0,
    features: [
      'Carte métal exclusive',
      'Cashback 5% crypto',
      'Limites illimitées',
      'Conciergerie dédiée',
      'Accès salons VIP aéroports',
      'Assurance voyage premium',
      'Zero frais partout',
      'Gestionnaire de compte privé',
      'Invitations événements exclusifs',
    ],
    networks: ['visa', 'mastercard'],
  },
};

export const SUPPORTED_CRYPTOS = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', icon: '₿', color: '#f7931a', network: 'Bitcoin' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', color: '#627eea', network: 'Ethereum' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', icon: '₮', color: '#26a17b', network: 'ERC-20 / TRC-20' },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', icon: '$', color: '#2775ca', network: 'ERC-20' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', icon: '⬡', color: '#8247e5', network: 'Polygon' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', icon: '◎', color: '#9945ff', network: 'Solana' },
];

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_CARDS: CardixCard[] = [
  {
    id: 'cdx-001',
    cardId: 'CDX-VIS-8847291',
    maskedPan: '4539 **** **** 7821',
    last4: '7821',
    expiryMonth: '03',
    expiryYear: '2029',
    type: 'virtual',
    tier: 'premium',
    currency: 'EUR',
    status: 'active',
    fundingSource: 'eth',
    balance: 2847.50,
    dailyLimit: 10000,
    monthlyLimit: 50000,
    dailySpent: 340,
    monthlySpent: 4230,
    holderName: 'THESORIA USER',
    email: 'user@thesoria.io',
    label: 'Carte principale',
    createdAt: '2025-09-15T10:30:00Z',
    activatedAt: '2025-09-15T10:31:00Z',
    network: 'visa',
    is3DSecure: true,
    contactless: true,
    onlinePayments: true,
    atmWithdrawal: true,
    internationalPayments: true,
  },
  {
    id: 'cdx-002',
    cardId: 'CDX-MC-3392847',
    maskedPan: '5412 **** **** 3156',
    last4: '3156',
    expiryMonth: '11',
    expiryYear: '2028',
    type: 'physical',
    tier: 'black',
    currency: 'EUR',
    status: 'active',
    fundingSource: 'btc',
    balance: 15420.00,
    dailyLimit: 50000,
    monthlyLimit: 250000,
    dailySpent: 890,
    monthlySpent: 12450,
    holderName: 'THESORIA USER',
    email: 'user@thesoria.io',
    label: 'Black Edition',
    createdAt: '2025-06-01T08:00:00Z',
    activatedAt: '2025-06-05T14:22:00Z',
    network: 'mastercard',
    is3DSecure: true,
    contactless: true,
    onlinePayments: true,
    atmWithdrawal: true,
    internationalPayments: true,
  },
];

const MOCK_TRANSACTIONS: CardixTransaction[] = [
  { id: 'tx-001', cardId: 'cdx-001', type: 'purchase', merchant: 'Apple Store', amount: 1299.00, currency: 'EUR', status: 'completed', category: 'Technologie', mcc: '5732', country: 'FR', timestamp: '2026-02-28T14:30:00Z' },
  { id: 'tx-002', cardId: 'cdx-002', type: 'purchase', merchant: 'Amazon EU', amount: 89.99, currency: 'EUR', status: 'completed', category: 'Shopping', mcc: '5411', country: 'LU', timestamp: '2026-02-27T10:15:00Z' },
  { id: 'tx-003', cardId: 'cdx-001', type: 'purchase', merchant: 'Uber', amount: 24.50, currency: 'EUR', status: 'completed', category: 'Transport', mcc: '4121', country: 'FR', timestamp: '2026-02-26T19:45:00Z' },
  { id: 'tx-004', cardId: 'cdx-002', type: 'atm', merchant: 'ATM - BNP Paribas', amount: 500.00, currency: 'EUR', status: 'completed', category: 'Retrait', mcc: '6011', country: 'FR', timestamp: '2026-02-25T09:00:00Z' },
  { id: 'tx-005', cardId: 'cdx-001', type: 'topup', merchant: 'Cardix Top-Up (ETH)', amount: 1000.00, currency: 'EUR', status: 'completed', category: 'Recharge', mcc: '0000', country: '-', timestamp: '2026-02-24T16:20:00Z' },
  { id: 'tx-006', cardId: 'cdx-002', type: 'purchase', merchant: 'Netflix', amount: 17.99, currency: 'EUR', status: 'completed', category: 'Abonnement', mcc: '4899', country: 'NL', timestamp: '2026-02-23T00:01:00Z' },
  { id: 'tx-007', cardId: 'cdx-001', type: 'purchase', merchant: 'Restaurant Le Cinq', amount: 385.00, currency: 'EUR', status: 'completed', category: 'Restaurant', mcc: '5812', country: 'FR', timestamp: '2026-02-22T20:30:00Z' },
  { id: 'tx-008', cardId: 'cdx-002', type: 'purchase', merchant: 'Booking.com', amount: 742.00, currency: 'EUR', status: 'pending', category: 'Voyage', mcc: '7011', country: 'NL', timestamp: '2026-02-21T11:00:00Z' },
  { id: 'tx-009', cardId: 'cdx-001', type: 'refund', merchant: 'Zalando', amount: 65.00, currency: 'EUR', status: 'completed', category: 'Remboursement', mcc: '5651', country: 'DE', timestamp: '2026-02-20T14:00:00Z' },
  { id: 'tx-010', cardId: 'cdx-002', type: 'topup', merchant: 'Cardix Top-Up (BTC)', amount: 5000.00, currency: 'EUR', status: 'completed', category: 'Recharge', mcc: '0000', country: '-', timestamp: '2026-02-19T08:30:00Z' },
];

const MOCK_KYC: CardixKYCStatus = {
  level: 'enhanced',
  status: 'verified',
  requiredDocuments: ['passport', 'proof_of_address', 'selfie'],
  submittedDocuments: ['passport', 'proof_of_address', 'selfie'],
  verifiedAt: '2025-09-14T12:00:00Z',
};

// ─── API Service Class ──────────────────────────────────────────────────────

class CardixAPIService {
  private config: CardixConfig;
  private cards: CardixCard[] = [...MOCK_CARDS];
  private transactions: CardixTransaction[] = [...MOCK_TRANSACTIONS];
  private kycStatus: CardixKYCStatus = { ...MOCK_KYC };

  constructor(config: CardixConfig) {
    this.config = config;
  }

  private getApiUrl(endpoint: string): string {
    return `${this.config.baseUrl}/api/${this.config.apiVersion}/${endpoint}?code=${this.config.partnerCode}`;
  }

  // ── Cards ─────────────────────────────────────────────────────────────────

  async getCards(): Promise<CardixCard[]> {
    // In production: fetch(this.getApiUrl('cards'), { headers: { Authorization: `Bearer ${token}` } })
    await this.simulateDelay(800);
    return [...this.cards];
  }

  async getCard(cardId: string): Promise<CardixCard | null> {
    await this.simulateDelay(500);
    return this.cards.find(c => c.id === cardId) || null;
  }

  async createCard(request: CardixCardRequest): Promise<CardixCard> {
    // In production: POST to this.getApiUrl('cards')
    await this.simulateDelay(2500);

    const tier = CARDIX_TIER_DETAILS[request.tier];
    const isVisa = Math.random() > 0.5;
    const pan4 = String(Math.floor(1000 + Math.random() * 9000));

    const newCard: CardixCard = {
      id: `cdx-${Date.now()}`,
      cardId: `CDX-${isVisa ? 'VIS' : 'MC'}-${Math.floor(1000000 + Math.random() * 9000000)}`,
      maskedPan: `${isVisa ? '4539' : '5412'} **** **** ${pan4}`,
      last4: pan4,
      expiryMonth: String(Math.floor(1 + Math.random() * 12)).padStart(2, '0'),
      expiryYear: '2029',
      type: request.type,
      tier: request.tier,
      currency: request.currency,
      status: request.type === 'virtual' ? 'active' : 'pending',
      fundingSource: request.fundingSource,
      balance: 0,
      dailyLimit: request.dailyLimit || CARDIX_LIMITS.daily[request.tier],
      monthlyLimit: request.monthlyLimit || CARDIX_LIMITS.monthly[request.tier],
      dailySpent: 0,
      monthlySpent: 0,
      holderName: `${request.holderFirstName} ${request.holderLastName}`.toUpperCase(),
      email: request.email,
      label: request.label || `Carte ${tier.name}`,
      createdAt: new Date().toISOString(),
      activatedAt: request.type === 'virtual' ? new Date().toISOString() : undefined,
      network: isVisa ? 'visa' : 'mastercard',
      is3DSecure: true,
      contactless: true,
      onlinePayments: true,
      atmWithdrawal: request.tier !== 'standard',
      internationalPayments: true,
    };

    this.cards.push(newCard);
    return newCard;
  }

  async freezeCard(cardId: string): Promise<CardixCard | null> {
    await this.simulateDelay(1000);
    const card = this.cards.find(c => c.id === cardId);
    if (card) {
      card.status = card.status === 'frozen' ? 'active' : 'frozen';
    }
    return card || null;
  }

  async deleteCard(cardId: string): Promise<boolean> {
    await this.simulateDelay(1500);
    const idx = this.cards.findIndex(c => c.id === cardId);
    if (idx !== -1) {
      this.cards.splice(idx, 1);
      return true;
    }
    return false;
  }

  // ── Top-Up ────────────────────────────────────────────────────────────────

  async topUpCard(request: CardixTopUpRequest): Promise<CardixTopUpResponse> {
    // In production: POST to this.getApiUrl('cards/topup')
    await this.simulateDelay(2000);

    const rates: Record<string, number> = {
      btc: 82450, eth: 3240, usdt: 1.0, usdc: 1.0, matic: 0.92, sol: 148,
    };
    const rate = rates[request.fromCrypto] || 1;
    const cryptoAmount = request.amount / rate;
    const fee = Math.max(request.amount * 0.015, 0.50);

    // Update card balance
    const card = this.cards.find(c => c.id === request.cardId);
    if (card) {
      card.balance += request.amount - fee;
    }

    // Add transaction
    const crypto = SUPPORTED_CRYPTOS.find(c => c.id === request.fromCrypto);
    this.transactions.unshift({
      id: `tx-${Date.now()}`,
      cardId: request.cardId,
      type: 'topup',
      merchant: `Cardix Top-Up (${crypto?.symbol || request.fromCrypto.toUpperCase()})`,
      amount: request.amount,
      currency: card?.currency || 'EUR',
      status: 'completed',
      category: 'Recharge',
      mcc: '0000',
      country: '-',
      timestamp: new Date().toISOString(),
    });

    return {
      id: `topup-${Date.now()}`,
      status: 'completed',
      depositAddress: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      amount: request.amount,
      cryptoAmount,
      cryptoCurrency: request.fromCrypto.toUpperCase(),
      exchangeRate: rate,
      fee,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };
  }

  // ── Transactions ──────────────────────────────────────────────────────────

  async getTransactions(cardId?: string): Promise<CardixTransaction[]> {
    await this.simulateDelay(600);
    if (cardId) {
      return this.transactions.filter(t => t.cardId === cardId);
    }
    return [...this.transactions];
  }

  // ── KYC ───────────────────────────────────────────────────────────────────

  async getKYCStatus(): Promise<CardixKYCStatus> {
    await this.simulateDelay(500);
    return { ...this.kycStatus };
  }

  // ── Fees & Limits ─────────────────────────────────────────────────────────

  getFees(): CardixFees {
    return CARDIX_FEES;
  }

  getLimits(): CardixLimits {
    return CARDIX_LIMITS;
  }

  // ── Partner Link ──────────────────────────────────────────────────────────

  getPartnerUrl(): string {
    return `${CARDIX_BASE_URL}?code=${CARDIX_PARTNER_CODE}`;
  }

  getPartnerCode(): string {
    return this.config.partnerCode;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ─── Export Singleton ────────────────────────────────────────────────────────

export const cardixAPI = new CardixAPIService(CARDIX_CONFIG);
export default cardixAPI;
