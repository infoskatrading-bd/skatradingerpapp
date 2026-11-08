import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const CRM_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'crm')?.children || [];

const LEAD_FIELDS = [
  { name: 'lead_id', type: 'bigint (PK)', description: 'Lead entity primary key' },
  { name: 'company_name', type: 'varchar(150)', description: 'Prospective company name' },
  { name: 'contact_name', type: 'varchar(100)', description: 'Primary contact person' },
  { name: 'email', type: 'varchar(100)', description: 'Business correspondence email' },
  { name: 'phone', type: 'varchar(30)', description: 'Contact phone number' },
  { name: 'status', type: 'varchar(30)', description: 'Lead stage (New, Qualified, Lost)' },
  { name: 'estimated_value', type: 'numeric(18,2)', description: 'Forecasted deal value in BDT' },
];

const OPPORTUNITY_FIELDS = [
  { name: 'opportunity_id', type: 'bigint (PK)', description: 'Opportunity primary key' },
  { name: 'lead_id', type: 'bigint (FK)', description: 'FK to public.lead' },
  { name: 'stage', type: 'varchar(30)', description: 'Prospecting, Proposal, Negotiation, Won' },
  { name: 'amount', type: 'numeric(18,2)', description: 'Forecasted transaction value in BDT' },
  { name: 'close_date', type: 'date', description: 'Expected deal closing date' },
  { name: 'status', type: 'varchar(20)', description: 'Active, Closed, Cancelled' },
];

export function CrmView() {
  const { activeSubItemId, navigate } = useNavigation();

  const isOpportunity = activeSubItemId === 'crm-opportunities';
  const primaryFields = isOpportunity ? OPPORTUNITY_FIELDS : LEAD_FIELDS;
  const primaryActionLabel = isOpportunity ? 'New Opportunity' : 'New Lead';

  return (
    <ModuleViewContainer
      moduleId="crm"
      moduleTitle="CRM & Opportunities"
      description="Manage business leads, customer contacts, pipeline stages, and communication logs."
      subItems={CRM_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('crm', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
