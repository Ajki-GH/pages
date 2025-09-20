/**
 * Main Dashboard class - orchestrates the entire application
 */

import { DataService } from './DataService.js';
import { TableRenderer } from './TableRenderer.js';
import { Utils } from './Utils.js';

export class Dashboard {
  constructor() {
    this.dataService = new DataService();
    this.tableRenderer = null;
    this.initialized = false;
    this.errorRetryCount = 0;
    this.maxRetries = 3;
  }

  async init() {
    if (this.initialized) {
      console.warn('Dashboard already initialized');
      return;
    }

    try {
      console.log('🚀 Initializing ICP Supply Dashboard...');
      
      // Initialize table renderer
      this.tableRenderer = new TableRenderer(this.dataService);
      
      // Show loading state immediately
      this.tableRenderer.renderLoadingState();
      
      // Load data
      await this.loadData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      this.initialized = true;
      console.log('✅ Dashboard initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize dashboard:', error);
      this.handleInitializationError(error);
    }
  }

  async loadData() {
    try {
      await this.dataService.loadData();
      this.tableRenderer.render();
      this.errorRetryCount = 0; // Reset retry count on success
      
    } catch (error) {
      console.error('Error loading data:', error);
      
      if (this.errorRetryCount < this.maxRetries) {
        this.errorRetryCount++;
        console.log(`Retrying data load (${this.errorRetryCount}/${this.maxRetries})...`);
        
        // Wait before retry with exponential backoff
        const delay = Math.pow(2, this.errorRetryCount) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.loadData();
      } else {
        throw new Error(`Failed to load data after ${this.maxRetries} attempts: ${error.message}`);
      }
    }
  }

  setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + R to refresh data
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault();
        this.refreshData();
      }
      
      // Escape to collapse all expanded rows
      if (event.key === 'Escape') {
        this.collapseAll();
      }
      
      // Space to expand all main rows
      if (event.key === ' ' && event.target === document.body) {
        event.preventDefault();
        this.expandMainRows();
      }
    });

    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.shouldRefreshData()) {
        console.log('Tab became visible, checking for data refresh...');
        this.refreshData();
      }
    });

    // Error boundary for unhandled errors
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    window.addEventListener('error', (event) => {
      console.error('Unhandled error:', event.error);
    });
  }

  async refreshData() {
    if (!this.initialized) return;
    
    try {
      console.log('🔄 Refreshing data...');
      this.tableRenderer.renderLoadingState();
      
      // Force reload by clearing cache and reloading
      await this.loadData();
      
      console.log('✅ Data refreshed successfully');
      
    } catch (error) {
      console.error('❌ Failed to refresh data:', error);
      this.tableRenderer.renderErrorState(error.message);
    }
  }

  shouldRefreshData() {
    const lastUpdated = this.dataService.getLastUpdated();
    if (!lastUpdated) return true;
    
    // Refresh if data is older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(lastUpdated) < oneHourAgo;
  }

  collapseAll() {
    if (!this.tableRenderer) return;
    
    this.tableRenderer.setExpandedRows(new Set());
    console.log('Collapsed all expandable rows');
  }

  expandMainRows() {
    if (!this.tableRenderer) return;
    
    const mainRows = new Set(['staked', 'rewards', 'burned']);
    this.tableRenderer.setExpandedRows(mainRows);
    console.log('Expanded main rows');
  }

  handleInitializationError(error) {
    const container = document.getElementById('metricsTableBody');
    if (container) {
      container.innerHTML = `
        <tr>
          <td colspan="3" class="table-cell text-center" style="padding: 2rem;">
            <div class="error-state">
              <div style="color: #ef4444; font-size: 1.2em; margin-bottom: 1rem;">
                ⚠️ Dashboard Initialization Failed
              </div>
              <div class="opacity-70" style="margin-bottom: 1rem;">
                ${error.message}
              </div>
              <button onclick="location.reload()" 
                      style="background: rgba(67, 188, 67, 0.1); border: 1px solid rgb(67, 188, 67); 
                             color: rgb(67, 188, 67); padding: 0.5rem 1rem; border-radius: 4px;
                             cursor: pointer; font-family: inherit;">
                Reload Page
              </button>
            </div>
          </td>
        </tr>
      `;
    }
  }

  // Public API methods
  getDataService() {
    return this.dataService;
  }

  getTableRenderer() {
    return this.tableRenderer;
  }

  isInitialized() {
    return this.initialized;
  }
}