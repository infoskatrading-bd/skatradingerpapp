import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const CASH_BANK_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'cash-bank')?.children || [];

const BANK_FIELDS = [
  { name: 'bank_account_id', type: 'bigint (PK)', description: 'Bank account record ID' },
  { name: 'bank_name', type: 'varchar(100)', description: 'Financial institution name' },
  { name: 'account_no', type: 'varchar(50)', description: 'Bank account number' },
  { name: 'branch_name', type: 'varchar(100)', description: 'Bank branch location' },
  { name: 'chart_of_account_id', type: 'bigint (FK)', description: 'Linked COA asset account' },
  { name: 'current_balance', type: 'numeric(18,2)', description: 'Ledger cash balance in BDT' },
  { name: 'is_active', type: 'boolean', description: 'Account status flag' },
];

const CASH_TRANSACTION_FIELDS = [
  { name: 'transaction_id', type: 'bigint (PK)', description: 'Transaction record identity' },
  { name: 'transaction_date', type: 'date NOT NULL', description: 'Transaction execution date' },
  { name: 'transaction_type', type: 'varchar(30)', description: 'Receipt, Payment, Contra' },
  { name: 'chart_of_account_id', type: 'bigint (FK)', description: 'FK to cash/bank account' },
  { name: 'sub_account_id', type: 'bigint (FK)', description: 'FK to customer or supplier' },
  { name: 'amount', type: 'numeric(18,2)', description: 'Receipt amount in BDT' },
  { name: 'reference_no', type: 'varchar(50)', description: 'Money Receipt / Ref No' },
  { name: 'status', type: 'varchar(20)', description: 'Draft, Posted, Reconciled' },
];

export function CashBankView() {
  const { activeSubItemId, navigate } = useNavigation();

  const isReceipt = activeSubItemId === 'money-receipts';
  const primaryFields = isReceipt ? CASH_TRANSACTION_FIELDS : BANK_FIELDS;
  const primaryActionLabel = isReceipt ? 'New Money Receipt' : 'New Bank Account';

  return (
    <ModuleViewContainer
      moduleId="cash-bank"
      moduleTitle="Cash & Bank Management"
      description="Bank accounts, cash accounts, payment/receipt vouchers, and bank reconciliation statements."
      subItems={CASH_BANK_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('cash-bank', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
