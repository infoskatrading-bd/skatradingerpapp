import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const MASTER_DATA_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'master-data')?.children || [];

const COMPANY_FIELDS = [
  { name: 'company_id', type: 'bigint (PK)', description: 'Company unique primary identity' },
  { name: 'company_name', type: 'varchar(150)', description: 'Corporate entity legal name' },
  { name: 'registration_no', type: 'varchar(50)', description: 'Registrar incorporation serial' },
  { name: 'tax_id', type: 'varchar(50)', description: 'Corporate Tax / TIN number' },
  { name: 'currency_id', type: 'bigint (FK)', description: 'FK to public.currency (BDT)' },
  { name: 'address', type: 'varchar(255)', description: 'Headquarters registered address' },
  { name: 'phone', type: 'varchar(30)', description: 'Corporate telephone number' },
  { name: 'email', type: 'varchar(100)', description: 'Corporate email address' },
];

const BRANCH_FIELDS = [
  { name: 'branch_id', type: 'bigint (PK)', description: 'Branch identity primary key' },
  { name: 'company_id', type: 'bigint (FK)', description: 'FK to public.company' },
  { name: 'branch_code', type: 'varchar(30) UNIQUE', description: 'Unique operating branch code' },
  { name: 'branch_name', type: 'varchar(100)', description: 'Branch location name (Bhomra Port)' },
  { name: 'address', type: 'varchar(255)', description: 'Port operational address' },
  { name: 'phone', type: 'varchar(30)', description: 'Operating port contact' },
  { name: 'is_active', type: 'boolean', description: 'Operational availability status' },
];

const WAREHOUSE_FIELDS = [
  { name: 'warehouse_id', type: 'bigint (PK)', description: 'Yard / warehouse primary key' },
  { name: 'branch_id', type: 'bigint (FK)', description: 'FK to public.branch' },
  { name: 'warehouse_code', type: 'varchar(30) UNIQUE', description: 'Unique yard identification code' },
  { name: 'warehouse_name', type: 'varchar(100)', description: 'Yard title (Central Yard)' },
  { name: 'location', type: 'text', description: 'Yard geographical coordinate / memo' },
  { name: 'is_active', type: 'boolean', description: 'Active yard receiving status' },
];

const ITEM_SCHEMA_FIELDS = [
  { name: 'item_id', type: 'bigint (PK)', description: 'Primary key identity' },
  { name: 'item_code', type: 'varchar(30) UNIQUE', description: 'Unique product/item code' },
  { name: 'item_name', type: 'varchar(150)', description: 'Official name of item/SKU' },
  { name: 'category_id', type: 'bigint (FK)', description: 'FK to public.item_category' },
  { name: 'unit_id', type: 'bigint (FK)', description: 'FK to public.unit' },
  { name: 'purchase_rate', type: 'numeric(18,2)', description: 'Standard acquisition cost' },
  { name: 'sales_rate', type: 'numeric(18,2)', description: 'Standard sales pricing in BDT' },
  { name: 'inventory_account_id', type: 'bigint (FK)', description: 'FK to chart_of_account' },
  { name: 'is_stock_item', type: 'boolean', description: 'Flag whether track inventory' },
  { name: 'is_active', type: 'boolean', description: 'Entity availability state' },
];

const SUB_ACCOUNT_FIELDS = [
  { name: 'sub_account_id', type: 'bigint (PK)', description: 'Sub-account party primary key' },
  { name: 'account_id', type: 'bigint (FK)', description: 'FK to public.chart_of_account' },
  { name: 'party_type', type: 'varchar(30)', description: 'Customer or Vendor' },
  { name: 'party_name', type: 'varchar(150)', description: 'Commercial legal trade name' },
  { name: 'contact_person', type: 'varchar(100)', description: 'Designated business contact' },
  { name: 'phone', type: 'varchar(30)', description: 'Business mobile / telephone' },
  { name: 'email', type: 'varchar(100)', description: 'Business correspondence email' },
  { name: 'tax_number', type: 'varchar(50)', description: 'NBR VAT / TIN registration number' },
  { name: 'credit_limit', type: 'numeric(18,2)', description: 'Authorized credit ceiling in BDT' },
  { name: 'is_active', type: 'boolean', description: 'Active ledger trading state' },
];

export function MasterDataView() {
  const { activeSubItemId, navigate } = useNavigation();

  let primaryFields = ITEM_SCHEMA_FIELDS;
  let primaryActionLabel = 'New Item';

  if (activeSubItemId === 'md-company') {
    primaryFields = COMPANY_FIELDS;
    primaryActionLabel = 'Edit Company';
  } else if (activeSubItemId === 'md-branch') {
    primaryFields = BRANCH_FIELDS;
    primaryActionLabel = 'New Branch';
  } else if (activeSubItemId === 'md-yard') {
    primaryFields = WAREHOUSE_FIELDS;
    primaryActionLabel = 'New Yard';
  } else if (activeSubItemId === 'md-parties') {
    primaryFields = SUB_ACCOUNT_FIELDS;
    primaryActionLabel = 'New Party';
  }

  return (
    <ModuleViewContainer
      moduleId="master-data"
      moduleTitle="Master Data"
      description="Foundational entities for Ska Trading & Logistics including items, categories, and business parties."
      subItems={MASTER_DATA_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('master-data', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
