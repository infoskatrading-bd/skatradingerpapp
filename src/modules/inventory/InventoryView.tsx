import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const INVENTORY_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'inventory')?.children || [];

const STOCK_LEDGER_FIELDS = [
  { name: 'ledger_id', type: 'bigint (PK)', description: 'Stock movement transaction PK' },
  { name: 'transaction_date', type: 'timestamp NOT NULL', description: 'Date of inventory event' },
  { name: 'item_id', type: 'bigint (FK)', description: 'FK to item catalog' },
  { name: 'warehouse_id', type: 'bigint (FK)', description: 'FK to Yard (warehouse)' },
  { name: 'voucher_type', type: 'varchar(30)', description: 'Sales, Purchase, Adjustment, Transfer' },
  { name: 'qty_in', type: 'numeric(18,4)', description: 'Quantity received into Yard' },
  { name: 'qty_out', type: 'numeric(18,4)', description: 'Quantity issued out of Yard' },
  { name: 'balance_qty', type: 'numeric(18,4)', description: 'Running cumulative Yard balance' },
  { name: 'unit_cost', type: 'numeric(18,2)', description: 'Weighted average unit cost (BDT)' },
];

export function InventoryView() {
  const { activeSubItemId, navigate } = useNavigation();

  return (
    <ModuleViewContainer
      moduleId="inventory"
      moduleTitle="Inventory & Yard Management"
      description="Stock balances by yard, perpetual stock ledger, inter-yard transfers, and physical count adjustments."
      subItems={INVENTORY_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('inventory', subId)}
      primaryActionLabel="Adjust Stock"
      primaryFields={STOCK_LEDGER_FIELDS}
    />
  );
}
