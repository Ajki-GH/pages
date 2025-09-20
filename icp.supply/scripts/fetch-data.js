#!/usr/bin/env node
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

class ICPDataFetcher {
  constructor() {
    this.endpoints = {
      totalSupply: 'https://ledger-api.internetcomputer.org/supply/total/latest',
      circulatingSupply: 'https://ledger-api.internetcomputer.org/supply/circulating/latest',
      dailyStats: 'https://ic-api.internetcomputer.org/api/v3/daily-stats?format=json',
      dissolvingNeurons: 'https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_dissolving_neurons_e8s',
      lockedNeurons: 'https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_not_dissolving_neurons_e8s',
      totalMaturity: 'https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_total_maturity_e8s_equivalent',
      dissolvingMaturity: 'https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_dissolving_neurons_staked_maturity_e8s_equivalent',
      lockedMaturity: 'https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_not_dissolving_neurons_staked_maturity_e8s_equivalent'
    };
    
    this.retryOptions = {
      maxRetries: 3,
      retryDelay: 1000
    };
  }

  async fetchWithRetry(url, options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.retryOptions.maxRetries; attempt++) {
      try {
        console.log(`Fetching ${url} (attempt ${attempt}/${this.retryOptions.maxRetries})`);
        
        const response = await fetch(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'icp-supply-dashboard/1.0.0',
            ...options.headers
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(`✓ Successfully fetched from ${url}`);
        return data;
        
      } catch (error) {
        lastError = error;
        console.warn(`⚠ Attempt ${attempt} failed for ${url}:`, error.message);
        
        if (attempt < this.retryOptions.maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.retryOptions.retryDelay * attempt));
        }
      }
    }
    
    throw new Error(`Failed to fetch ${url} after ${this.retryOptions.maxRetries} attempts: ${lastError.message}`);
  }

  aggregateYearBuckets(buckets) {
    const yearBuckets = {
      '0-1 years': 0, '1-2 years': 0, '2-3 years': 0, '3-4 years': 0,
      '4-5 years': 0, '5-6 years': 0, '6-7 years': 0, '7-8 years': 0, '8+ years': 0
    };
    
    buckets.forEach(bucket => {
      const months = bucket.dissolve_delay_months;
      const value = parseInt(bucket.count) / 100000000; // Convert from e8s
      
      if (months >= 0 && months < 12) yearBuckets['0-1 years'] += value;
      else if (months >= 12 && months < 24) yearBuckets['1-2 years'] += value;
      else if (months >= 24 && months < 36) yearBuckets['2-3 years'] += value;
      else if (months >= 36 && months < 48) yearBuckets['3-4 years'] += value;
      else if (months >= 48 && months < 60) yearBuckets['4-5 years'] += value;
      else if (months >= 60 && months < 72) yearBuckets['5-6 years'] += value;
      else if (months >= 72 && months < 84) yearBuckets['6-7 years'] += value;
      else if (months >= 84 && months < 96) yearBuckets['7-8 years'] += value;
      else if (months >= 96) yearBuckets['8+ years'] += value;
    });
    
    return yearBuckets;
  }

  async fetchAllData() {
    console.log('🚀 Starting ICP data fetch...\n');
    
    try {
      // Fetch all endpoints
      const [
        totalSupplyData,
        circulatingSupplyData,
        dailyStatsData,
        dissolvingNeuronsData,
        lockedNeuronsData,
        totalMaturityData,
        dissolvingMaturityData,
        lockedMaturityData
      ] = await Promise.all([
        this.fetchWithRetry(this.endpoints.totalSupply),
        this.fetchWithRetry(this.endpoints.circulatingSupply),
        this.fetchWithRetry(this.endpoints.dailyStats),
        this.fetchWithRetry(this.endpoints.dissolvingNeurons),
        this.fetchWithRetry(this.endpoints.lockedNeurons),
        this.fetchWithRetry(this.endpoints.totalMaturity),
        this.fetchWithRetry(this.endpoints.dissolvingMaturity),
        this.fetchWithRetry(this.endpoints.lockedMaturity)
      ]);

      // Process the data
      const totalSupply = totalSupplyData.supply_e8s / 100000000;
      const circulatingSupply = circulatingSupplyData.supply_e8s / 100000000;
      const dailyStats = dailyStatsData[0]; // Latest stats
      
      const stakedTotal = dailyStats.governance_total_locked_e8s / 100000000;
      const dissolvingBuckets = this.aggregateYearBuckets(dissolvingNeuronsData);
      const lockedBuckets = this.aggregateYearBuckets(lockedNeuronsData);
      
      const totalMaturity = (totalMaturityData.governance_total_maturity_e8s_equivalent + 
                           (dailyStats.governance_total_staked_maturity_e8s_equivalent || 0)) / 100000000;
      const stakedMaturity = (dailyStats.governance_total_staked_maturity_e8s_equivalent || 0) / 100000000;
      const unlockedMaturity = totalMaturity - stakedMaturity;
      
      const dissolvingMaturityBuckets = this.aggregateYearBuckets(dissolvingMaturityData);
      const lockedMaturityBuckets = this.aggregateYearBuckets(lockedMaturityData);
      
      const burnedFees = dailyStats.icp_burned_fees / 100000000;
      const burnedCycles = dailyStats.total_cycle_burn_till_date / 100000000;
      const totalBurned = burnedFees + burnedCycles;

      // Calculate unlocking and locked totals
      const unlockingTotal = Object.values(dissolvingBuckets).reduce((sum, val) => sum + val, 0);
      const lockedTotal = Object.values(lockedBuckets).reduce((sum, val) => sum + val, 0);
      const unlockingMaturityTotal = Object.values(dissolvingMaturityBuckets).reduce((sum, val) => sum + val, 0);
      const lockedMaturityTotal = Object.values(lockedMaturityBuckets).reduce((sum, val) => sum + val, 0);

      // Build the structured data
      const structuredData = new Map([
        ['total', { value: totalSupply, type: 'row-level-0' }],
        ['liquid', { value: circulatingSupply, type: 'row-level-0' }],
        ['staked', { value: stakedTotal, type: 'row-level-0', expandable: true }],
        ['staked.unlocking', { value: unlockingTotal, type: 'row-level-1', parent: 'staked', expandable: true }],
        ['staked.locked', { value: lockedTotal, type: 'row-level-1', parent: 'staked', expandable: true }],
        ['staked.community', { value: 0, type: 'row-level-1', parent: 'staked' }], // TODO: Add community fund data
        ['rewards', { value: totalMaturity, type: 'row-level-0', expandable: true }],
        ['rewards.unlocked', { value: unlockedMaturity, type: 'row-level-1', parent: 'rewards' }],
        ['rewards.unlocking', { value: unlockingMaturityTotal, type: 'row-level-1', parent: 'rewards', expandable: true }],
        ['rewards.locked', { value: lockedMaturityTotal, type: 'row-level-1', parent: 'rewards', expandable: true }],
        ['rewards.allocation', { value: 0, type: 'row-level-1', parent: 'rewards', expandable: true }], // TODO: Add allocation data
        ['rewards.allocation.stakers', { value: 0, type: 'row-level-2', parent: 'rewards.allocation' }],
        ['rewards.allocation.nodes', { value: 0, type: 'row-level-2', parent: 'rewards.allocation' }],
        ['rewards.community', { value: 0, type: 'row-level-1', parent: 'rewards' }], // TODO: Add community rewards data
        ['burned', { value: totalBurned, type: 'row-level-0', expandable: true }],
        ['burned.fees', { value: burnedFees, type: 'row-level-1', parent: 'burned' }],
        ['burned.cycles', { value: burnedCycles, type: 'row-level-1', parent: 'burned' }]
      ]);

      // Add year buckets for staked
      Object.entries(dissolvingBuckets).forEach(([period, value]) => {
        structuredData.set(`staked.unlocking.${period}`, {
          value, type: 'row-level-2', parent: 'staked.unlocking'
        });
      });
      
      Object.entries(lockedBuckets).forEach(([period, value]) => {
        structuredData.set(`staked.locked.${period}`, {
          value, type: 'row-level-2', parent: 'staked.locked'
        });
      });

      // Add year buckets for rewards (formerly maturity)
      Object.entries(dissolvingMaturityBuckets).forEach(([period, value]) => {
        structuredData.set(`rewards.unlocking.${period}`, {
          value, type: 'row-level-2', parent: 'rewards.unlocking'
        });
      });
      
      Object.entries(lockedMaturityBuckets).forEach(([period, value]) => {
        structuredData.set(`rewards.locked.${period}`, {
          value, type: 'row-level-2', parent: 'rewards.locked'
        });
      });

      // Convert Map to Object for JSON serialization
      const dataObject = Object.fromEntries(structuredData);
      
      const result = {
        data: dataObject,
        totalSupply: totalSupply,
        lastUpdated: new Date().toISOString(),
        fetchedAt: Date.now()
      };

      console.log('\n✅ Data processing completed successfully');
      console.log(`📊 Total Supply: ${totalSupply.toLocaleString()} ICP`);
      console.log(`💧 Liquid: ${circulatingSupply.toLocaleString()} ICP`);
      console.log(`🔒 Staked: ${stakedTotal.toLocaleString()} ICP`);
      console.log(`🎁 Rewards: ${totalMaturity.toLocaleString()} ICP`);
      console.log(`🔥 Burned: ${totalBurned.toLocaleString()} ICP\n`);

      return result;
      
    } catch (error) {
      console.error('❌ Error fetching ICP data:', error.message);
      throw error;
    }
  }

  async saveData() {
    try {
      const data = await this.fetchAllData();
      
      // Ensure public directory exists
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      
      const dataPath = path.join(publicDir, 'metrics.json');
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      
      console.log(`💾 Data saved to: ${dataPath}`);
      console.log(`📁 File size: ${(fs.statSync(dataPath).size / 1024).toFixed(2)} KB`);
      
      return data;
      
    } catch (error) {
      console.error('❌ Error saving data:', error.message);
      process.exit(1);
    }
  }
}

// Run the data fetcher
const fetcher = new ICPDataFetcher();
fetcher.saveData().then(() => {
  console.log('🎉 Data fetch completed successfully!');
}).catch(error => {
  console.error('💥 Data fetch failed:', error.message);
  process.exit(1);
});