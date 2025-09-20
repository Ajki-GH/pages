/**
 * Service for loading and managing ICP metrics data
 */

export class DataService {
  constructor() {
    this.data = null;
    this.totalSupply = 0;
    this.lastUpdated = null;
    this.cache = new Map();
  }

  async loadData() {
    try {
      console.log('Loading ICP metrics data...');
      
      const response = await fetch('./metrics.json');
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      
      // Validate data structure
      if (!jsonData.data || !jsonData.totalSupply) {
        throw new Error('Invalid data format received');
      }
      
      this.data = new Map(Object.entries(jsonData.data));
      this.totalSupply = jsonData.totalSupply;
      this.lastUpdated = jsonData.lastUpdated;
      
      console.log('✅ Data loaded successfully');
      console.log(`📊 Total entries: ${this.data.size}`);
      console.log(`📈 Total supply: ${this.totalSupply.toLocaleString()} ICP`);
      
      return this.data;
      
    } catch (error) {
      console.error('❌ Error loading data:', error);
      
      // Fallback to cached data if available
      if (this.data) {
        console.warn('⚠️ Using cached data as fallback');
        return this.data;
      }
      
      throw error;
    }
  }

  getData() {
    return this.data;
  }

  getTotalSupply() {
    return this.totalSupply;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  getMetric(key) {
    return this.data?.get(key) || null;
  }

  isDataLoaded() {
    return this.data !== null;
  }

  getOrderedKeys() {
    // Define the specific order for displaying metrics
    return [
      'total',
      'liquid',
      'staked',
      'staked.unlocking',
      'staked.unlocking.0-1 years',
      'staked.unlocking.1-2 years', 
      'staked.unlocking.2-3 years',
      'staked.unlocking.3-4 years',
      'staked.unlocking.4-5 years',
      'staked.unlocking.5-6 years',
      'staked.unlocking.6-7 years',
      'staked.unlocking.7-8 years',
      'staked.unlocking.8+ years',
      'staked.locked',
      'staked.locked.0-1 years',
      'staked.locked.1-2 years',
      'staked.locked.2-3 years', 
      'staked.locked.3-4 years',
      'staked.locked.4-5 years',
      'staked.locked.5-6 years',
      'staked.locked.6-7 years',
      'staked.locked.7-8 years',
      'staked.locked.8+ years',
      'staked.community',
      'rewards',
      'rewards.unlocked',
      'rewards.unlocking',
      'rewards.unlocking.0-1 years',
      'rewards.unlocking.1-2 years',
      'rewards.unlocking.2-3 years',
      'rewards.unlocking.3-4 years',
      'rewards.unlocking.4-5 years',
      'rewards.unlocking.5-6 years',
      'rewards.unlocking.6-7 years',
      'rewards.unlocking.7-8 years',
      'rewards.unlocking.8+ years',
      'rewards.locked',
      'rewards.locked.0-1 years',
      'rewards.locked.1-2 years',
      'rewards.locked.2-3 years',
      'rewards.locked.3-4 years',
      'rewards.locked.4-5 years',
      'rewards.locked.5-6 years',
      'rewards.locked.6-7 years',
      'rewards.locked.7-8 years',
      'rewards.locked.8+ years',
      'rewards.allocation',
      'rewards.allocation.stakers',
      'rewards.allocation.nodes',
      'rewards.community',
      'burned',
      'burned.fees',
      'burned.cycles'
    ];
  }
}