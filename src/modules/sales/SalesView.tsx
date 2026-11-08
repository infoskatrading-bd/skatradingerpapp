import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const SALES_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'sales')?.children || [];

const SALES_INVOICE_FIELDS = [
  { name: 'sales_invoice_id', type: 'bigint (PK)', description: 'Identity primary key' },
  { name: 'invoice_no', type: 'varchar(30) UNIQUE', description: 'Unique customer invoice serial' },
  { name: 'invoice_date', type: 'date NOT NULL', description: 'Date of sales invoice issue' },
  { name: 'sub_account_id', type: 'bigint (FK)', description: 'FK to customer in sub_account' },
  { name: 'warehouse_id', type: 'bigint (FK)', description: 'FK to issuing Yard in warehouse' },
  { name: 'currency_id', type: 'bigint (FK)', description: 'FK to currency (BDT)' },
  { name: 'grand_total', type: 'numeric(18,2)', description: 'Final invoice sum in BDT' },
  { name: 'status', type: 'varchar(20)', description: 'Workflow state (Draft, Posted, Paid)' },
];

const SALES_QUOTATION_FIELDS = [
  { name: 'quotation_id', type: 'bigint (PK)', description: 'Identity primary key' },
  { name: 'quotation_no', type: 'varchar(30) UNIQUE', description: 'Official quotation serial' },
  { name: 'quotation_date', type: 'date NOT NULL', description: 'Date of quotation issue' },
  { name: 'valid_until', type: 'date', description: 'Offer validity horizon' },
  { name: 'sub_account_id', type: 'bigint (FK)', description: 'FK to customer in sub_account' },
  { name: 'warehouse_id', type: 'bigint (FK)', description: 'FK to dispatch Yard in warehouse' },
  { name: 'total_amount', type: 'numeric(18,2)', description: 'Quotation total value in BDT' },
  { name: 'status', type: 'varchar(20)', description: 'Workflow state (Draft, Approved, Expired)' },
];

export function SalesView() {
  const { activeSubItemId, navigate } = useNavigation();

  const isInvoice = activeSubItemId === 'sales-invoice' || activeSubItemId === 'sales-invoices';
  const isQuotation = activeSubItemId === 'sales-quotation';

  const primaryFields = isQuotation
    ? SALES_QUOTATION_FIELDS
    : isInvoice || !activeSubItemId
    ? SALES_INVOICE_FIELDS
    : [];

  const primaryActionLabel = isQuotation
    ? 'New Sales Quotation'
    : isInvoice
    ? 'Create Sales Invoice'
    : 'New Sales Document';

  return (
    <ModuleViewContainer
      moduleId="sales"
      moduleTitle="Sales Management"
      description="Manage customer accounts, sales orders, delivery challans, and separate sales invoices."
      subItems={SALES_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('sales', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
