/**
 * Main application entry point
 */

import { Dashboard } from './modules/Dashboard.js';

// Initialize the dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🌟 ICP Supply Dashboard starting...');
  
  try {
    const dashboard = new Dashboard();
    await dashboard.init();
    
    // Make dashboard globally available for debugging
    window.icpDashboard = dashboard;
    
  } catch (error) {
    console.error('💥 Failed to start dashboard:', error);
  }
});

// Handle page lifecycle
window.addEventListener('beforeunload', () => {
  console.log('📄 Page unloading...');
});

// Performance monitoring
if (window.performance && performance.mark) {
  performance.mark('app-start');
  
  window.addEventListener('load', () => {
    performance.mark('app-loaded');
    performance.measure('app-load-time', 'app-start', 'app-loaded');
    
    const measure = performance.getEntriesByName('app-load-time')[0];
    console.log(`⚡ App loaded in ${measure.duration.toFixed(2)}ms`);
  });
}