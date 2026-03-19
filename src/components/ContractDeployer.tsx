/**
 * Contract Deployer - Deploy smart contracts from UI
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Rocket, Loader2, Code, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ContractFactory } from "ethers";

interface ContractDeployerProps {
  web3: any;
  fmtAddr: (addr: string) => string;
  GCard: any;
  STitle: any;
}

// Sample ERC-20 contract bytecode (simplified)
const SAMPLE_CONTRACTS = {
  simpleStorage: {
    name: "Simple Storage",
    description: "Un contrat de stockage simple",
    bytecode: "0x608060405234801561001057600080fd5b5060c78061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610603c5760003560e01c80632e64cec11460415780636057361d146051575b600080fd5b6047606b565b604051808215158152602001915050f35b606960048036038101906064919060ab565b6074565b005b60008054905090565b8060008190555050565b60008135905060a5816099565b92915050565b60006020828403121560bd57600080fd5b600060c984828501607e565b91505092915050565b60de8160d4565b811460e957600080fd5b5056fea2646970667358221220",
    abi: [
      "function set(uint256 x)",
      "function get() view returns (uint256)"
    ],
  },
};

export default function ContractDeployer({ web3, fmtAddr, GCard, STitle }: ContractDeployerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof SAMPLE_CONTRACTS>('simpleStorage');
  const [customBytecode, setCustomBytecode] = useState("");
  const [customAbi, setCustomAbi] = useState("");
  const [constructorArgs, setConstructorArgs] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState("");

  const handleDeploy = async () => {
    const confirmation = window.confirm(
      `⚠️ DEPLOYMENT RÉEL\n\n` +
      `Vous allez déployer un contrat sur ${web3.networkName}.\n\n` +
      `Cette opération consomme du gas et est IRRÉVERSIBLE.\n\n` +
      `Continuer ?`
    );

    if (!confirmation) {
      toast.info("Deployment annulé");
      return;
    }

    setDeploying(true);
    try {
      toast.loading("Déploiement du contrat...", { id: 'deploy' });

      const template = SAMPLE_CONTRACTS[selectedTemplate];
      const bytecode = customBytecode || template.bytecode;
      const abi = customAbi ? JSON.parse(customAbi) : template.abi;

      // Parse constructor arguments
      const args = constructorArgs
        ? constructorArgs.split(',').map(arg => arg.trim())
        : [];

      // Create contract factory
      const factory = new ContractFactory(abi, bytecode, web3.signer);

      // Deploy
      const contract = await factory.deploy(...args);
      
      toast.loading("Attente de confirmation...", { id: 'deploy' });
      await contract.waitForDeployment();

      const address = await contract.getAddress();
      setDeployedAddress(address);

      toast.success(
        `✅ Contrat déployé!\nAdresse: ${address.substring(0, 10)}...`,
        { id: 'deploy', duration: 15000 }
      );

      console.log('🚀 Contract Deployed:', {
        address,
        template: selectedTemplate,
        constructorArgs: args,
      });
    } catch (error: any) {
      console.error('❌ Erreur deployment:', error);
      toast.error(error.message || "Erreur lors du déploiement", { id: 'deploy' });
    } finally {
      setDeploying(false);
    }
  };

  if (!web3.isConnected) {
    return null;
  }

  return (
    <GCard>
      <STitle icon={Rocket} title="CONTRACT DEPLOYER" />
      
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-2">
          <Code className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-indigo-200">
            <p className="font-semibold mb-1">Smart Contract Deployment</p>
            <p className="text-indigo-300/70">
              Déployez des smart contracts directement depuis le God Mode.
              Utilisez un template ou fournissez votre propre bytecode.
            </p>
          </div>
        </div>

        {/* Template Selector */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            TEMPLATE
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof SAMPLE_CONTRACTS)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-indigo-500/50"
          >
            {Object.entries(SAMPLE_CONTRACTS).map(([key, contract]) => (
              <option key={key} value={key}>
                {contract.name} - {contract.description}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Bytecode */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            BYTECODE PERSONNALISÉ (optionnel)
          </label>
          <textarea
            placeholder="0x608060405234801561001057600080fd5b50..."
            value={customBytecode}
            onChange={(e) => setCustomBytecode(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-[10px] focus:outline-none focus:border-indigo-500/50 resize-none font-mono"
            rows={4}
          />
          <p className="text-[9px] text-white/30 mt-1">
            Laissez vide pour utiliser le template
          </p>
        </div>

        {/* Custom ABI */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            ABI PERSONNALISÉE (optionnel, JSON)
          </label>
          <textarea
            placeholder='["function set(uint256 x)", "function get() view returns (uint256)"]'
            value={customAbi}
            onChange={(e) => setCustomAbi(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-[10px] focus:outline-none focus:border-indigo-500/50 resize-none font-mono"
            rows={3}
          />
          <p className="text-[9px] text-white/30 mt-1">
            Format JSON ou Human-Readable ABI
          </p>
        </div>

        {/* Constructor Arguments */}
        <div>
          <label className="text-[10px] text-white/40 mb-2 block tracking-wider">
            ARGUMENTS CONSTRUCTOR (séparés par virgules)
          </label>
          <input
            type="text"
            placeholder="arg1, arg2, arg3"
            value={constructorArgs}
            onChange={(e) => setConstructorArgs(e.target.value)}
            className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white text-xs focus:outline-none focus:border-indigo-500/50"
          />
          <p className="text-[9px] text-white/30 mt-1">
            Laissez vide si le contrat n'a pas de constructor
          </p>
        </div>

        {/* Deploy Button */}
        <button
          onClick={handleDeploy}
          disabled={deploying}
          className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {deploying ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Déploiement en cours...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Déployer le Contrat
            </>
          )}
        </button>

        {/* Deployed Contract Info */}
        {deployedAddress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-green-500/10 border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs font-semibold text-green-400">CONTRAT DÉPLOYÉ</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-white/40 mb-1">Adresse:</div>
                <div className="flex items-center gap-2">
                  <code className="text-white font-mono bg-black/30 px-2 py-1 rounded">
                    {fmtAddr(deployedAddress)}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(deployedAddress);
                      toast.success("Adresse copiée!");
                    }}
                    className="text-[#d4af37] hover:text-yellow-300 text-[10px] underline"
                  >
                    Copier
                  </button>
                </div>
              </div>

              <div>
                <div className="text-white/40 mb-1">Réseau:</div>
                <div className="text-white">{web3.networkName}</div>
              </div>

              <div>
                <div className="text-white/40 mb-1">Explorer:</div>
                <a
                  href={`https://${web3.chainId === 1 ? '' : web3.networkName.toLowerCase().replace(' ', '') + '.'}etherscan.io/address/${deployedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4af37] hover:text-yellow-300 underline"
                >
                  Voir sur Etherscan ↗
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Warning */}
        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
          <p className="text-[9px] text-red-300 leading-relaxed">
            <strong>⚠️ Attention:</strong> Le déploiement de contrats consomme beaucoup de gas.
            Vérifiez votre bytecode et ABI avant de déployer. Les contrats déployés sont permanents.
          </p>
        </div>
      </div>
    </GCard>
  );
}
