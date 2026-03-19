/**
 * Panel de transfert NFT - ERC-721 & ERC-1155
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Image, Send, Loader2, Eye, AlertCircle, Layers } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Contract } from "ethers";

interface NFTTransferPanelProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

type NFTType = 'ERC721' | 'ERC1155';

const ERC721_ABI = [
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

const ERC1155_ABI = [
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)",
];

export default function NFTTransferPanel({ web3, fmtAddr, GCard, STitle }: NFTTransferPanelProps) {
  const [nftType, setNftType] = useState<NFTType>('ERC721');
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("1");
  const [recipient, setRecipient] = useState("");
  const [nftInfo, setNftInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const inspectNFT = async () => {
    if (!contractAddress || !tokenId) {
      toast.error("Veuillez entrer l'adresse du contrat et le Token ID");
      return;
    }

    setLoading(true);
    try {
      if (nftType === 'ERC721') {
        const contract = new Contract(contractAddress, ERC721_ABI, web3.provider);
        const [owner, name, symbol, tokenURI] = await Promise.all([
          contract.ownerOf(tokenId),
          contract.name().catch(() => 'Unknown'),
          contract.symbol().catch(() => 'NFT'),
          contract.tokenURI(tokenId).catch(() => ''),
        ]);

        setNftInfo({
          type: 'ERC721',
          name,
          symbol,
          tokenId,
          owner,
          tokenURI,
          isOwner: owner.toLowerCase() === web3.address.toLowerCase(),
        });

        if (owner.toLowerCase() !== web3.address.toLowerCase()) {
          toast.warning("⚠️ Vous n'êtes pas le propriétaire de ce NFT");
        } else {
          toast.success(`NFT trouvé: ${name} #${tokenId}`);
        }
      } else {
        const contract = new Contract(contractAddress, ERC1155_ABI, web3.provider);
        const [balance, uri] = await Promise.all([
          contract.balanceOf(web3.address, tokenId),
          contract.uri(tokenId).catch(() => ''),
        ]);

        setNftInfo({
          type: 'ERC1155',
          tokenId,
          balance: balance.toString(),
          uri,
          isOwner: Number(balance) > 0,
        });

        if (Number(balance) === 0) {
          toast.warning("⚠️ Vous ne possédez pas ce NFT");
        } else {
          toast.success(`NFT trouvé: Balance = ${balance}`);
        }
      }
    } catch (error: any) {
      console.error('❌ Erreur inspection NFT:', error);
      toast.error("Impossible de charger le NFT");
      setNftInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!contractAddress || !tokenId || !recipient) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (!nftInfo || !nftInfo.isOwner) {
      toast.error("Vous devez posséder ce NFT pour le transférer");
      return;
    }

    const confirmation = window.confirm(
      `⚠️ TRANSFERT NFT RÉEL\n\n` +
      `Type: ${nftType}\n` +
      `Token ID: ${tokenId}\n` +
      `Vers: ${recipient}\n\n` +
      `Cette opération est IRRÉVERSIBLE.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Transfert annulé");
      return;
    }

    setSending(true);
    try {
      const contract = new Contract(
        contractAddress,
        nftType === 'ERC721' ? ERC721_ABI : ERC1155_ABI,
        web3.signer
      );

      let tx;
      if (nftType === 'ERC721') {
        tx = await contract.safeTransferFrom(web3.address, recipient, tokenId);
      } else {
        tx = await contract.safeTransferFrom(
          web3.address,
          recipient,
          tokenId,
          amount,
          '0x'
        );
      }

      toast.loading("Transfert NFT en cours...", { id: 'nft-transfer' });
      const receipt = await tx.wait();

      toast.success(
        `✅ NFT transféré avec succès!\nHash: ${tx.hash.substring(0, 10)}...`,
        { id: 'nft-transfer', duration: 10000 }
      );

      console.log('🎉 NFT Transfer Success:', receipt);

      // Reset
      setTokenId("");
      setRecipient("");
      setAmount("1");
      setNftInfo(null);
    } catch (error: any) {
      console.error('❌ Erreur transfert NFT:', error);
      toast.error(error.message || "Erreur lors du transfert", { id: 'nft-transfer' });
    } finally {
      setSending(false);
    }
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={Image} title="NFT TRANSFER (ERC-721 / ERC-1155)" />
      
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-start gap-2">
          <Layers className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-pink-200">
            <p className="font-semibold mb-1">NFT Transfer</p>
            <p className="text-pink-300/70">
              Transférez vos NFTs (ERC-721 ou ERC-1155) vers n'importe quelle adresse.
              Vérifiez toujours le destinataire avant de confirmer.
            </p>
          </div>
        </div>

        {/* NFT Type Selector */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            TYPE DE NFT
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setNftType('ERC721')}
              className={`p-3 rounded-lg border transition-all ${
                nftType === 'ERC721'
                  ? 'bg-pink-500/20 border-pink-500'
                  : 'bg-black/20 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-sm font-semibold text-white">ERC-721</div>
              <div className="text-[10px] text-white/50">NFT Unique</div>
            </button>
            <button
              onClick={() => setNftType('ERC1155')}
              className={`p-3 rounded-lg border transition-all ${
                nftType === 'ERC1155'
                  ? 'bg-pink-500/20 border-pink-500'
                  : 'bg-black/20 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="text-sm font-semibold text-white">ERC-1155</div>
              <div className="text-[10px] text-white/50">Multi-Tokens</div>
            </button>
          </div>
        </div>

        {/* Contract Address */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            ADRESSE CONTRAT NFT
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-pink-500/50 font-mono"
          />
        </div>

        {/* Token ID */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            TOKEN ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="1234"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              className="flex-1 px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-pink-500/50"
            />
            <button
              onClick={inspectNFT}
              disabled={loading}
              className="px-4 py-2 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-sm hover:bg-pink-500/30 transition-all text-xs inline-flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Inspecter
            </button>
          </div>
        </div>

        {/* Amount (only for ERC1155) */}
        {nftType === 'ERC1155' && (
          <div>
            <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
              QUANTITÉ
            </label>
            <input
              type="number"
              min="1"
              placeholder="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-pink-500/50"
            />
          </div>
        )}

        {/* NFT Info */}
        {nftInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border ${
              nftInfo.isOwner
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="text-xs space-y-1">
              {nftInfo.type === 'ERC721' ? (
                <>
                  <div><strong>Nom:</strong> {nftInfo.name}</div>
                  <div><strong>Symbole:</strong> {nftInfo.symbol}</div>
                  <div><strong>Token ID:</strong> {nftInfo.tokenId}</div>
                  <div><strong>Propriétaire:</strong> {fmtAddr(nftInfo.owner)}</div>
                  <div className={nftInfo.isOwner ? 'text-green-400' : 'text-red-400'}>
                    <strong>{nftInfo.isOwner ? '✓ Vous possédez ce NFT' : '✗ Vous ne possédez PAS ce NFT'}</strong>
                  </div>
                </>
              ) : (
                <>
                  <div><strong>Token ID:</strong> {nftInfo.tokenId}</div>
                  <div><strong>Balance:</strong> {nftInfo.balance}</div>
                  <div className={nftInfo.isOwner ? 'text-green-400' : 'text-red-400'}>
                    <strong>{nftInfo.isOwner ? '✓ Vous possédez ce NFT' : '✗ Vous ne possédez PAS ce NFT'}</strong>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Recipient */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            ADRESSE DESTINATAIRE
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-pink-500/50 font-mono"
          />
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={sending || !nftInfo || !nftInfo.isOwner || !recipient}
          className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Transfert en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Transférer NFT
            </>
          )}
        </button>
      </div>
    </GCard>
  );
}
