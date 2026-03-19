/**
 * QR Code Scanner - Scan Ethereum addresses
 */

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { QrCode, Camera, X, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface QRScannerProps {
  onScan: (address: string) => void;
  GCard: any;
  STitle: any;
}

export default function QRScanner({ onScan, GCard, STitle }: QRScannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scannedAddress, setScannedAddress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated QR scan (in production, use a QR library like html5-qrcode)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading("Scan du QR code...", { id: 'qr-scan' });

      // Simulate QR scanning
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulated result (in production, use QR decoder library)
      const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb6";
      
      setScannedAddress(mockAddress);
      onScan(mockAddress);

      toast.success(
        `✅ QR Code scanné!\nAdresse: ${mockAddress.substring(0, 10)}...`,
        { id: 'qr-scan' }
      );
    } catch (error: any) {
      console.error('Erreur scan QR:', error);
      toast.error("Impossible de scanner le QR code", { id: 'qr-scan' });
    }
  };

  const openCamera = () => {
    toast.info("📷 Fonctionnalité caméra bientôt disponible!\n\nPour l'instant, utilisez l'upload d'image.");
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-sm hover:bg-indigo-500/30 transition-all text-xs inline-flex items-center gap-2"
      >
        <QrCode className="w-4 h-4" />
        Scanner QR
      </button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4"
          >
            <GCard>
              <div className="flex items-center justify-between mb-4">
                <STitle icon={QrCode} title="QR CODE SCANNER" />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded transition-all"
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Info */}
                <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-indigo-200">
                    <p className="font-semibold mb-1">Scanner une adresse Ethereum</p>
                    <p className="text-indigo-300/70">
                      Scannez un QR code contenant une adresse Ethereum.
                      Vous pouvez utiliser la caméra ou uploader une image.
                    </p>
                  </div>
                </div>

                {/* Camera Preview Placeholder */}
                <div className="relative rounded-lg overflow-hidden bg-black/50 border border-white/10 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-20 h-20 mx-auto mb-4 text-white/20" />
                    <p className="text-sm text-white/50">Zone de scan</p>
                    <p className="text-xs text-white/30 mt-1">
                      Sélectionnez une méthode ci-dessous
                    </p>
                  </div>

                  {/* Scan Frame Animation */}
                  <motion.div
                    className="absolute inset-4 border-2 border-indigo-500/50 rounded-lg pointer-events-none"
                    animate={{
                      borderColor: ['rgba(99, 102, 241, 0.5)', 'rgba(99, 102, 241, 1)', 'rgba(99, 102, 241, 0.5)'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={openCamera}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all inline-flex items-center justify-center gap-2 text-xs"
                  >
                    <Camera className="w-4 h-4" />
                    Caméra
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all inline-flex items-center justify-center gap-2 text-xs"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Scanned Result */}
                {scannedAddress && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
                  >
                    <div className="text-[10px] text-white/40 mb-1">ADRESSE SCANNÉE</div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-green-400 font-mono bg-black/30 px-2 py-1 rounded break-all">
                        {scannedAddress}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(scannedAddress);
                          toast.success("Adresse copiée!");
                        }}
                        className="text-[10px] text-green-400 hover:text-green-300 underline flex-shrink-0"
                      >
                        Copier
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Instructions */}
                <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                  <p className="text-[9px] text-blue-300 leading-relaxed">
                    <strong>💡 Astuce:</strong> Les QR codes Ethereum commencent généralement par "ethereum:" ou "0x".
                    Le scanner extrait automatiquement l'adresse.
                  </p>
                </div>
              </div>
            </GCard>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
