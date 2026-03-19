import { useState } from "react";
import { Lock, Send, Shield, Check, Circle, Search, Plus, MoreVertical, Paperclip, Image, FileText, Key, AlertCircle, CheckCircle2, Clock, Trash2, Archive, Star, Download, Bell, Settings, Video, Phone, Info, ChevronDown, X, File, ExternalLink, Copy, Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  verified: boolean;
  avatar: string;
  status: string;
  publicKey: string;
  lastSeen?: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  encrypted: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'image' | 'transaction';
  metadata?: {
    fileName?: string;
    fileSize?: string;
    amount?: string;
    txHash?: string;
  };
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  date: string;
}

export function SecureMessagingSection() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const [showPublicKey, setShowPublicKey] = useState(false);

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Alexandre Dubois',
      walletAddress: '0x742d35f8c16a89b2d4e5f1a3',
      lastMessage: 'Transaction confirmée pour le montant convenu',
      timestamp: '14:32',
      unread: 2,
      online: true,
      verified: true,
      avatar: 'AD',
      status: 'Conseiller Patrimonial',
      publicKey: 'pk_live_51H7Kx2eZv...K3d8F9a2b',
      lastSeen: 'En ligne'
    },
    {
      id: '2',
      name: 'Sophie Laurent',
      walletAddress: '0x9a31c2b7e4f8d6a1b3c5f7e9',
      lastMessage: 'Merci pour le transfert rapide',
      timestamp: '13:15',
      unread: 0,
      online: true,
      verified: true,
      avatar: 'SL',
      status: 'Gestionnaire de Compte',
      publicKey: 'pk_live_72M8Ly3fAw...L4e9G0b3c',
      lastSeen: 'En ligne'
    },
    {
      id: '3',
      name: 'Marc Fontaine',
      walletAddress: '0x3f8267c9d1e5a4b2f6c8d0e2',
      lastMessage: 'Documents envoyés de manière sécurisée',
      timestamp: 'Hier',
      unread: 0,
      online: false,
      verified: true,
      avatar: 'MF',
      status: 'Analyste Financier',
      publicKey: 'pk_live_83N9Mz4gBx...M5f0H1c4d',
      lastSeen: 'Vu il y a 2h'
    },
    {
      id: '4',
      name: 'Claire Moreau',
      walletAddress: '0x8c5498f0a3d7b6e1c9f2d4e6',
      lastMessage: 'Rendez-vous confirmé pour demain',
      timestamp: 'Hier',
      unread: 1,
      online: false,
      verified: true,
      avatar: 'CM',
      status: 'Directrice de Clientèle',
      publicKey: 'pk_live_94O0Na5hCy...N6g1I2d5e',
      lastSeen: 'Vu il y a 5h'
    },
    {
      id: '5',
      name: 'Thomas Bernard',
      walletAddress: '0x1d6329e1b4c8a7f0d2e5f8a0',
      lastMessage: 'Parfait, je valide la proposition',
      timestamp: '2 Nov',
      unread: 0,
      online: false,
      verified: true,
      avatar: 'TB',
      status: 'Expert Blockchain',
      publicKey: 'pk_live_05P1Ob6iDz...O7h2J3e6f',
      lastSeen: 'Vu hier'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      content: 'Bonjour, je souhaite effectuer un transfert sécurisé de fonds',
      timestamp: '14:28',
      encrypted: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '2',
      senderId: 'me',
      content: 'Parfait, quel montant souhaitez-vous transférer et sur quelle blockchain ?',
      timestamp: '14:29',
      encrypted: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '3',
      senderId: '1',
      content: '50 000 EUR via le réseau Ethereum',
      timestamp: '14:30',
      encrypted: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '4',
      senderId: 'me',
      content: 'Transaction initiée. Merci de confirmer via votre wallet.',
      timestamp: '14:31',
      encrypted: true,
      status: 'read',
      type: 'text'
    },
    {
      id: '5',
      senderId: '1',
      content: 'Transfert effectué',
      timestamp: '14:32',
      encrypted: true,
      status: 'delivered',
      type: 'transaction',
      metadata: {
        amount: '50,000.00 EUR',
        txHash: '0x7f9f...3a2b'
      }
    },
    {
      id: '6',
      senderId: '1',
      content: 'Contrat de gestion patrimoine 2025.pdf',
      timestamp: '14:33',
      encrypted: true,
      status: 'delivered',
      type: 'file',
      metadata: {
        fileName: 'Contrat_Gestion_Patrimoine_2025.pdf',
        fileSize: '2.4 MB'
      }
    }
  ]);

  const [attachments] = useState<Attachment[]>([
    { id: '1', name: 'Contrat_Gestion_Patrimoine_2025.pdf', size: '2.4 MB', type: 'PDF', date: '07 Nov 2025' },
    { id: '2', name: 'Releve_Compte_Octobre.xlsx', size: '1.1 MB', type: 'Excel', date: '01 Nov 2025' },
    { id: '3', name: 'Justificatif_Identite.jpg', size: '890 KB', type: 'Image', date: '28 Oct 2025' }
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setMessageInput("");
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
      }} />
      
      <div className="container mx-auto px-8 relative z-10 max-w-[1600px]">
        {/* Premium Header */}
        <div className="mb-24">
          {/* Reference Number */}
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/[0.03]">
            <div className="flex items-center gap-6">
              <div className="w-1 h-12 bg-[#d4af37]" />
              <div>
                <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Communications Sécurisées
                </p>
                <p className="text-xs text-gray-600" style={{ fontFamily: 'Courier New, monospace' }}>
                  THESORIA-MSG-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 9999)).padStart(4, '0')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 border border-[#d4af37]/20 bg-[#d4af37]/5">
                <div className="w-2 h-2 bg-[#d4af37] animate-pulse" />
                <p className="text-[10px] text-[#d4af37] uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Cryptage Actif
                </p>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[0.5px] w-16 bg-gradient-to-r from-transparent to-[#d4af37]" />
              <p className="text-[#d4af37] text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                Communications Confidentielles
              </p>
              <div className="h-[0.5px] w-16 bg-gradient-to-l from-transparent to-[#d4af37]" />
            </div>
            
            <h2 className="text-5xl mb-8 text-white tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
              Messagerie Cryptée
            </h2>
            
            <p className="text-[13px] text-gray-600 leading-relaxed tracking-wide max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
              Communications sécurisées par cryptage end-to-end de niveau bancaire.<br/>
              Confidentialité absolue · Traçabilité blockchain · Conformité réglementaire
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-16 grid grid-cols-4 gap-[1px] bg-white/[0.05]">
          {[
            { label: 'Messages Sécurisés', value: '1,247', sublabel: 'Ce mois' },
            { label: 'Contacts Vérifiés', value: contacts.filter(c => c.verified).length.toString(), sublabel: 'KYC Validé' },
            { label: 'Fichiers Cryptés', value: '89', sublabel: 'Stockés' },
            { label: 'Taux de Sécurité', value: '100%', sublabel: 'E2E Actif' }
          ].map((stat, index) => (
            <div key={index} className="bg-black p-8 text-center hover:bg-white/[0.01] transition-all duration-500">
              <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em] mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {stat.label}
              </p>
              <p className="text-3xl text-white mb-2 tabular-nums" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                {stat.value}
              </p>
              <p className="text-[9px] text-gray-600 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                {stat.sublabel}
              </p>
            </div>
          ))}
        </div>

        {/* Messaging Interface */}
        <div className="border border-white/[0.05] bg-black/30 h-[850px] flex">
          {/* Contacts Sidebar */}
          <div className="w-[420px] border-r border-white/[0.05] flex flex-col bg-black/50">
            {/* Sidebar Header */}
            <div className="p-8 border-b border-white/[0.05]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl text-white tracking-tight mb-1" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                    Contacts
                  </h3>
                  <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {contacts.length} Vérifiés KYC
                  </p>
                </div>
                <button className="w-10 h-10 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="pl-12 bg-black/50 border-white/[0.08] text-white placeholder:text-gray-800 focus:border-[#d4af37] h-12 text-[12px]"
                  style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}
                />
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setShowContactInfo(false);
                  }}
                  className={`p-6 border-b border-white/[0.03] cursor-pointer transition-all duration-300 ${
                    selectedContact?.id === contact.id
                      ? 'bg-white/[0.03] border-l-[2px] border-l-[#d4af37]'
                      : 'hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 border border-white/[0.08] flex items-center justify-center bg-black/50">
                        <span className="text-[12px] text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {contact.avatar}
                        </span>
                      </div>
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#d4af37] border-[3px] border-black" />
                      )}
                      {contact.verified && (
                        <div className="absolute -top-1.5 -right-1.5">
                          <CheckCircle2 className="w-5 h-5 text-[#d4af37]" fill="black" />
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-[13px] text-white truncate mb-1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            {contact.name}
                          </p>
                          <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            {contact.status}
                          </p>
                        </div>
                        <span className="text-[9px] text-gray-700 tracking-wide flex-shrink-0" style={{ fontFamily: 'Courier New, monospace' }}>
                          {contact.timestamp}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-700 mb-3 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                        {contact.walletAddress.slice(0, 18)}...
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-gray-600 truncate pr-2" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {contact.lastMessage}
                        </p>
                        {contact.unread > 0 && (
                          <div className="w-6 h-6 bg-[#d4af37] flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] text-black" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 500 }}>
                              {contact.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-6 border-t border-white/[0.05] bg-black/50">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                  Toutes les conversations sont cryptées
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-8 border-b border-white/[0.05] flex items-center justify-between bg-black/50">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-12 h-12 border border-white/[0.08] flex items-center justify-center bg-black/50">
                        <span className="text-[11px] text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {selectedContact.avatar}
                        </span>
                      </div>
                      {selectedContact.online && (
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#d4af37] border-[3px] border-black" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[14px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {selectedContact.name}
                        </p>
                        {selectedContact.verified && (
                          <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                          {selectedContact.walletAddress}
                        </p>
                        <div className="h-3 w-[1px] bg-white/[0.1]" />
                        <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                          {selectedContact.lastSeen}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Security Badge */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border border-[#d4af37]/20 bg-[#d4af37]/5">
                      <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="text-[9px] text-[#d4af37] uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        E2E Crypté
                      </span>
                    </div>
                    
                    {/* Action Buttons */}
                    <button className="w-10 h-10 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="w-10 h-10 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                      <Video className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => setShowContactInfo(!showContactInfo)}
                      className={`w-10 h-10 border flex items-center justify-center transition-all ${
                        showContactInfo ? 'border-[#d4af37] bg-[#d4af37]/5' : 'border-white/[0.08] hover:border-[#d4af37]/30'
                      }`}
                    >
                      <Info className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Messages Area with Tabs */}
                <div className="flex-1 flex">
                  <div className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                      {messages.map((message) => {
                        const isMe = message.senderId === 'me';
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                              {message.type === 'text' && (
                                <div
                                  className={`px-6 py-4 ${
                                    isMe
                                      ? 'bg-[#d4af37]/10 border border-[#d4af37]/20'
                                      : 'bg-white/[0.02] border border-white/[0.05]'
                                  }`}
                                >
                                  <p className="text-[13px] text-white leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                                    {message.content}
                                  </p>
                                </div>
                              )}

                              {message.type === 'file' && (
                                <div className={`p-5 border ${isMe ? 'border-[#d4af37]/20 bg-[#d4af37]/5' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 border border-white/[0.08] flex items-center justify-center">
                                      <FileText className="w-5 h-5 text-[#d4af37]" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[11px] text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                                        {message.metadata?.fileName}
                                      </p>
                                      <p className="text-[9px] text-gray-700" style={{ fontFamily: 'Courier New, monospace' }}>
                                        {message.metadata?.fileSize}
                                      </p>
                                    </div>
                                    <button className="w-9 h-9 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all">
                                      <Download className="w-4 h-4 text-gray-600" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {message.type === 'transaction' && (
                                <div className={`p-5 border ${isMe ? 'border-[#d4af37]/20 bg-[#d4af37]/5' : 'border-white/[0.05] bg-white/[0.02]'}`}>
                                  <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 border border-[#d4af37]/30 flex items-center justify-center bg-[#d4af37]/5">
                                      <CheckCircle2 className="w-6 h-6 text-[#d4af37]" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-[10px] text-gray-700 uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        Transaction Confirmée
                                      </p>
                                      <p className="text-lg text-white tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                                        {message.metadata?.amount}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                                    <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                                      Hash: {message.metadata?.txHash}
                                    </p>
                                    <button className="text-[#d4af37] hover:text-[#d4af37]/80 transition-colors">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center gap-2 px-2">
                                <Lock className="w-2.5 h-2.5 text-gray-700" />
                                <span className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Courier New, monospace' }}>
                                  {message.timestamp}
                                </span>
                                {isMe && (
                                  <>
                                    {message.status === 'read' && (
                                      <div className="flex items-center gap-1">
                                        <Check className="w-3 h-3 text-[#d4af37]" />
                                        <Check className="w-3 h-3 text-[#d4af37] -ml-2" />
                                      </div>
                                    )}
                                    {message.status === 'delivered' && <Check className="w-3 h-3 text-gray-600" />}
                                    {message.status === 'sent' && <Check className="w-3 h-3 text-gray-700" />}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Input Area */}
                    <div className="p-8 border-t border-white/[0.05] bg-black/50">
                      <div className="flex items-end gap-4">
                        <button className="w-11 h-11 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all flex-shrink-0">
                          <Paperclip className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="w-11 h-11 border border-white/[0.08] flex items-center justify-center hover:border-[#d4af37]/30 transition-all flex-shrink-0">
                          <Image className="w-4 h-4 text-gray-600" />
                        </button>
                        <div className="flex-1 relative">
                          <textarea
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                            placeholder="Message crypté de bout en bout..."
                            rows={3}
                            className="w-full bg-black/50 border border-white/[0.08] text-white placeholder:text-gray-800 focus:border-[#d4af37] px-4 py-3 pr-12 text-[13px] resize-none focus:outline-none"
                            style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}
                          />
                          <Lock className="absolute right-4 top-4 w-3.5 h-3.5 text-gray-700" />
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="w-14 h-14 bg-[#d4af37] hover:bg-[#d4af37]/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
                        >
                          <Send className="w-5 h-5 text-black" />
                        </button>
                      </div>
                      
                      {/* Security Info */}
                      <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/[0.03]">
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-[#d4af37]" />
                          <p className="text-[9px] text-gray-700 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            Messages protégés par cryptage AES-256 · Clés stockées sur blockchain
                          </p>
                        </div>
                        <p className="text-[9px] text-gray-700 tracking-wide tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                          {messageInput.length} / 5000
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Panel */}
                  {showContactInfo && (
                    <div className="w-[380px] border-l border-white/[0.05] bg-black/50 overflow-y-auto">
                      <div className="p-8">
                        {/* Contact Header */}
                        <div className="text-center mb-8 pb-8 border-b border-white/[0.05]">
                          <div className="w-20 h-20 border border-white/[0.08] flex items-center justify-center mx-auto mb-4 bg-black/50">
                            <span className="text-lg text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {selectedContact.avatar}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <p className="text-[15px] text-white" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                              {selectedContact.name}
                            </p>
                            {selectedContact.verified && (
                              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                            )}
                          </div>
                          <p className="text-[10px] text-gray-700 tracking-wide mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                            {selectedContact.status}
                          </p>
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-2 h-2 ${selectedContact.online ? 'bg-[#d4af37]' : 'bg-gray-700'}`} />
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {selectedContact.online ? 'En ligne' : selectedContact.lastSeen}
                            </p>
                          </div>
                        </div>

                        {/* Wallet Address */}
                        <div className="mb-8">
                          <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            Adresse Wallet
                          </p>
                          <div className="flex items-center gap-2 p-4 border border-white/[0.05] bg-black/50">
                            <p className="flex-1 text-[10px] text-white tracking-wide truncate" style={{ fontFamily: 'Courier New, monospace' }}>
                              {selectedContact.walletAddress}
                            </p>
                            <button 
                              onClick={() => handleCopyAddress(selectedContact.walletAddress)}
                              className="text-gray-600 hover:text-[#d4af37] transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Public Key */}
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Clé Publique
                            </p>
                            <button 
                              onClick={() => setShowPublicKey(!showPublicKey)}
                              className="text-gray-600 hover:text-[#d4af37] transition-colors"
                            >
                              {showPublicKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          <div className="p-4 border border-white/[0.05] bg-black/50">
                            <p className="text-[10px] text-white tracking-wide break-all" style={{ fontFamily: 'Courier New, monospace' }}>
                              {showPublicKey ? selectedContact.publicKey : '••••••••••••••••••••'}
                            </p>
                          </div>
                        </div>

                        {/* Shared Files */}
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-[9px] text-gray-700 uppercase tracking-[0.3em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              Fichiers Partagés
                            </p>
                            <p className="text-[9px] text-gray-600 tabular-nums" style={{ fontFamily: 'Courier New, monospace' }}>
                              {attachments.length}
                            </p>
                          </div>
                          <div className="space-y-[1px] bg-white/[0.05]">
                            {attachments.map((file) => (
                              <div key={file.id} className="p-4 bg-black hover:bg-white/[0.01] transition-all flex items-center gap-3">
                                <div className="w-9 h-9 border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                  <FileText className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] text-white truncate mb-1" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                                    {file.name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[9px] text-gray-700" style={{ fontFamily: 'Courier New, monospace' }}>
                                      {file.size}
                                    </p>
                                    <div className="w-1 h-1 bg-gray-700" />
                                    <p className="text-[9px] text-gray-700" style={{ fontFamily: 'Courier New, monospace' }}>
                                      {file.date}
                                    </p>
                                  </div>
                                </div>
                                <button className="text-gray-600 hover:text-[#d4af37] transition-colors flex-shrink-0">
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Security Status */}
                        <div className="p-6 border border-[#d4af37]/20 bg-[#d4af37]/5">
                          <div className="flex items-start gap-3 mb-4">
                            <Shield className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] text-white uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                Sécurité Maximale
                              </p>
                              <p className="text-[9px] text-gray-700 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                                Contact vérifié KYC · E2E crypté · Clés blockchain
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* No Contact Selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 border border-white/[0.08] flex items-center justify-center mx-auto mb-8 bg-black/50">
                    <Lock className="w-10 h-10 text-gray-700" />
                  </div>
                  <p className="text-2xl text-white mb-4 tracking-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 300 }}>
                    Messagerie Sécurisée
                  </p>
                  <p className="text-[12px] text-gray-600 leading-relaxed tracking-wide mb-8" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                    Sélectionnez un contact vérifié pour démarrer une conversation<br/>
                    cryptée de bout en bout avec authentification blockchain
                  </p>
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border border-white/[0.05] bg-black/50">
                    <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
                    <p className="text-[9px] text-gray-700 uppercase tracking-[0.25em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      AES-256 · E2E · Blockchain
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="mt-16 grid grid-cols-4 gap-[1px] bg-white/[0.05] border border-white/[0.05]">
          {[
            {
              icon: Shield,
              title: 'Cryptage E2E',
              description: 'AES-256 Military Grade',
              detail: 'Bout en bout'
            },
            {
              icon: Key,
              title: 'Clés Blockchain',
              description: 'Stockage Décentralisé',
              detail: 'Multi-signature'
            },
            {
              icon: CheckCircle2,
              title: 'Vérification KYC',
              description: 'Identité Certifiée',
              detail: 'Conformité RGPD'
            },
            {
              icon: Archive,
              title: 'Archivage Sûr',
              description: 'Conservation 10 ans',
              detail: 'Audit trail complet'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-black p-10 text-center hover:bg-white/[0.01] transition-all duration-500 group">
              <feature.icon className="w-7 h-7 text-[#d4af37] mx-auto mb-5" />
              <p className="text-[10px] text-white uppercase tracking-[0.25em] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {feature.title}
              </p>
              <p className="text-[9px] text-gray-700 mb-3" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                {feature.description}
              </p>
              <div className="h-[1px] w-8 bg-[#d4af37] mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-3" />
              <p className="text-[9px] text-gray-800 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
                {feature.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SecureMessagingSection;