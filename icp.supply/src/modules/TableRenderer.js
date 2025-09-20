/**
 * Table rendering and UI management
 */

import { Utils } from './Utils.js';

export class TableRenderer {
  constructor(dataService, containerId = 'metricsTableBody') {
    this.dataService = dataService;
    this.container = document.getElementById(containerId);
    this.expandedRows = new Set(['staked', 'rewards', 'burned']);
    
    if (!this.container) {
      throw new Error(`Table container with ID "${containerId}" not found`);
    }
  }

  createTableRow(key, metric) {
    const tr = document.createElement('tr');
    tr.className = `table-row-hover ${metric.type}`;
    tr.dataset.key = key;

    // Label column
    const tdLabel = document.createElement('td');
    tdLabel.className = 'table-cell';
    
    const labelWrapper = document.createElement('div');
    labelWrapper.className = metric.expandable ? 'expandable' : '';
    
    // No additional padding - arrows in display names handle visual indentation

    const nameSpan = document.createElement('span');
    nameSpan.textContent = Utils.getDisplayName(key);
    labelWrapper.appendChild(nameSpan);

    // Add expand/collapse functionality
    if (metric.expandable) {
      const isExpanded = this.expandedRows.has(key);
      const expandIcon = Utils.createExpandIcon(isExpanded);
      
      labelWrapper.appendChild(expandIcon);
      labelWrapper.addEventListener('click', () => {
        this.toggleExpand(key);
      });
      
      labelWrapper.style.cursor = 'pointer';
      labelWrapper.style.userSelect = 'none';
    }

    tdLabel.appendChild(labelWrapper);

    // Value column
    const tdValue = document.createElement('td');
    tdValue.className = 'table-cell text-right metric-value';
    tdValue.textContent = Utils.formatNumber(metric.value);

    // Percentage column
    const tdPercentage = document.createElement('td');
    tdPercentage.className = 'table-cell text-right metric-value';
    
    if (key === 'total') {
      tdPercentage.textContent = '100.0%';
    } else {
      const percentage = Utils.calculatePercentageOfTotal(metric.value, this.dataService.getTotalSupply());
      tdPercentage.textContent = Utils.formatPercentage(percentage);
    }

    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    tr.appendChild(tdPercentage);

    return tr;
  }

  toggleExpand(key) {
    if (this.expandedRows.has(key)) {
      this.expandedRows.delete(key);
    } else {
      this.expandedRows.add(key);
    }
    
    this.render();
  }

  render() {
    try {
      this.container.innerHTML = '';
      const data = this.dataService.getData();
      const orderedKeys = this.dataService.getOrderedKeys();

      orderedKeys.forEach(key => {
        const metric = data.get(key);
        if (metric && Utils.shouldShowRow(key, this.expandedRows)) {
          const row = this.createTableRow(key, metric);
          this.container.appendChild(row);
        }
      });

      this.updateTimestamp();
      
    } catch (error) {
      console.error('Error rendering table:', error);
      this.renderErrorState(error.message);
    }
  }

  renderLoadingState() {
    this.container.innerHTML = `
      <tr>
        <td colspan="3" class="table-cell text-center" style="padding: 2rem;">
          <div class="loading-state">
            <div>Loading ICP metrics...</div>
            <div class="opacity-70" style="margin-top: 0.5rem; font-size: 0.9em;">
              Fetching latest data from Internet Computer
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  renderErrorState(message) {
    this.container.innerHTML = `
      <tr>
        <td colspan="3" class="table-cell text-center" style="padding: 2rem;">
          <div class="error-state">
            <div style="color: #ef4444;">⚠️ Error loading data</div>
            <div class="opacity-70" style="margin-top: 0.5rem; font-size: 0.9em;">
              ${message}
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  updateTimestamp() {
    const timestampElement = document.getElementById('lastUpdated');
    if (timestampElement) {
      if (this.dataService.isRealDataLoaded() && this.dataService.getLastUpdated()) {
        const formattedTime = Utils.formatTimestamp(this.dataService.getLastUpdated());
        timestampElement.textContent = `Data updated: ${formattedTime}`;
      } else {
        timestampElement.textContent = 'Loading latest data...';
      }
    }
  }

  getExpandedRows() {
    return new Set(this.expandedRows);
  }

  setExpandedRows(expandedSet) {
    this.expandedRows = new Set(expandedSet);
    this.render();
  }
}