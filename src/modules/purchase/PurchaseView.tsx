import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const PURCHASE_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'purchase')?.children || [];

const PURCHASE_INVOICE_FIELDS = [
  { name: 'purchase_invoice_id', type: 'bigint (PK)', description: 'Identity primary key' },
  { name: 'invoice_no', type: 'varchar(30) UNIQUE', description: 'Internal purchase invoice number' },
  { name: 'supplier_invoice_no', type: 'varchar(50)', description: 'Vendor official bill/invoice ref' },
  { name: 'invoice_date', type: 'date NOT NULL', description: 'Transaction invoice date' },
  { name: 'sub_account_id', type: 'bigint (FK)', description: 'FK to vendor in sub_account' },
  { name: 'warehouse_id', type: 'bigint (FK)', description: 'FK to receiving Yard in warehouse' },
  { name: 'currency_id', type: 'bigint (FK)', description: 'FK to currency (BDT)' },
  { name: 'grand_total', type: 'numeric(18,2)', description: 'Gross payable amount in BDT' },
  { name: 'status', type: 'varchar(20)', description: 'Workflow state (Draft, Posted, Paid)' },
];

const PURCHASE_ORDER_FIELDS = [
  { name: 'purchase_order_id', type: 'bigint (PK)', description: 'Order identity primary key' },
  { name: 'order_no', type: 'varchar(30) UNIQUE', description: 'Unique procurement order number' },
  { name: 'order_date', type: 'date NOT NULL', description: 'PO issuance date' },
  { name: 'expected_date', type: 'date', description: 'Expected yard delivery date' },
  { name: 'sub_account_id', type: 'bigint (FK)', description: 'FK to supplier in sub_account' },
  { name: 'warehouse_id', type: 'bigint (FK)', description: 'FK to receiving Yard in warehouse' },
  { name: 'total_amount', type: 'numeric(18,2)', description: 'Committed procurement total in BDT' },
  { name: 'status', type: 'varchar(20)', description: 'Draft, Approved, Received, Cancelled' },
];

export function PurchaseView() {
  const { activeSubItemId, navigate } = useNavigation();

  const isOrder = activeSubItemId === 'purchase-orders';
  const isInvoice = activeSubItemId === 'purchase-invoices' || !activeSubItemId;

  const primaryFields = isOrder
    ? PURCHASE_ORDER_FIELDS
    : isInvoice
    ? PURCHASE_INVOICE_FIELDS
    : PURCHASE_INVOICE_FIELDS;

  const primaryActionLabel = isOrder
    ? 'New Purchase Order'
    : 'Create Purchase Invoice';

  return (
    <ModuleViewContainer
      moduleId="purchase"
      moduleTitle="Purchase Management"
      description="Supplier accounts, purchase orders, goods receipts, and distinct vendor purchase invoices."
      subItems={PURCHASE_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('purchase', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
