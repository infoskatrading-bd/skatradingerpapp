import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Database,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Landmark,
  Wallet,
  Users,
  ShieldCheck,
  FileBarChart,
  Menu,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Bell,
  UserCheck,
  LogOut,
  Settings,
  Search,
  CheckCircle2,
  Server,
  X
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { CommandPalette } from '../common/CommandPalette';

export interface NavSubItem {
  id: string;
  label: string;
  tableReference?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavSubItem[];
}

/**
 * Authoritative Navigation Registry matching SKA NEXUS ERP modules:
 * High-density operational mapping to PostgreSQL schema (ska_nexus_erp)
 */
export const ERP_NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: Database,
    children: [
      { id: 'md-company', label: 'Company Profile', tableReference: 'public.company' },
      { id: 'md-branch', label: 'Branch Setup', tableReference: 'public.branch' },
      { id: 'md-yard', label: 'Yard / Warehouse', tableReference: 'public.warehouse' },
      { id: 'md-items', label: 'Item Master', tableReference: 'public.item' },
      { id: 'md-parties', label: 'Sub-Accounts / Parties', tableReference: 'public.sub_account' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales Management',
    icon: TrendingUp,
    children: [
      { id: 'sales-quotation', label: 'Sales Quotation', tableReference: 'public.sales_quotation' },
      { id: 'sales-invoice', label: 'Sales Invoice', tableReference: 'public.sales_invoice' },
      { id: 'delivery-challan', label: 'Delivery Challan', tableReference: 'public.sales_invoice' },
    ],
  },
  {
    id: 'purchase',
    label: 'Purchase Management',
    icon: ShoppingCart,
    children: [
      { id: 'purchase-orders', label: 'Purchase Order', tableReference: 'public.purchase_order' },
      { id: 'purchase-invoices', label: 'Purchase Invoice', tableReference: 'public.purchase_invoice' },
      { id: 'purchase-grn', label: 'Goods Receipts (GRN)', tableReference: 'public.purchase_invoice' },
    ],
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: Boxes,
    children: [
      { id: 'inv-balances', label: 'Yard Stock Balances', tableReference: 'public.warehouse' },
      { id: 'inv-ledger', label: 'Stock Movement Ledger', tableReference: 'public.stock_ledger' },
      { id: 'inv-adjustments', label: 'Physical Adjustments', tableReference: 'public.stock_ledger' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Accounts',
    icon: Landmark,
    children: [
      { id: 'account-statements', label: 'Account Statements', tableReference: 'public.general_ledger' },
      { id: 'chart-of-accounts', label: 'Chart of Accounts', tableReference: 'public.chart_of_account' },
      { id: 'journal-vouchers', label: 'Journal Vouchers', tableReference: 'public.journal' },
    ],
  },
  {
    id: 'cash-bank',
    label: 'Cash & Bank',
    icon: Wallet,
    children: [
      { id: 'money-receipts', label: 'Money Receipts', tableReference: 'public.cash_transaction' },
      { id: 'bank-accounts', label: 'Bank & Cash Accounts', tableReference: 'public.chart_of_account' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: Users,
    children: [
      { id: 'crm-leads', label: 'Leads Management', tableReference: 'public.lead' },
      { id: 'crm-opportunities', label: 'Opportunities', tableReference: 'public.opportunity' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration & Security',
    icon: ShieldCheck,
    children: [
      { id: 'adm-users', label: 'User Directory', tableReference: 'public.app_user' },
      { id: 'adm-roles', label: 'Roles & Permissions', tableReference: 'public.role' },
      { id: 'adm-audit', label: 'Audit Trail', tableReference: 'public.audit' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: FileBarChart,
    children: [
      { id: 'rep-financial', label: 'Financial Statements' },
      { id: 'rep-sales', label: 'Sales Register' },
      { id: 'rep-purchase', label: 'Purchase Register' },
      { id: 'rep-stock', label: 'Stock Valuation Ledger' },
    ],
  },
];

export interface MainLayoutProps {
  children: React.ReactNode;
  activeModuleId?: string;
  activeSubItemId?: string;
  onNavigate?: (moduleId: string, subItemId?: string) => void;
}

export function MainLayout({
  children,
  activeModuleId: propActiveModuleId,
  activeSubItemId: propActiveSubItemId,
  onNavigate: propOnNavigate,
}: MainLayoutProps) {
  // Gracefully connect to NavigationContext when available inside router
  let navContext: ReturnType<typeof useNavigation> | null = null;
  try {
    navContext = useNavigation();
  } catch {
    // NavigationContext not mounted
  }

  const activeModuleId = propActiveModuleId || navContext?.activeModuleId || 'dashboard';
  const activeSubItemId = propActiveSubItemId || navContext?.activeSubItemId;
  const navigate = propOnNavigate || navContext?.navigate || (() => {});

  // Responsive & collapsible sidebar states
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    [activeModuleId]: true,
  });

  // User profile popover dropdown state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  // System notification drawer/popover state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  // Spotlight Command Palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Global keyboard shortcut: Ctrl+K / Cmd+K to launch command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle sub-item downward accordion
  const toggleSubmenu = (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isExpanded) {
      setIsExpanded(true);
    }
    setExpandedMenus((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleModuleClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      if (isExpanded) {
        setExpandedMenus((prev) => ({
          ...prev,
          [item.id]: !prev[item.id],
        }));
      } else {
        setIsExpanded(true);
        setExpandedMenus((prev) => ({
          ...prev,
          [item.id]: true,
        }));
      }
      navigate(item.id, item.children[0]?.id);
    } else {
      navigate(item.id);
      setIsMobileOpen(false);
    }
  };

  const handleSubItemClick = (moduleId: string, subItemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(moduleId, subItemId);
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-brand-600 selection:text-white">
      {/* PERSISTENT SYSTEM HEADER (Top Bar) */}
      <header className="sticky top-0 z-40 h-13 sm:h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shadow-2xs select-none">
        {/* Left Zone: Company Identity & Active Branch Context */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile drawer toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop sidebar expand/collapse button */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="hidden lg:flex p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Dense, Layered Typography Company Brand Lockup */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-md bg-brand-900 text-white font-bold flex items-center justify-center text-xs shrink-0 tracking-wider shadow-2xs">
              SKA
            </div>
            <div className="min-w-0 leading-tight">
              <div className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight">
                Ska Trading & Logistics
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium truncate">
                <span className="text-brand-800 font-semibold flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5 text-brand-700" />
                  Bhomra Land Port
                </span>
                <span className="text-slate-300">·</span>
                <span className="truncate">Central Yard</span>
                <span className="text-slate-300 hidden md:inline">·</span>
                <span className="font-mono text-slate-600 hidden md:inline">BDT (৳)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Zone: Spotlight Command Palette Trigger (Ctrl+K) */}
        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md mx-4">
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2 text-slate-500 group-hover:text-slate-800 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0" />
              <span className="truncate">Search ERP modules, records, tables...</span>
            </span>
            <kbd className="font-mono text-[10px] text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs shrink-0">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Zone: Command Button (Mobile), Operational Telemetry, Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile search trigger */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            aria-label="Quick search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* PostgreSQL Target Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>ska_nexus_erp</span>
          </div>

          {/* Operational Notification Center Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotificationsOpen((prev) => !prev);
                setIsUserMenuOpen(false);
              }}
              className="relative p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              aria-label="System notifications"
              title="System telemetry & notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsNotificationsOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 text-xs divide-y divide-slate-100 animate-in fade-in duration-100">
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">System Telemetry & Notifications</p>
                      <p className="text-[10px] text-slate-500 font-mono">Bhomra Port · Real-Time</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                      HEALTHY
                    </span>
                  </div>

                  <div className="p-2 space-y-1.5 max-h-64 overflow-y-auto">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>PostgreSQL Relational Baseline</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5">
                        45 database tables mapped in <code className="font-mono text-slate-700">ska_nexus_erp</code>.
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <Server className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                        <span>Central Yard Operations</span>
                      </div>
                      <p className="text-[11px] text-slate-500 pl-5">
                        Stock movement ledger calibrated to Weighted Average Cost (WAC).
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 py-2 text-[11px] text-slate-500 bg-slate-50 flex items-center justify-between">
                    <span>Audit Mode Active</span>
                    <span className="font-mono text-[10px] text-slate-400">Read-Only Safety</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Avatar Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsUserMenuOpen((prev) => !prev);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 transition-colors text-left cursor-pointer border border-transparent hover:border-slate-200"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              {/* Avatar badge */}
              <div className="w-7 h-7 rounded-full bg-brand-900 text-white flex items-center justify-center text-[11px] font-bold tracking-wider shrink-0 shadow-2xs">
                AU
              </div>
              {/* User identity & role */}
              <div className="hidden sm:block leading-tight text-left pr-0.5">
                <div className="text-xs font-semibold text-slate-900 truncate">
                  Admin User
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  Senior Auditor
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Menu Popover */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsUserMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-40 text-xs divide-y divide-slate-100">
                  <div className="px-3.5 py-2">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Authenticated Session
                    </p>
                    <p className="font-semibold text-slate-900 mt-0.5">Admin User</p>
                    <p className="text-slate-500 font-mono text-[11px]">Senior Auditor · Bhomra</p>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
                      <span>Access: <strong>Full Audit</strong></span>
                      <span className="font-mono text-emerald-600">Active</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('administration', 'adm-users');
                      }}
                      className="w-full px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors text-left cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      Auditor Profile & Permissions
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigate('administration');
                      }}
                      className="w-full px-3.5 py-1.5 text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors text-left cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Security Settings
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3.5 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors text-left cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* BODY WRAPPER: SIDEBAR + MAIN CONTENT CANVAS */}
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* RESPONSIVE & COLLAPSIBLE SIDEBAR */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 ease-in-out select-none
            ${isMobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            ${isExpanded ? 'lg:w-64' : 'lg:w-16'}
          `}
        >
          {/* Mobile Close Bar */}
          <div className="h-13 px-3 flex items-center justify-between border-b border-slate-200 lg:hidden shrink-0">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Registry Items */}
          <nav className="flex-1 overflow-y-auto erp-scrollbar py-2 px-1.5 space-y-0.5">
            {ERP_NAVIGATION_ITEMS.map((item) => {
              const isActive = activeModuleId === item.id;
              const hasChildren = item.children && item.children.length > 0;
              const isMenuExpanded = expandedMenus[item.id];
              const IconComponent = item.icon;

              return (
                <div key={item.id} className="space-y-0.5">
                  {/* Parent Module Row */}
                  <div
                    className={`
                      w-full flex items-center rounded-md transition-colors
                      ${isActive
                        ? 'bg-brand-50 text-brand-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}
                      ${!isExpanded ? 'justify-center' : 'justify-between'}
                    `}
                  >
                    <button
                      type="button"
                      onClick={() => handleModuleClick(item)}
                      title={!isExpanded ? item.label : undefined}
                      className="flex-1 flex items-center gap-2.5 px-2.5 py-1.5 text-xs font-medium truncate text-left cursor-pointer min-w-0 focus:outline-none"
                    >
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-brand-800' : 'text-slate-500'}`}
                      />
                      {isExpanded && (
                        <span className="truncate text-xs">{item.label}</span>
                      )}
                    </button>

                    {isExpanded && hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => toggleSubmenu(item.id, e)}
                        aria-label={`Toggle ${item.label} submenu`}
                        className="text-slate-400 hover:text-slate-700 p-1 mr-1 rounded hover:bg-slate-200/50 transition-colors cursor-pointer focus:outline-none shrink-0"
                      >
                        {isMenuExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expandable Downward Sub-items */}
                  {isExpanded && hasChildren && isMenuExpanded && (
                    <div className="ml-5 pl-2 border-l border-slate-200 py-0.5 space-y-0.5">
                      {item.children?.map((sub) => {
                        const isSubActive =
                          activeModuleId === item.id && activeSubItemId === sub.id;

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => handleSubItemClick(item.id, sub.id, e)}
                            className={`
                              w-full text-left px-2 py-1 text-[11px] rounded transition-colors truncate block cursor-pointer
                              ${isSubActive
                                ? 'bg-brand-100/70 text-brand-900 font-semibold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
                            `}
                          >
                            {sub.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar Footer - Compact System Info */}
          {isExpanded ? (
            <div className="p-2.5 border-t border-slate-200 bg-slate-50/60 text-[10px] text-slate-500 shrink-0 space-y-0.5">
              <div className="flex items-center justify-between font-semibold text-slate-700">
                <span className="truncate">Ska Trading & Logistics</span>
                <span className="font-mono text-slate-400">v1.0</span>
              </div>
              <div className="text-slate-400 flex items-center justify-between">
                <span>Bhomra Port · Yard 1</span>
                <span className="font-mono text-[9px] text-emerald-600 font-medium">ONLINE</span>
              </div>
            </div>
          ) : (
            <div className="p-2 border-t border-slate-200 bg-slate-50/60 flex justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500" title="Connected to ska_nexus_erp" />
            </div>
          )}
        </aside>

        {/* DYNAMIC CONTENT WRAPPER ({children}) */}
        <main className="flex-1 overflow-y-auto erp-scrollbar bg-slate-50 p-3 sm:p-5 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4">
            {children}
          </div>
        </main>
      </div>
      {/* Spotlight Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

export default MainLayout;
