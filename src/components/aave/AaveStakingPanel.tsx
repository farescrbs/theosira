import React, { useState } from 'react';
import { Lock, Unlock, TrendingUp, Award } from 'lucide-react';

interface StakingPosition {
  asset: 'AAVE' | 'stkAAVE' | 'GHO';
  staked: number;
  rewards: number;
  apy: number;
  cooldown: number | null;
}

export default function AaveStakingPanel() {
  const [positions, setPositions] = useState<StakingPosition[]>([
    {
      asset: 'AAVE',
      staked: 250,
      rewards: 12.45,
      apy: 7.2,
      cooldown: null,
    },
    {
      asset: 'stkAAVE',
      staked: 180,
      rewards: 8.92,
      apy: 6.8,
      cooldown: null,
    },
  ]);

  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<'AAVE' | 'GHO'>('AAVE');

  const totalStakedValue = positions.reduce((acc, pos) => {
    const priceMap = { AAVE: 165, stkAAVE: 165, GHO: 1 };
    return acc + pos.staked * priceMap[pos.asset];
  }, 0);

  const totalRewardsValue = positions.reduce((acc, pos) => {
    return acc + pos.rewards * 165; // AAVE price
  }, 0);

  const activateCooldown = (asset: StakingPosition['asset']) => {
    setPositions(prev => prev.map(pos => 
      pos.asset === asset 
        ? { ...pos, cooldown: 10 } // 10 jours de cooldown
        : pos
    ));
  };

  const claimRewards = (asset: StakingPosition['asset']) => {
    setPositions(prev => prev.map(pos => 
      pos.asset === asset 
        ? { ...pos, rewards: 0 }
        : pos
    ));
  };

  const stake = () => {
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0) return;

    setPositions(prev => {
      const existing = prev.find(p => p.asset === selectedAsset);
      if (existing) {
        return prev.map(p => 
          p.asset === selectedAsset
            ? { ...p, staked: p.staked + amount }
            : p
        );
      } else {
        return [...prev, {
          asset: selectedAsset,
          staked: amount,
          rewards: 0,
          apy: selectedAsset === 'AAVE' ? 7.2 : 5.5,
          cooldown: null,
        }];
      }
    });

    setStakeAmount('');
  };

  return (
    <div className="backdrop-blur-xl bg-black/40 border border-yellow-500/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl text-white">Aave Staking</h2>
            <p className="text-sm text-gray-400">Stake AAVE pour des récompenses</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black/30 border border-yellow-500/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total Staked</p>
          <p className="text-xl text-white">${totalStakedValue.toLocaleString()}</p>
        </div>
        <div className="bg-black/30 border border-yellow-500/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Rewards</p>
          <p className="text-xl text-green-400">${totalRewardsValue.toFixed(2)}</p>
        </div>
        <div className="bg-black/30 border border-yellow-500/10 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Avg APY</p>
          <p className="text-xl text-purple-400">
            {(positions.reduce((acc, p) => acc + p.apy, 0) / positions.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Stake Form */}
      <div className="bg-black/30 border border-yellow-500/10 rounded-xl p-4 mb-6">
        <h3 className="text-white mb-3">Stake Assets</h3>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-gray-400 mb-2">Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value as 'AAVE' | 'GHO')}
              className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
            >
              <option value="AAVE">AAVE</option>
              <option value="GHO">GHO</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">Amount</label>
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          onClick={stake}
          className="w-full py-3 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all"
        >
          Stake {selectedAsset}
        </button>
      </div>

      {/* Positions */}
      <div className="space-y-3">
        <h3 className="text-white mb-3">Your Positions</h3>

        {positions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No staking positions yet</p>
          </div>
        ) : (
          positions.map((pos) => (
            <div
              key={pos.asset}
              className="bg-black/30 border border-yellow-500/10 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg text-white">{pos.asset}</h4>
                  <p className="text-xs text-gray-400">
                    {pos.staked} {pos.asset} staked
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-purple-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{pos.apy}% APY</span>
                  </div>
                </div>
              </div>

              {/* Cooldown Status */}
              {pos.cooldown !== null && (
                <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-400">
                    ⏳ Cooldown period: {pos.cooldown} days remaining
                  </p>
                </div>
              )}

              {/* Rewards */}
              <div className="bg-green-500/10 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Rewards</span>
                  </div>
                  <span className="text-green-400">
                    {pos.rewards.toFixed(4)} AAVE
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                {pos.cooldown === null ? (
                  <button
                    onClick={() => activateCooldown(pos.asset)}
                    className="py-2 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all text-sm"
                  >
                    <Unlock className="w-4 h-4 inline mr-1" />
                    Unstake
                  </button>
                ) : (
                  <button
                    disabled
                    className="py-2 bg-gray-500/20 border border-gray-500/30 text-gray-500 rounded-lg text-sm cursor-not-allowed"
                  >
                    Cooldown...
                  </button>
                )}

                <button
                  onClick={() => claimRewards(pos.asset)}
                  disabled={pos.rewards === 0}
                  className={`py-2 rounded-lg text-sm transition-all ${
                    pos.rewards > 0
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                      : 'bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Claim Rewards
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-400">
          ℹ️ Le unstaking nécessite une période de cooldown de 10 jours. Les récompenses sont distribuées en AAVE.
        </p>
      </div>
    </div>
  );
}
