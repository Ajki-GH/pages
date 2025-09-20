/**
 * Utility functions for formatting and data manipulation
 */

export class Utils {
  static getDisplayName(key) {
    const displayMap = {
      'total': 'Total',
      'liquid': 'Liquid', 
      'staked': 'Staked',
      'staked.unlocking': '→ Unlocking',
      'staked.locked': '→ Locked',
      'staked.community': '→ Community',
      'rewards': 'Rewards',
      'rewards.unlocked': '→ Unlocked',
      'rewards.unlocking': '→ Unlocking',
      'rewards.locked': '→ Locked',
      'rewards.allocation': '→ Allocation',
      'rewards.allocation.stakers': '→ → Stakers',
      'rewards.allocation.nodes': '→ → Nodes',
      'rewards.community': '→ Community',
      'burned': 'Burned',
      'burned.fees': '→ Fees',
      'burned.cycles': '→ Cycles'
    };
    
    // Handle year ranges with proper indentation
    if (key.includes('years')) {
      const yearRange = key.split('.').pop();
      const parts = key.split('.');
      
      // Determine indentation level based on key structure
      if (parts.length === 3) {
        // Level 2 indentation (e.g., staked.unlocking.0-1 years)
        return `→ → ${yearRange}`;
      }
      
      return yearRange;
    }
    
    return displayMap[key] || key;
  }

  static formatNumber(value) {
    if (value === 0) return '0';
    return Math.round(value).toLocaleString();
  }

  static formatPercentage(percentage) {
    if (percentage === 0) return '0.0%';
    if (percentage >= 100) return '100.0%';
    return percentage.toFixed(1) + '%';
  }

  static calculatePercentageOfTotal(value, totalSupply) {
    if (totalSupply <= 0 || value <= 0) return 0;
    return (value / totalSupply) * 100;
  }

  static createExpandIcon(isExpanded = false) {
    const iconContainer = document.createElement('span');
    iconContainer.className = `expand-icon ${isExpanded ? 'expanded' : ''}`;
    
    iconContainer.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" 
           stroke-linecap="round" stroke-linejoin="round" 
           style="color: rgb(67, 188, 67);">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    `;
    
    return iconContainer;
  }

  static shouldShowRow(key, expandedRows) {
    const parts = key.split('.');
    if (parts.length === 1) return true; // Top level rows always shown
    
    // Check if all parent levels are expanded
    for (let i = 1; i < parts.length; i++) {
      const parentKey = parts.slice(0, i).join('.');
      if (!expandedRows.has(parentKey)) return false;
    }
    
    return true;
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static formatTimestamp(isoString) {
    return new Date(isoString).toLocaleString();
  }
}