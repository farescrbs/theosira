import { useState } from "react";
import { Smartphone, Monitor, Tablet, Wifi, Link2, LogOut, RefreshCw, Shield, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import {
  getAvailableProviders,
  connectWallet,
  disconnectAccount,
  getConnectedAccounts,
  getConnectedDevices,
  setPrimaryAccount,
  removeDevice,
  trustDevice,
  syncAcrossDevices,
  getAuthStats,
  type WalletProvider,
  type ConnectedAccount,
  type DeviceInfo,
} from "../services/universalAuth";

const deviceIcons = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
};

export function UniversalConnection() {
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [showDevicesDialog, setShowDevicesDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<WalletProvider | null>(null);

  const providers = getAvailableProviders();
  const accounts = getConnectedAccounts();
  const devices = getConnectedDevices();
  const stats = getAuthStats();

  const handleConnect = async (provider: WalletProvider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);

    try {
      await connectWallet(provider.id);
      setTimeout(() => {
        setIsConnecting(false);
        setShowConnectDialog(false);
      }, 2000);
    } catch (error) {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    await disconnectAccount(accountId);
  };

  const handleRemoveDevice = async (deviceId: string) => {
    await removeDevice(deviceId);
  };

  const handleTrustDevice = async (deviceId: string) => {
    await trustDevice(deviceId);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await syncAcrossDevices();
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <>
      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <Link2 className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.totalAccounts}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Comptes Connectés
          </p>
        </div>

        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <Wifi className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.connectedDevices}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Appareils Actifs
          </p>
        </div>

        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <Shield className="w-6 h-6 text-[#d4af37] mx-auto mb-2" />
          <p className="text-2xl text-[#d4af37] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.securityScore}%
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Score Sécurité
          </p>
        </div>

        <div className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl text-green-400 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {stats.trustedDevices}
          </p>
          <p className="text-white/60 text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Appareils Fiables
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button
          onClick={() => setShowConnectDialog(true)}
          className="bg-gradient-to-r from-[#d4af37] to-[#f0e68c] text-black hover:opacity-90"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
        >
          <Link2 className="mr-2 w-4 h-4" />
          Connecter un Compte
        </Button>

        <Button
          onClick={() => setShowDevicesDialog(true)}
          variant="outline"
          className="border-[#d4af37]/30 text-white hover:bg-white/[0.05]"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
        >
          <Monitor className="mr-2 w-4 h-4" />
          Gérer les Appareils
        </Button>

        <Button
          onClick={handleSync}
          disabled={isSyncing}
          variant="outline"
          className="border-[#d4af37]/30 text-white hover:bg-white/[0.05]"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
        >
          <RefreshCw className={`mr-2 w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          Synchroniser
        </Button>
      </div>

      {/* Connected Accounts */}
      <div className="mb-8">
        <h3 className="text-white text-lg mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
          Comptes Connectés
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => {
            const provider = providers.find(p => p.id === account.provider);
            return (
              <div
                key={account.id}
                className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] backdrop-blur-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider?.icon}</span>
                    <div>
                      <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {provider?.name}
                      </p>
                      <p className="text-white/60 text-sm font-mono">
                        {account.address?.slice(0, 6)}...{account.address?.slice(-4) || account.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {account.isPrimary && (
                      <Badge className="bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30">
                        Principal
                      </Badge>
                    )}
                    {account.verified && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!account.isPrimary && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPrimaryAccount(account.id)}
                      className="flex-1 text-xs border-[#d4af37]/20"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Définir Principal
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDisconnect(account.id)}
                    className="flex-1 text-xs border-red-500/30 text-red-400"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <LogOut className="w-3 h-3 mr-1" />
                    Déconnecter
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Connexion Universelle
            </DialogTitle>
            <DialogDescription className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Connectez votre compte avec l'un des fournisseurs disponibles
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleConnect(provider)}
                  disabled={isConnecting}
                  className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-6 hover:border-[#d4af37]/40 transition-all text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-4xl">{provider.icon}</span>
                    <div>
                      <p className="text-white text-lg" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                        {provider.name}
                      </p>
                      <Badge className={`text-xs ${
                        provider.type === 'web3' ? 'bg-purple-400/20 text-purple-400 border-purple-400/30' :
                        provider.type === 'email' ? 'bg-blue-400/20 text-blue-400 border-blue-400/30' :
                        provider.type === 'social' ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                        'bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30'
                      }`}>
                        {provider.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {provider.description}
                  </p>
                </button>
              ))}
            </div>

            {isConnecting && (
              <div className="rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 p-6 text-center">
                <div className="w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
                <p className="text-white text-lg mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                  Connexion à {selectedProvider?.name}...
                </p>
                <p className="text-white/60 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Veuillez confirmer dans votre wallet
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Devices Dialog */}
      <Dialog open={showDevicesDialog} onOpenChange={setShowDevicesDialog}>
        <DialogContent className="bg-black/95 border-[#d4af37]/30 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-[#d4af37]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Appareils Connectés
            </DialogTitle>
            <DialogDescription className="text-white/60" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Gérez les appareils ayant accès à votre compte
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {devices.map((device) => {
              const DeviceIcon = deviceIcons[device.type];
              return (
                <div
                  key={device.id}
                  className="rounded-xl border border-[#d4af37]/20 bg-white/[0.02] p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <DeviceIcon className="w-6 h-6 text-[#d4af37]" />
                      <div>
                        <p className="text-white" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}>
                          {device.name}
                        </p>
                        <p className="text-white/60 text-sm">
                          {device.os} • {device.browser}
                        </p>
                        <p className="text-white/40 text-xs">
                          Actif il y a {Math.floor((Date.now() - device.lastActive) / 3600000)}h
                        </p>
                      </div>
                    </div>
                    {device.trusted ? (
                      <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Fiable
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Non Fiable
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!device.trusted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTrustDevice(device.id)}
                        className="flex-1 text-xs border-green-400/30 text-green-400"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        Approuver
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveDevice(device.id)}
                      className="flex-1 text-xs border-red-500/30 text-red-400"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Retirer
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
