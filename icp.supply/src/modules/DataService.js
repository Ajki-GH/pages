/**
 * Service for loading and managing ICP metrics data
 */

export class DataService {
  constructor() {
    this.data = null;
    this.totalSupply = 0;
    this.lastUpdated = null;
    this.cache = new Map();
    
    // Initialize with empty structure so table renders immediately
    this.initializeEmptyData();
  }

  initializeEmptyData() {
    const emptyData = {
      "total": { "value": 0, "type": "row-level-0" },
      "liquid": { "value": 0, "type": "row-level-0" },
      "staked": { "value": 0, "type": "row-level-0", "expandable": true },
      "staked.unlocking": { "value": 0, "type": "row-level-1", "parent": "staked", "expandable": true },
      "staked.unlocking.0-1 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.1-2 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.2-3 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.3-4 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.4-5 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.5-6 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.6-7 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.7-8 years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.8+ years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.locked": { "value": 0, "type": "row-level-1", "parent": "staked", "expandable": true },
      "staked.locked.0-1 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.1-2 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.2-3 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.3-4 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.4-5 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.5-6 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.6-7 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.7-8 years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.8+ years": { "value": 0, "type": "row-level-2", "parent": "staked.locked" },
      "staked.community": { "value": 0, "type": "row-level-1", "parent": "staked" },
      "rewards": { "value": 0, "type": "row-level-0", "expandable": true },
      "rewards.unlocked": { "value": 0, "type": "row-level-1", "parent": "rewards" },
      "rewards.unlocking": { "value": 0, "type": "row-level-1", "parent": "rewards", "expandable": true },
      "rewards.unlocking.0-1 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.1-2 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.2-3 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.3-4 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.4-5 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.5-6 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.6-7 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.7-8 years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.8+ years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.locked": { "value": 0, "type": "row-level-1", "parent": "rewards", "expandable": true },
      "rewards.locked.0-1 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.1-2 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.2-3 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.3-4 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.4-5 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.5-6 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.6-7 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.7-8 years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.8+ years": { "value": 0, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.allocation": { "value": 0, "type": "row-level-1", "parent": "rewards", "expandable": true },
      "rewards.allocation.stakers": { "value": 0, "type": "row-level-2", "parent": "rewards.allocation" },
      "rewards.allocation.nodes": { "value": 0, "type": "row-level-2", "parent": "rewards.allocation" },
      "rewards.community": { "value": 0, "type": "row-level-1", "parent": "rewards" },
      "burned": { "value": 0, "type": "row-level-0", "expandable": true },
      "burned.fees": { "value": 0, "type": "row-level-1", "parent": "burned" },
      "burned.cycles": { "value": 0, "type": "row-level-1", "parent": "burned" }
    };

    this.data = new Map(Object.entries(emptyData));
    this.totalSupply = 0;
    this.lastUpdated = null;
  }

  async loadData() {
    try {
      console.log('Loading ICP metrics data...');
      console.log('Attempting to fetch from: ./metrics.json');
      
      const response = await fetch('./metrics.json');
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      
      const jsonData = await response.json();
      
      // Validate data structure
      if (!jsonData.data || !jsonData.totalSupply) {
        throw new Error('Invalid data format received');
      }
      
      // Update existing data structure with real values
      Object.entries(jsonData.data).forEach(([key, value]) => {
        if (this.data.has(key)) {
          const existing = this.data.get(key);
          this.data.set(key, { ...existing, value: value.value });
        }
      });
      
      this.totalSupply = jsonData.totalSupply;
      this.lastUpdated = jsonData.lastUpdated;
      
      console.log('✅ Real data loaded successfully');
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
      
      // Fallback to hardcoded sample data for immediate functionality
      console.warn('⚠️ Using hardcoded sample data as fallback');
      return this.loadFallbackData();
    }
  }

  loadFallbackData() {
    const fallbackData = {
      "total": { "value": 537308290, "type": "row-level-0" },
      "liquid": { "value": 244946282, "type": "row-level-0" },
      "staked": { "value": 231787257, "type": "row-level-0", "expandable": true },
      "staked.unlocking": { "value": 26306375, "type": "row-level-1", "parent": "staked", "expandable": true },
      "staked.unlocking.0-1 years": { "value": 8342418, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.1-2 years": { "value": 4568920, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.2-3 years": { "value": 3519527, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.3-4 years": { "value": 2756124, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.4-5 years": { "value": 1361762, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.5-6 years": { "value": 1426306, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.6-7 years": { "value": 2063730, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.7-8 years": { "value": 1267588, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.unlocking.8+ years": { "value": 0, "type": "row-level-2", "parent": "staked.unlocking" },
      "staked.locked": { "value": 205480954, "type": "row-level-1", "parent": "staked", "expandable": true },
      "staked.locked.0-1 years": { "value": 16957881, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.1-2 years": { "value": 12614259, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.2-3 years": { "value": 8569082, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.3-4 years": { "value": 5930229, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.4-5 years": { "value": 2368087, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.5-6 years": { "value": 370418, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.6-7 years": { "value": 3359045, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.7-8 years": { "value": 7733678, "type": "row-level-2", "parent": "staked.locked" },
      "staked.locked.8+ years": { "value": 147578276, "type": "row-level-2", "parent": "staked.locked" },
      "staked.community": { "value": 0, "type": "row-level-1", "parent": "staked" },
      "rewards": { "value": 103170915, "type": "row-level-0", "expandable": true },
      "rewards.unlocked": { "value": 91111709, "type": "row-level-1", "parent": "rewards" },
      "rewards.unlocking": { "value": 1048231, "type": "row-level-1", "parent": "rewards", "expandable": true },
      "rewards.unlocking.0-1 years": { "value": 192664, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.1-2 years": { "value": 109652, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.2-3 years": { "value": 125465, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.3-4 years": { "value": 55015, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.4-5 years": { "value": 146387, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.5-6 years": { "value": 234901, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.6-7 years": { "value": 104007, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.7-8 years": { "value": 80141, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.unlocking.8+ years": { "value": 0, "type": "row-level-2", "parent": "rewards.unlocking" },
      "rewards.locked": { "value": 11010974, "type": "row-level-1", "parent": "rewards", "expandable": true },
      "rewards.locked.0-1 years": { "value": 703332, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.1-2 years": { "value": 100820, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.2-3 years": { "value": 103592, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.3-4 years": { "value": 122795, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.4-5 years": { "value": 161333, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.5-6 years": { "value": 80364, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.6-7 years": { "value": 108477, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.7-8 years": { "value": 156405, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.locked.8+ years": { "value": 9473856, "type": "row-level-2", "parent": "rewards.locked" },
      "rewards.allocation": { "value": 0, "type": "row-level-1", "parent": "rewards", "expandable": true },
      "rewards.allocation.stakers": { "value": 0, "type": "row-level-2", "parent": "rewards.allocation" },
      "rewards.allocation.nodes": { "value": 0, "type": "row-level-2", "parent": "rewards.allocation" },
      "rewards.community": { "value": 0, "type": "row-level-1", "parent": "rewards" },
      "burned": { "value": 2117660, "type": "row-level-0", "expandable": true },
      "burned.fees": { "value": 2611, "type": "row-level-1", "parent": "burned" },
      "burned.cycles": { "value": 2115049, "type": "row-level-1", "parent": "burned" }
    };

    this.data = new Map(Object.entries(fallbackData));
    this.totalSupply = 537308290;
    this.lastUpdated = "2024-09-20T12:00:00.000Z";
    
    console.log('✅ Fallback data loaded successfully');
    return this.data;
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

  isRealDataLoaded() {
    // Check if we have real data (not just zeros)
    return this.totalSupply > 0;
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