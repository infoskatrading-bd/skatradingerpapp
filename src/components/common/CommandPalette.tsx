import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
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
  CornerDownLeft,
  X,
  FileText,
  MapPin,
  Table
} from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Modules' | 'Sub-Items' | 'Database Tables' | 'Quick Actions';
  icon: React.ComponentType<{ className?: string }>;
  moduleId: string;
  subItemId?: string;
  badge?: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Core Modules
  {
    id: 'nav-dashboard',
    title: 'Executive Dashboard',
    subtitle: 'High-density operational KPIs, registers and yard summary',
    category: 'Modules',
    icon: LayoutDashboard,
    moduleId: 'dashboard',
  },
  {
    id: 'nav-master-data',
    title: 'Master Data Hub',
    subtitle: 'Company profile, branches, warehouses, items and parties',
    category: 'Modules',
    icon: Database,
    moduleId: 'master-data',
  },
  {
    id: 'nav-sales',
    title: 'Sales Management',
    subtitle: 'Quotations, commercial sales invoices, and customer receivables',
    category: 'Modules',
    icon: TrendingUp,
    moduleId: 'sales',
    subItemId: 'sales-invoice',
  },
  {
    id: 'nav-purchase',
    title: 'Purchase & Procurement',
    subtitle: 'Purchase orders, supplier bills, and landed cost tracking',
    category: 'Modules',
    icon: ShoppingCart,
    moduleId: 'purchase',
    subItemId: 'purchase-invoices',
  },
  {
    id: 'nav-inventory',
    title: 'Inventory & Yard Operations',
    subtitle: 'Central Yard stock ledger, balances, and WAC valuation',
    category: 'Modules',
    icon: Boxes,
    moduleId: 'inventory',
    subItemId: 'inv-balances',
  },
  {
    id: 'nav-finance',
    title: 'Finance & Double-Entry Ledger',
    subtitle: 'Chart of accounts, general ledger, and journal vouchers',
    category: 'Modules',
    icon: Landmark,
    moduleId: 'finance',
    subItemId: 'account-statements',
  },
  {
    id: 'nav-cash-bank',
    title: 'Cash & Bank Management',
    subtitle: 'Money receipts, bank accounts, and liquidity registers',
    category: 'Modules',
    icon: Wallet,
    moduleId: 'cash-bank',
    subItemId: 'money-receipts',
  },
  {
    id: 'nav-crm',
    title: 'CRM & Pipeline',
    subtitle: 'Client leads, opportunities, and commodity demands',
    category: 'Modules',
    icon: Users,
    moduleId: 'crm',
    subItemId: 'crm-leads',
  },
  {
    id: 'nav-admin',
    title: 'Administration & Security',
    subtitle: 'User directory, RBAC roles, and tamper-evident audit logs',
    category: 'Modules',
    icon: ShieldCheck,
    moduleId: 'administration',
    subItemId: 'adm-users',
  },
  {
    id: 'nav-reports',
    title: 'Reports & Analytics',
    subtitle: 'Operational analytics, account statements, and tax disclosures',
    category: 'Modules',
    icon: FileBarChart,
    moduleId: 'reports',
  },

  // Authoritative Sub-Items & Workflows
  {
    id: 'act-new-sales-inv',
    title: 'Sales Invoices Register',
    subtitle: 'Commercial tax invoices bound to public.sales_invoice',
    category: 'Quick Actions',
    icon: TrendingUp,
    moduleId: 'sales',
    subItemId: 'sales-invoice',
    badge: 'public.sales_invoice',
  },
  {
    id: 'act-new-purchase-bill',
    title: 'Purchase Invoices Register',
    subtitle: 'Supplier procurement bills bound to public.purchase_invoice',
    category: 'Quick Actions',
    icon: ShoppingCart,
    moduleId: 'purchase',
    subItemId: 'purchase-invoices',
    badge: 'public.purchase_invoice',
  },
  {
    id: 'act-stock-ledger',
    title: 'Stock Movement Ledger',
    subtitle: 'Perpetual FIFO/WAC movements bound to public.stock_ledger',
    category: 'Quick Actions',
    icon: Boxes,
    moduleId: 'inventory',
    subItemId: 'inv-ledger',
    badge: 'public.stock_ledger',
  },
  {
    id: 'act-journal-voucher',
    title: 'Journal Vouchers',
    subtitle: 'Balanced double-entry journal vouchers in public.journal',
    category: 'Quick Actions',
    icon: Landmark,
    moduleId: 'finance',
    subItemId: 'journal-vouchers',
    badge: 'public.journal',
  },
  {
    id: 'act-money-receipts',
    title: 'Money Receipts Register',
    subtitle: 'Cash and banking receipts in public.cash_transaction',
    category: 'Quick Actions',
    icon: Wallet,
    moduleId: 'cash-bank',
    subItemId: 'money-receipts',
    badge: 'public.cash_transaction',
  },
  {
    id: 'act-chart-of-accounts',
    title: 'Chart of Accounts',
    subtitle: 'Hierarchical 5-tier financial tree in public.chart_of_account',
    category: 'Quick Actions',
    icon: Landmark,
    moduleId: 'finance',
    subItemId: 'chart-of-accounts',
    badge: 'public.chart_of_account',
  },

  // Authoritative Database Entities
  {
    id: 'tbl-company',
    title: 'Company Entity',
    subtitle: 'Ska Trading & Logistics profile record',
    category: 'Database Tables',
    icon: Table,
    moduleId: 'master-data',
    subItemId: 'md-company',
    badge: 'public.company',
  },
  {
    id: 'tbl-branch',
    title: 'Branch Entity',
    subtitle: 'Bhomra Land Port operating branch record',
    category: 'Database Tables',
    icon: MapPin,
    moduleId: 'master-data',
    subItemId: 'md-branch',
    badge: 'public.branch',
  },
  {
    id: 'tbl-warehouse',
    title: 'Warehouse & Yard Entity',
    subtitle: 'Central Yard physical storage location',
    category: 'Database Tables',
    icon: Table,
    moduleId: 'master-data',
    subItemId: 'md-yard',
    badge: 'public.warehouse',
  },
  {
    id: 'tbl-sub-account',
    title: 'Sub-Accounts (Customers / Suppliers)',
    subtitle: 'Counterparty master ledger',
    category: 'Database Tables',
    icon: Users,
    moduleId: 'master-data',
    subItemId: 'md-parties',
    badge: 'public.sub_account',
  },
  {
    id: 'tbl-items',
    title: 'Commodity & Item Master',
    subtitle: 'Stone aggregate grades and unit-of-measure inventory items',
    category: 'Database Tables',
    icon: FileText,
    moduleId: 'master-data',
    subItemId: 'md-items',
    badge: 'public.item',
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { navigate } = useNavigation();

  // Filter items matching query across title, subtitle, badge, and category
  const filteredItems = PALETTE_ITEMS.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard navigation inside command palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const executeItem = (item: PaletteItem) => {
    navigate(item.moduleId, item.subItemId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Dimmed backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Spotlight Command Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a module, database table, or action (e.g., 'sales', 'stock_ledger')..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-hidden font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="overflow-y-auto divide-y divide-slate-100 p-2 text-xs max-h-96"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">No matching ERP entries found</p>
              <p className="text-[11px] text-slate-400">
                Try searching for 'sales', 'purchase', 'inventory', 'company', or 'finance'
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`
                    px-3 py-2.5 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-colors
                    ${isSelected ? 'bg-brand-50 text-brand-950' : 'text-slate-700 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                        ${isSelected ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600'}
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      {item.category}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-brand-700" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span className="font-mono text-slate-400">
            {filteredItems.length} destinations
          </span>
        </div>
      </div>
    </div>
  );
}
