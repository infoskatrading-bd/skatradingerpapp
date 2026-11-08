import React from 'react';
import { ModuleViewContainer } from '../../components/common/ModuleViewContainer';
import { ERP_NAVIGATION_ITEMS } from '../../components/layout/MainLayout';
import { useNavigation } from '../../context/NavigationContext';

const ADMIN_NAV = ERP_NAVIGATION_ITEMS.find((item) => item.id === 'administration')?.children || [];

const APP_USER_FIELDS = [
  { name: 'user_id', type: 'bigint (PK)', description: 'Identity user primary key' },
  { name: 'username', type: 'varchar(50) UNIQUE', description: 'System login username' },
  { name: 'full_name', type: 'varchar(150)', description: 'User official legal name' },
  { name: 'email', type: 'varchar(100) UNIQUE', description: 'Corporate email address' },
  { name: 'phone', type: 'varchar(30)', description: 'Contact phone number' },
  { name: 'role_id', type: 'bigint (FK)', description: 'FK to public.role' },
  { name: 'branch_id', type: 'bigint (FK)', description: 'FK to operating branch' },
  { name: 'is_active', type: 'boolean', description: 'User login authorization state' },
  { name: 'last_login_at', type: 'timestamp', description: 'Last authentication timestamp' },
];

const ROLE_FIELDS = [
  { name: 'role_id', type: 'bigint (PK)', description: 'Role identity primary key' },
  { name: 'role_name', type: 'varchar(50) UNIQUE', description: 'RBAC authorization title' },
  { name: 'description', type: 'varchar(255)', description: 'Scope and authority description' },
  { name: 'is_active', type: 'boolean', description: 'Active role assignment state' },
];

const AUDIT_FIELDS = [
  { name: 'audit_id', type: 'bigint (PK)', description: 'Audit trail record sequence' },
  { name: 'user_id', type: 'bigint (FK)', description: 'FK to public.app_user' },
  { name: 'action', type: 'varchar(50)', description: 'CREATE, UPDATE, DELETE, POST' },
  { name: 'table_name', type: 'varchar(50)', description: 'Target PostgreSQL entity table' },
  { name: 'record_id', type: 'bigint', description: 'Target row identifier' },
  { name: 'timestamp', type: 'timestamp NOT NULL', description: 'Immutable transaction timestamp' },
  { name: 'details', type: 'text', description: 'Audit payload delta (JSON / text)' },
];

export function AdministrationView() {
  const { activeSubItemId, navigate } = useNavigation();

  let primaryFields = APP_USER_FIELDS;
  let primaryActionLabel = 'Create User';

  if (activeSubItemId === 'adm-roles') {
    primaryFields = ROLE_FIELDS;
    primaryActionLabel = 'New Role';
  } else if (activeSubItemId === 'adm-audit') {
    primaryFields = AUDIT_FIELDS;
    primaryActionLabel = 'Filter Audit Log';
  }

  return (
    <ModuleViewContainer
      moduleId="administration"
      moduleTitle="Administration & Security"
      description="Enterprise user management (app_user), RBAC role assignments, and immutable system audit trails."
      subItems={ADMIN_NAV}
      activeSubItemId={activeSubItemId}
      onSelectSubItem={(subId) => navigate('administration', subId)}
      primaryActionLabel={primaryActionLabel}
      primaryFields={primaryFields}
    />
  );
}
