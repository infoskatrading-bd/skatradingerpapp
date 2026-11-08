import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './modules/dashboard/DashboardView';
import { MasterDataView } from './modules/master-data/MasterDataView';
import { SalesView } from './modules/sales/SalesView';
import { PurchaseView } from './modules/purchase/PurchaseView';
import { InventoryView } from './modules/inventory/InventoryView';
import { FinanceView } from './modules/finance/FinanceView';
import { CashBankView } from './modules/cash-bank/CashBankView';
import { CrmView } from './modules/crm/CrmView';
import { AdministrationView } from './modules/administration/AdministrationView';
import { ReportsView } from './modules/reports/ReportsView';

/**
 * Route metadata configuration for ERP modules
 */
export interface ERPRouteConfig {
  path: string;
  moduleId: string;
  label: string;
  component: React.ComponentType;
  tableReference?: string;
  hasSubRoutes?: boolean;
}

export const ERP_MODULE_ROUTES: ERPRouteConfig[] = [
  {
    path: '/dashboard',
    moduleId: 'dashboard',
    label: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/master-data',
    moduleId: 'master-data',
    label: 'Master Data',
    component: MasterDataView,
    hasSubRoutes: true,
  },
  {
    path: '/sales',
    moduleId: 'sales',
    label: 'Sales Management',
    component: SalesView,
    tableReference: 'public.sales_invoice',
    hasSubRoutes: true,
  },
  {
    path: '/purchase',
    moduleId: 'purchase',
    label: 'Purchase Management',
    component: PurchaseView,
    tableReference: 'public.purchase_invoice',
    hasSubRoutes: true,
  },
  {
    path: '/inventory',
    moduleId: 'inventory',
    label: 'Inventory & Yard',
    component: InventoryView,
    tableReference: 'public.stock_ledger',
    hasSubRoutes: true,
  },
  {
    path: '/finance',
    moduleId: 'finance',
    label: 'Finance & Accounts',
    component: FinanceView,
    tableReference: 'public.chart_of_account',
    hasSubRoutes: true,
  },
  {
    path: '/cash-bank',
    moduleId: 'cash-bank',
    label: 'Cash & Bank',
    component: CashBankView,
    tableReference: 'public.bank_account',
    hasSubRoutes: true,
  },
  {
    path: '/crm',
    moduleId: 'crm',
    label: 'CRM & Pipeline',
    component: CrmView,
    tableReference: 'public.crm_lead',
    hasSubRoutes: true,
  },
  {
    path: '/administration',
    moduleId: 'administration',
    label: 'Administration & Security',
    component: AdministrationView,
    tableReference: 'public.app_user',
    hasSubRoutes: true,
  },
  {
    path: '/reports',
    moduleId: 'reports',
    label: 'Financial & Operational Reports',
    component: ReportsView,
    hasSubRoutes: true,
  },
];

/**
 * ShellLayout wraps all routed module views inside the responsive Shell.
 * It connects route changes to the Shell navigation state and displays the enterprise header.
 */
export function ShellLayout() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

/**
 * AppRoutes defines the complete React Router routing hierarchy for SKA NEXUS ERP.
 * Modules mapped:
 * - Dashboard (/dashboard, /)
 * - Master Data (/master-data, /master-data/:subId)
 * - Sales (/sales, /sales/:subId - Separate Sales Invoices)
 * - Purchase (/purchase, /purchase/:subId - Separate Purchase Invoices)
 * - Inventory (/inventory, /inventory/:subId)
 * - Finance (/finance, /finance/:subId)
 * - Cash & Bank (/cash-bank, /cash-bank/:subId)
 * - CRM (/crm, /crm/:subId)
 * - Administration (/admin, /administration, /admin/:subId, /administration/:subId)
 * - Reports (/reports, /reports/:subId)
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ShellLayout />}>
        {/* Default redirect to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 1. Dashboard Module */}
        <Route path="/dashboard" element={<DashboardView />} />

        {/* 2. Master Data Module */}
        <Route path="/master-data" element={<MasterDataView />} />
        <Route path="/master-data/:subId" element={<MasterDataView />} />

        {/* 3. Sales Module (Separate Sales Invoices) */}
        <Route path="/sales" element={<SalesView />} />
        <Route path="/sales/:subId" element={<SalesView />} />

        {/* 4. Purchase Module (Separate Purchase Invoices) */}
        <Route path="/purchase" element={<PurchaseView />} />
        <Route path="/purchase/:subId" element={<PurchaseView />} />

        {/* 5. Inventory & Yard Module */}
        <Route path="/inventory" element={<InventoryView />} />
        <Route path="/inventory/:subId" element={<InventoryView />} />

        {/* 6. Finance & Accounts Module */}
        <Route path="/finance" element={<FinanceView />} />
        <Route path="/finance/:subId" element={<FinanceView />} />

        {/* 7. Cash & Bank Module */}
        <Route path="/cash-bank" element={<CashBankView />} />
        <Route path="/cash-bank/:subId" element={<CashBankView />} />

        {/* 8. CRM Module */}
        <Route path="/crm" element={<CrmView />} />
        <Route path="/crm/:subId" element={<CrmView />} />

        {/* 9. Administration & Security Module */}
        <Route path="/admin" element={<Navigate to="/administration" replace />} />
        <Route path="/admin/:subId" element={<AdministrationView />} />
        <Route path="/administration" element={<AdministrationView />} />
        <Route path="/administration/:subId" element={<AdministrationView />} />

        {/* 10. Reports Module */}
        <Route path="/reports" element={<ReportsView />} />
        <Route path="/reports/:subId" element={<ReportsView />} />

        {/* Catch-all route -> redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
