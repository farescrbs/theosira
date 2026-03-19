/**
 * Hook pour interagir avec le Smart Contract FlashBot
 * 
 * Permet à l'IA Maître d'exécuter des Flash Loans on-chain
 * Version: 1.0.2 - Production Mode (Force Recompile)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { ethers, BrowserProvider, Contract, Signer } from 'ethers'

// Mode Production - Connexion wallet réelle
const DEMO_MODE = false // ⚡ MODE RÉEL ACTIVÉ - Wallet MetaMask requis

// ABI simplifié du FlashBot
const FLASH_BOT_ABI = [
  "function requestFlashLoan(address _token, uint256 _amount, bytes calldata _params) external",
  "function withdraw(address _tokenAddress) external",
  "function withdrawETH() external",
  "function getBalance(address _token) external view returns (uint256)",
  "function owner() external view returns (address)",
  "event FlashLoanExecuted(address indexed asset, uint256 amount, uint256 premium, uint256 profit)",
  "event ArbitrageExecuted(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut, uint256 profit)",
  "event ProfitWithdrawn(address indexed token, uint256 amount, address indexed to)",
]

// Adresses des tokens (Polygon)
export const TOKEN_ADDRESSES = {
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  WBTC: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
}

export interface FlashLoanParams {
  tokenIn: string
  tokenOut: string
  path1: string[]
  path2: string[]
  minProfit: string
  dex1: number // 0=Uniswap, 1=Sushiswap
  dex2: number
}

export interface ContractTransaction {
  hash: string
  timestamp: string
  status: 'pending' | 'success' | 'failed'
  amount: string
  token: string
  profit?: string
  gasUsed?: string
}

interface UseFlashBotContractReturn {
  // État
  isConnected: boolean
  contractAddress: string | null
  ownerAddress: string | null
  contractExists: boolean
  
  // Soldes
  tokenBalances: Record<string, string>
  ethBalance: string
  
  // Transactions
  recentTransactions: ContractTransaction[]
  pendingTx: string | null
  
  // Actions
  connect: () => Promise<void>
  executeFlashLoan: (token: string, amount: string, params: FlashLoanParams) => Promise<string>
  withdrawToken: (token: string) => Promise<string>
  withdrawETH: () => Promise<string>
  refreshBalances: () => Promise<void>
  
  // Stats
  totalProfit: string
  totalTransactions: number
  successRate: number
}

/**
 * Hook principal pour le FlashBot Contract
 */
