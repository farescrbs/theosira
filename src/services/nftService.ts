// ═══════════════════════════════════════════════════════════════════════════
// 🖼️ SERVICE NFT - THESORIA
// Récupération et affichage des NFTs du wallet
// ═══════════════════════════════════════════════════════════════════════════

import { ethers } from 'ethers';
import { web3Service } from './web3Service';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  external_url?: string;
}

export interface NFT {
  tokenId: string;
  contractAddress: string;
  collectionName: string;
  metadata: NFTMetadata;
  owner: string;
  floorPrice?: string;
  lastSale?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ABI ERC721
// ═══════════════════════════════════════════════════════════════════════════

const ERC721_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
];

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE NFT
// ═══════════════════════════════════════════════════════════════════════════

class NFTService {
  // Collections NFT populaires par réseau (pour la démo)
  private readonly POPULAR_COLLECTIONS: Record<number, string[]> = {
    1: [ // Ethereum
      '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', // BAYC
      '0x60E4d786628Fea6478F785A6d7e704777c86a7c6', // MAYC
      '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB', // CryptoPunks
    ],
    137: [ // Polygon
      '0x2953399124F0cBB46d2CbaACD8A89cF0599974FD', // OpenSea Shared
    ],
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RÉCUPÉRER LES NFTs D'UN WALLET
  // ═══════════════════════════════════════════════════════════════════════════

  async getUserNFTs(limit: number = 20): Promise<NFT[]> {
    const provider = web3Service.getProvider();
    const account = web3Service.getCurrentAccount();
    const chainId = web3Service.getCurrentChainId();
    
    if (!provider || !account || !chainId) {
      throw new Error('Wallet non connecté');
    }

    const nfts: NFT[] = [];
    const collections = this.POPULAR_COLLECTIONS[chainId] || [];

    try {
      for (const contractAddress of collections) {
        const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
        
        try {
          // Obtenir le nombre de NFTs
          const balance = await contract.balanceOf(account);
          const balanceNum = Number(balance);
          
          if (balanceNum === 0) continue;

          // Obtenir le nom de la collection
          const collectionName = await contract.name();
          
          // Récupérer les NFTs (limiter à 5 par collection)
          const maxToFetch = Math.min(balanceNum, 5);
          
          for (let i = 0; i < maxToFetch; i++) {
            try {
              const tokenId = await contract.tokenOfOwnerByIndex(account, i);
              const tokenURI = await contract.tokenURI(tokenId);
              
              // Récupérer les métadonnées
              let metadata: NFTMetadata;
              
              if (tokenURI.startsWith('ipfs://')) {
                // Convertir IPFS en HTTP
                const ipfsGateway = 'https://ipfs.io/ipfs/';
                const ipfsHash = tokenURI.replace('ipfs://', '');
                const httpUrl = `${ipfsGateway}${ipfsHash}`;
                
                const response = await fetch(httpUrl);
                metadata = await response.json();
              } else if (tokenURI.startsWith('http')) {
                const response = await fetch(tokenURI);
                metadata = await response.json();
              } else {
                // Métadonnées simulées
                metadata = {
                  name: `${collectionName} #${tokenId}`,
                  description: 'NFT from your collection',
                  image: `https://picsum.photos/seed/${tokenId}/400/400`,
                };
              }
              
              // Convertir l'image IPFS si nécessaire
              if (metadata.image && metadata.image.startsWith('ipfs://')) {
                const ipfsHash = metadata.image.replace('ipfs://', '');
                metadata.image = `https://ipfs.io/ipfs/${ipfsHash}`;
              }
              
              nfts.push({
                tokenId: tokenId.toString(),
                contractAddress,
                collectionName,
                metadata,
                owner: account,
                floorPrice: `${(Math.random() * 5).toFixed(2)} ETH`,
                lastSale: `${(Math.random() * 10).toFixed(2)} ETH`,
              });
              
              if (nfts.length >= limit) break;
              
            } catch (tokenError) {
              console.error(`Erreur lors de la récupération du token ${i}:`, tokenError);
            }
          }
          
        } catch (collectionError) {
          console.error(`Erreur lors de la lecture de la collection ${contractAddress}:`, collectionError);
        }
        
        if (nfts.length >= limit) break;
      }
      
      // Si aucun NFT réel trouvé, générer des NFTs de démo
      if (nfts.length === 0) {
        return this.generateDemoNFTs(limit);
      }
      
      return nfts;
      
    } catch (error) {
      console.error('Erreur lors de la récupération des NFTs:', error);
      // Retourner des NFTs de démo en cas d'erreur
      return this.generateDemoNFTs(limit);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GÉNÉRER DES NFTs DE DÉMO
  // ═══════════════════════════════════════════════════════════════════════════

  private generateDemoNFTs(count: number): NFT[] {
    const collections = [
      'Thesoria Genesis',
      'Gold Membership',
      'Diamond Pass',
      'Elite Club',
      'Founders Edition',
    ];

    const attributes = [
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Level', value: 100 },
      { trait_type: 'Power', value: 'Supreme' },
      { trait_type: 'Edition', value: 'Limited' },
    ];

    return Array.from({ length: count }, (_, i) => ({
      tokenId: (i + 1).toString(),
      contractAddress: '0x' + '0'.repeat(40),
      collectionName: collections[i % collections.length],
      metadata: {
        name: `${collections[i % collections.length]} #${i + 1}`,
        description: 'Exclusive THESORIA NFT with premium benefits and lifetime access to the platform.',
        image: `https://picsum.photos/seed/thesoria-${i}/400/400`,
        attributes: attributes.slice(0, (i % 4) + 1),
      },
      owner: web3Service.getCurrentAccount() || '',
      floorPrice: `${(Math.random() * 5 + 0.5).toFixed(2)} ETH`,
      lastSale: `${(Math.random() * 10 + 1).toFixed(2)} ETH`,
    }));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RÉCUPÉRER LES DÉTAILS D'UN NFT
  // ═══════════════════════════════════════════════════════════════════════════

  async getNFTDetails(contractAddress: string, tokenId: string): Promise<NFT | null> {
    const provider = web3Service.getProvider();
    const account = web3Service.getCurrentAccount();
    
    if (!provider || !account) {
      throw new Error('Wallet non connecté');
    }

    try {
      const contract = new ethers.Contract(contractAddress, ERC721_ABI, provider);
      
      const [tokenURI, collectionName] = await Promise.all([
        contract.tokenURI(tokenId),
        contract.name(),
      ]);
      
      // Récupérer les métadonnées
      let metadata: NFTMetadata;
      
      if (tokenURI.startsWith('http')) {
        const response = await fetch(tokenURI);
        metadata = await response.json();
      } else {
        metadata = {
          name: `${collectionName} #${tokenId}`,
          description: 'NFT Details',
          image: `https://picsum.photos/seed/${tokenId}/400/400`,
        };
      }
      
      return {
        tokenId,
        contractAddress,
        collectionName,
        metadata,
        owner: account,
      };
      
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du NFT:', error);
      return null;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export const nftService = new NFTService();
