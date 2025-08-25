<!--
ICP Supply Metrics Table Layout & Data Sources (Parent/Child hierarchy)

DISPLAY BEHAVIOR
- Main rows (Total, Liquid, Staked, Maturity, Burned) are EXPANDED by default.
- Sub-rows (e.g., Unlocking, Locked, Unlocked, Community, Fees, Cycles) are COLLAPSED by default unless expanded by the user.
- Expand/collapse is indicated with a suffix chevron icon. No prefix arrows are shown on EXPANDABLE rows.
- Non-expandable sub/age rows are visually indented via padding; they include a small text prefix (↳ for sub, ↳↳ for age) for readability.

DATA MAP
Parent: Total
  - Endpoint: https://ledger-api.internetcomputer.org/supply/total/latest

Parent: Liquid
  - Endpoint: https://ledger-api.internetcomputer.org/supply/circulating/latest
  - Calculation: Total - Staked

Parent: Staked {expandable}
  - Endpoint: https://ic-api.internetcomputer.org/api/v3/daily-stats?format=json
  - Value: governance_total_locked_e8s
  - Child: Unlocking {expandable}
    - Endpoint: https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_dissolving_neurons_e8s
    - Calculation: sum of all buckets (0–96 months) / 100,000,000
    - Child: 0-1 years (sum ge=0,lt=6 and ge=6,lt=12)
    - Child: 1-2 years (sum ge=12,lt=18 and ge=18,lt=24)
    - Child: 2-3 years (sum ge=24,lt=30 and ge=30,lt=36)
    - Child: 3-4 years (sum ge=36,lt=42 and ge=42,lt=48)
    - Child: 4-5 years (sum ge=48,lt=54 and ge=54,lt=60)
    - Child: 5-6 years (sum ge=60,lt=66 and ge=66,lt=72)
    - Child: 6-7 years (sum ge=72,lt=78 and ge=78,lt=84)
    - Child: 7-8 years (sum ge=84,lt=90 and ge=90,lt=96)
    - Child: 8+ years (sum ge>=96)
  - Child: Locked {expandable}
    - Endpoint: https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_not_dissolving_neurons_e8s
    - Calculation: sum of all buckets (0–102 months) / 100,000,000
    - Child: 0-1 years (sum ge=0,lt=6 and ge=6,lt=12)
    - Child: 1-2 years (sum ge=12,lt=18 and ge=18,lt=24)
    - Child: 2-3 years (sum ge=24,lt=30 and ge=30,lt=36)
    - Child: 3-4 years (sum ge=36,lt=42 and ge=42,lt=48)
    - Child: 4-5 years (sum ge=48,lt=54 and ge=54,lt=60)
    - Child: 5-6 years (sum ge=60,lt=66 and ge=66,lt=72)
    - Child: 6-7 years (sum ge=72,lt=78 and ge=78,lt=84)
    - Child: 7-8 years (sum ge=84,lt=90 and ge=90,lt=96)
    - Child: 8+ years (sum ge>=96)
  - Child: Community (non-expandable)
    - Endpoint: https://ic-api.internetcomputer.org/api/v3/metrics/community-fund-total-staked?format=json&step=7200

Parent: Maturity {expandable}
  - Endpoint: https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_total_maturity_e8s_equivalent
  - Calculation: (governance_total_maturity_e8s_equivalent + governance_total_staked_maturity_e8s_equivalent) / 100,000,000
  - Child: Unlocked (non-expandable)
    - Calculation: total_maturity - total_staked_maturity
  - Child: Unlocking {expandable}
    - Endpoint: https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_dissolving_neurons_staked_maturity_e8s_equivalent
    - Calculation: sum of all buckets (0–96 months) / 100,000,000
    - Child: 0-1 years … 8+ years (same month bucket logic as Staked → Unlocking)
  - Child: Locked {expandable}
    - Endpoint: https://ic-api.internetcomputer.org/api/v3/governance-metrics/governance_not_dissolving_neurons_staked_maturity_e8s_equivalent
    - Calculation: sum of all buckets (0–102 months) / 100,000,000
    - Child: 0-1 years … 8+ years (same month bucket logic as Staked → Locked)
  - Child: Community (non-expandable)
    - Endpoint: https://ic-api.internetcomputer.org/api/v3/metrics/community-fund-total-maturity?format=json&step=7200

Parent: Burned {expandable}
  - Source: https://ic-api.internetcomputer.org/api/v3/daily-stats?format=json
  - Calculation: icp_burned_fees + total_cycle_burn_till_date
  - Child: Fees (non-expandable) → Value: icp_burned_fees
  - Child: Cycles (non-expandable) → Value: total_cycle_burn_till_date
-->