export function useFlashBotContract(): UseFlashBotContractReturn {
  // État
  const [isConnected, setIsConnected] = React.useState(false)
  const [contractAddress, setContractAddress] = React.useState<string | null>(null)
  const [ownerAddress, setOwnerAddress] = React.useState<string | null>(null)
  const [contract, setContract] = React.useState<Contract | null>(null)
  const [provider, setProvider] = React.useState<BrowserProvider | null>(null)
  const [signer, setSigner] = React.useState<Signer | null>(null)
  
  // Soldes
  const [tokenBalances, setTokenBalances] = React.useState<Record<string, string>>({})
  const [ethBalance, setEthBalance] = React.useState('0')
  
  // Transactions
  const [recentTransactions, setRecentTransactions] = React.useState<ContractTransaction[]>([])
  const [pendingTx, setPendingTx] = React.useState<string | null>(null)
  
  // Stats
  const [totalProfit, setTotalProfit] = React.useState('0')
  const [totalTransactions, setTotalTransactions] = React.useState(0)
  const [successRate, setSuccessRate] = React.useState(0)
  
  /**
   * Connexion au wallet et au contrat
   */
  const connect = React.useCallback(async () => {
    try {
      // Vérifier si MetaMask est installé
      if (!window.ethereum) {
        alert('MetaMask non détecté. Veuillez installer MetaMask.')
        return
      }
      
      // Demander la connexion
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      
      // Créer le provider (ethers v6)
      const web3Provider = new BrowserProvider(window.ethereum)
      const web3Signer = await web3Provider.getSigner()
      const address = await web3Signer.getAddress()
      
      setProvider(web3Provider)
      setSigner(web3Signer)
      setOwnerAddress(address)
      
      // Charger l'adresse du contrat
      let contractAddr: string
      
      try {
        const deploymentInfo = await fetch('/contracts/deployment.json').then(r => {
          if (!r.ok) throw new Error('Deployment file not found')
          return r.json()
        })
        contractAddr = deploymentInfo.contractAddress
        console.log('✅ Contrat chargé depuis deployment.json:', contractAddr)
      } catch {
        // Utiliser l'adresse par défaut (Gnosis Chain - Aave Factory)
        contractAddr = '0x43c658Ea38bBfD897706fDb35e2468ef5D8F6927'
        console.log('✅ Utilisation de l\'adresse par défaut (Gnosis Chain):', contractAddr)
      }
      
      // Créer l'instance du contrat
      const flashBotContract = new Contract(
        contractAddr,
        FLASH_BOT_ABI,
        web3Signer
      )
      
      setContract(flashBotContract)
      setContractAddress(contractAddr)
      setIsConnected(true)
      
      console.log('✅ Connecté au FlashBot:', contractAddr)
      console.log('✅ Wallet connecté:', address)
    } catch (error) {
      console.error('Erreur de connexion:', error)
      alert('Erreur lors de la connexion au contrat')
    }
  }, [])
  
  /**
   * Exécuter un Flash Loan
   */
  const executeFlashLoan = React.useCallback(async (
    token: string,
    amount: string,
    params: FlashLoanParams
  ): Promise<string> => {
    if (!contract || !signer) {
      throw new Error('Contrat non connecté')
    }
    
    try {
      // Vérifier le réseau actuel
      if (!provider) {
        throw new Error('Provider non initialisé')
      }
      
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId)
      
      // Vérifier si on est sur un réseau supporté
      const SUPPORTED_NETWORKS: Record<number, string> = {
        100: 'Gnosis Chain',
        137: 'Polygon',
        11155111: 'Sepolia Testnet'
      }
      
      if (!SUPPORTED_NETWORKS[chainId]) {
        throw new Error(
          `⚠️ Réseau non supporté (Chain ID: ${chainId}).\n\n` +
          `Réseaux supportés:\n` +
          `• Gnosis Chain (100)\n` +
          `• Polygon (137)\n` +
          `• Sepolia Testnet (11155111)\n\n` +
          `Veuillez changer de réseau dans MetaMask.`
        )
      }
      
      // Vérifier si le contrat existe sur ce réseau
      const code = await provider.getCode(contractAddress!)
      if (code === '0x' || code === '0x0') {
        throw new Error(
          `⚠️ Contrat non déployé sur ${SUPPORTED_NETWORKS[chainId]}.\n\n` +
          `Le contrat FlashBot doit d'abord être déployé sur ce réseau.\n` +
          `Adresse recherchée: ${contractAddress}\n\n` +
          `Pour déployer:\n` +
          `1. Consultez /contracts/DEPLOYMENT_GUIDE.md\n` +
          `2. Ou changez de réseau vers un réseau où le contrat est déjà déployé`
        )
      }
      
      // Convertir le montant en Wei (6 décimales pour USDC/USDT)
      const amountWei = ethers.parseUnits(amount, 6)
      
      // Encoder les paramètres
      const encodedParams = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'address', 'address[]', 'address[]', 'uint256', 'uint8', 'uint8'],
        [
          params.tokenIn,
          params.tokenOut,
          params.path1,
          params.path2,
          ethers.parseUnits(params.minProfit, 6),
          params.dex1,
          params.dex2,
        ]
      )
      
      console.log('🚀 Lancement du Flash Loan...', { token, amount, params })
      
      // Exécuter la transaction (mode démo - ne vérifie pas l'existence du contrat)
      const tx = await contract.requestFlashLoan(token, amountWei, encodedParams)
      
      setPendingTx(tx.hash)
      setTotalTransactions(prev => prev + 1)
      
      // Ajouter à l'historique
      setRecentTransactions(prev => [{
        hash: tx.hash,
        timestamp: new Date().toISOString(),
        status: 'pending',
        amount,
        token,
      }, ...prev])
      
      console.log('⏳ Transaction envoyée:', tx.hash)
      
      // Attendre la confirmation
      const receipt = await tx.wait()
      
      setPendingTx(null)
      
      // Mettre à jour le statut
      setRecentTransactions(prev => prev.map(t => 
        t.hash === tx.hash ? { ...t, status: 'success', gasUsed: receipt.gasUsed.toString() } : t
      ))
      
      console.log('✅ Transaction confirmée!')
      
      return tx.hash
    } catch (error: any) {
      console.error('❌ Erreur Flash Loan:', error)
      
      setPendingTx(null)
      
      setRecentTransactions(prev => prev.map(t => 
        t.status === 'pending' ? { ...t, status: 'failed' } : t
      ))
      
      // Message d'erreur simplifié
      if (error.message?.includes('missing revert data') || error.code === 'CALL_EXCEPTION') {
        throw new Error('⚠️ Mode démo : Transaction simulée. Connectez MetaMask à Polygon ou Gnosis pour utiliser un vrai contrat.')
      }
      
      throw error
    }
  }, [contract, signer, provider, contractAddress])
  
  /**
   * Retirer un token
   */
  const withdrawToken = React.useCallback(async (token: string): Promise<string> => {
    if (!contract) throw new Error('Contrat non connecté')
    
    const tx = await contract.withdraw(token)
    await tx.wait()
    
    return tx.hash
  }, [contract])
  
  /**
   * Retirer ETH/MATIC
   */
  const withdrawETH = React.useCallback(async (): Promise<string> => {
    if (!contract) throw new Error('Contrat non connecté')
    
    const tx = await contract.withdrawETH()
    await tx.wait()
    
    return tx.hash
  }, [contract])
  
  /**
   * Rafraîchir tous les soldes
   */
  const refreshBalances = React.useCallback(async () => {
    if (!contract || !contractAddress) return
    
    try {
      // Solde ETH/MATIC
      const ethBal = await provider?.getBalance(contractAddress)
      if (ethBal) {
        setEthBalance(ethers.formatEther(ethBal))
      }
      
      // Soldes des tokens
      const balances: Record<string, string> = {}
      
      for (const [symbol, address] of Object.entries(TOKEN_ADDRESSES)) {
        try {
          const balance = await contract.getBalance(address)
          balances[symbol] = ethers.formatUnits(balance, 6)
        } catch {
          balances[symbol] = '0'
        }
      }
      
      setTokenBalances(balances)
    } catch (error) {
      // Erreur silencieuse
    }
  }, [contract, contractAddress, provider])
  
  // Calculer le taux de succès
  React.useEffect(() => {
    const successTx = recentTransactions.filter(t => t.status === 'success').length
    const failedTx = recentTransactions.filter(t => t.status === 'failed').length
    const total = successTx + failedTx
    
    if (total > 0) {
      setSuccessRate((successTx / total) * 100)
    }
  }, [recentTransactions])
  
  return {
    // État
    isConnected,
    contractAddress,
    ownerAddress,
    contractExists: !!contractAddress,
    
    // Soldes
    tokenBalances,
    ethBalance,
    
    // Transactions
    recentTransactions,
    pendingTx,
    
    // Actions
    connect,
    executeFlashLoan,
    withdrawToken,
    withdrawETH,
    refreshBalances,
    
    // Stats
    totalProfit,
    totalTransactions,
    successRate,
  }
}

// Utilitaires d'export
export function formatTokenAmount(amount: string, decimals: number = 6): string {
  return parseFloat(amount).toFixed(decimals)
}

export function getTokenSymbol(address: string): string {
  return Object.entries(TOKEN_ADDRESSES).find(([_, addr]) => 
    addr.toLowerCase() === address.toLowerCase()
  )?.[0] || 'UNKNOWN'
}