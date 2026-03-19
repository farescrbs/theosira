/**
 * Signature de messages pour prouver la possession d'une adresse
 */

import { useState } from "react";
import { motion } from "motion/react";
import { FileSignature, Copy, CheckCircle, Shield } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface MessageSignatureProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

export default function MessageSignature({ web3, fmtAddr, GCard, STitle }: MessageSignatureProps) {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [signing, setSigning] = useState(false);

  const handleSignMessage = async () => {
    if (!message.trim()) {
      toast.error("Veuillez entrer un message à signer");
      return;
    }

    setSigning(true);
    try {
      const sig = await web3.signer.signMessage(message);
      setSignature(sig);
      
      toast.success("Message signé avec succès!");
      console.log('✍️ Message signé:', { message, signature: sig, signer: web3.address });
    } catch (error: any) {
      console.error('❌ Erreur signature:', error);
      if (error.code === 'ACTION_REJECTED') {
        toast.error("Signature rejetée par l'utilisateur");
      } else {
        toast.error(error.message || "Erreur lors de la signature");
      }
    } finally {
      setSigning(false);
    }
  };

  const copySignature = () => {
    navigator.clipboard.writeText(signature);
    toast.success("Signature copiée!");
  };

  const copyVerificationData = () => {
    const data = JSON.stringify({
      message,
      signature,
      signer: web3.address,
      network: web3.networkName,
      chainId: web3.chainId,
      timestamp: new Date().toISOString(),
    }, null, 2);
    
    navigator.clipboard.writeText(data);
    toast.success("Données de vérification copiées!");
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={FileSignature} title="MESSAGE SIGNATURE" />
      
      <div className="space-y-4">
        {/* Info */}
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-start gap-2">
          <Shield className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-purple-200">
            <p className="font-semibold mb-1">Proof of Ownership</p>
            <p className="text-purple-300/70">
              Signez un message pour prouver que vous possédez cette adresse sans révéler votre clé privée.
              Utilisé pour l'authentification et la vérification d'identité.
            </p>
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            MESSAGE À SIGNER
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Entrez votre message... (ex: Je certifie être le propriétaire de cette adresse le 2025-01-15)"
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-sm text-white text-sm focus:outline-none focus:border-[#d4af37]/50 resize-none"
            rows={4}
          />
          <div className="flex items-center justify-between mt-1">
            <p className="text-[9px] text-white/30">
              {message.length} caractères
            </p>
            <button
              onClick={() => setMessage(`Je certifie être le propriétaire de l'adresse ${web3.address} le ${new Date().toISOString()}`)}
              className="text-[9px] text-[#d4af37] hover:text-yellow-300 transition-colors"
            >
              Message template
            </button>
          </div>
        </div>

        {/* Sign Button */}
        <button
          onClick={handleSignMessage}
          disabled={signing || !message.trim()}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {signing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <FileSignature className="w-5 h-5" />
              </motion.div>
              Signature en cours...
            </>
          ) : (
            <>
              <FileSignature className="w-5 h-5" />
              Signer le Message
            </>
          )}
        </button>

        {/* Signature Result */}
        {signature && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-3"
          >
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">SIGNATURE GÉNÉRÉE</span>
            </div>

            {/* Signer */}
            <div>
              <div className="text-[9px] text-white/40 mb-1 tracking-wider">
                SIGNÉ PAR
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs text-white font-mono bg-black/30 px-2 py-1 rounded">
                  {fmtAddr(web3.address)}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(web3.address);
                    toast.success("Adresse copiée!");
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <Copy className="w-3 h-3 text-white/50" />
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <div className="text-[9px] text-white/40 mb-1 tracking-wider">
                MESSAGE
              </div>
              <div className="text-xs text-white/70 bg-black/30 px-3 py-2 rounded max-h-20 overflow-y-auto">
                {message}
              </div>
            </div>

            {/* Signature */}
            <div>
              <div className="text-[9px] text-white/40 mb-1 tracking-wider">
                SIGNATURE (ECDSA)
              </div>
              <div className="flex items-start gap-2">
                <code className="flex-1 text-[10px] text-green-400 font-mono bg-black/30 px-3 py-2 rounded break-all">
                  {signature}
                </code>
                <button
                  onClick={copySignature}
                  className="p-2 hover:bg-white/10 rounded flex-shrink-0"
                >
                  <Copy className="w-3 h-3 text-white/50" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-green-500/20">
              <button
                onClick={copyVerificationData}
                className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-sm hover:bg-green-500/30 transition-all text-xs inline-flex items-center justify-center gap-2"
              >
                <Copy className="w-3 h-3" />
                Copier données complètes (JSON)
              </button>
            </div>

            {/* Verification Info */}
            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
              <p className="text-[9px] text-blue-300/70 leading-relaxed">
                <strong className="text-blue-400">Vérification:</strong> Utilisez{" "}
                <a 
                  href="https://etherscan.io/verifiedSignatures" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  Etherscan Signature Verifier
                </a>{" "}
                ou <code className="bg-black/30 px-1 rounded">ethers.verifyMessage()</code> pour valider cette signature.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </GCard>
  );
}
