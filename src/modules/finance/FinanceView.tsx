import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const FINANCE_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'finance')?.children || [];

const COA_FIELDS = [
  { name: 'account_id', type: 'bigint (PK)', description: 'GL account unique identity' },
  { name: 'account_group_id', type: 'bigint (FK)', description: 'FK to public.account_group' },
  { name: 'account_code', type: 'varchar(30) UNIQUE', description: 'Unique ledger code (e.g. 1010)' },
  { name: 'account_name', type: 'varchar(150)', description: 'Account title in English' },
  { name: 'parent_account_id', type: 'bigint (FK)', description: 'Self-referencing tree parent' },
  { name: 'is_control_account', type: 'boolean', description: 'True prevents direct journal entries' },
  { name: 'allow_posting', type: 'boolean', description: 'Authorizes transactional posting' },
  { name: 'is_active', type: 'boolean', description: 'Active ledger availability' },
];

const GENERAL_LEDGER_FIELDS = [
  { name: 'ledger_id', type: 'bigint (PK)', description: 'Double-entry transaction primary key' },
  { name: 'transaction_date', type: 'timestamp NOT NULL', description: 'Posting timestamp' },
  { name: 'account_id', type: 'bigint (FK)', description: 'FK to chart_of_account' },
  { name: 'sub_account_id', type: 'bigint (FK)', description: 'FK to sub_account (Customer/Vendor)' },
  { name: 'voucher_id', type: 'bigint NOT NULL', description: 'Originating voucher reference identity' },
  { name: 'voucher_type', type: 'varchar(30)', description: 'Journal, Sales, Purchase, Receipt' },
  { name: 'debit', type: 'numeric(18,2)', description: 'Debit entry in BDT' },
  { name: 'credit', type: 'numeric(18,2)', description: 'Credit entry in BDT' },
  { name: 'running_balance', type: 'numeric(18,2)', description: 'Authoritative cumulative balance in BDT' },
];

const JOURNAL_FIELDS = [
  { name: 'journal_id', type: 'bigint (PK)', description: 'Journal voucher primary key' },
  { name: 'voucher_no', type: 'varchar(30) UNIQUE', description: 'Unique voucher numbering code' },
  { name: 'voucher_date', type: 'date NOT NULL', description: 'Date of accounting transaction' },
  { name: 'narration', type: 'text', description: 'Business transaction memo / description' },
  { name: 'total_debit', type: 'numeric(18,2)', description: 'Sum of debit entries in BDT' },
  { name: 'total_credit', type: 'numeric(18,2)', description: 'Sum of credit entries in BDT' },
  { name: 'status', type: 'varchar(20)', description: 'Draft, Posted, Reversed' },
];

export function FinanceView() {
  const { activeSubItemId, navigate } = useNavigation();

  const isStatement = activeSubItemId === 'account-statements';
  const isJournal = activeSubItemId === 'journal-vouchers' || activeSubItemId === 'fin-journals';

  const primaryFields = isStatement
    ? GENERAL_LEDGER_FIELDS
    : isJournal
    ? JOURNAL_FIELDS
    : COA_FIELDS;

  const primaryActionLabel = isJournal
    ? 'New Journal Voucher'
    : isStatement
    ? 'Query Ledger'
    : 'Create Account';

  return (
    <ModuleViewContainer
      moduleId="finance"
      moduleTitle="Finance & General Ledger"
      description="Hierarchical chart of accounts, double-entry journal vouchers, and financial accounting rules."
      subItems={FINANCE_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('finance', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
