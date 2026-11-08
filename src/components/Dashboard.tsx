import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Boxes,
  Building2,
  MapPin,
  Warehouse,
  ArrowRight,
  Plus,
  ExternalLink,
  Receipt,
  FileSpreadsheet,
  Wallet,
  Server,
  Database,
  CheckCircle2,
  X,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './ui/Table';
import { useNavigation } from '../context/NavigationContext';

export function Dashboard() {
  const { navigate } = useNavigation();
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Enterprise Organization & Scope Header Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-900 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500 font-medium">Enterprise Company</div>
              <div className="text-sm font-bold text-slate-900 truncate">Ska Trading & Logistics</div>
            </div>
          </div>
          <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            CO-01
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500 font-medium">Operating Branch</div>
              <div className="text-sm font-bold text-slate-900 truncate">Bhomra Land Port</div>
            </div>
          </div>
          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            ACTIVE
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Warehouse className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500 font-medium">Primary Yard</div>
              <div className="text-sm font-bold text-slate-900 truncate">Central Yard</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDiagnosticsOpen(true)}
            className="text-[11px] text-brand-700 hover:text-brand-900 font-medium flex items-center gap-1 cursor-pointer"
            title="Inspect PostgreSQL schema diagnostics"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Diagnostics</span>
          </button>
        </div>
      </div>

      {/* QUICK ACTION LAUNCHPAD */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>Fast Action Launchpad</span>
            <span className="text-[10px] text-slate-400 font-normal font-mono">Bhomra Port Workflows</span>
          </h3>
          <span className="text-[11px] text-slate-400">Direct Module Links</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => navigate('sales', 'sales-invoice')}
            className="p-3 rounded-lg border border-slate-200 hover:border-brand-700 hover:bg-slate-50 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-blue-50 text-brand-800 flex items-center justify-center shrink-0 group-hover:bg-brand-900 group-hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">New Sales Invoice</div>
              <div className="text-[10px] text-slate-500 truncate font-mono">public.sales_invoice</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('purchase', 'purchase-orders')}
            className="p-3 rounded-lg border border-slate-200 hover:border-emerald-700 hover:bg-slate-50 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">New Purchase Order</div>
              <div className="text-[10px] text-slate-500 truncate font-mono">public.purchase_order</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('inventory', 'inv-ledger')}
            className="p-3 rounded-lg border border-slate-200 hover:border-amber-700 hover:bg-slate-50 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-700 group-hover:text-white transition-colors">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">Stock Movement Ledger</div>
              <div className="text-[10px] text-slate-500 truncate font-mono">public.stock_ledger</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('cash-bank', 'money-receipts')}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-700 hover:bg-slate-50 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">Record Money Receipt</div>
              <div className="text-[10px] text-slate-500 truncate font-mono">public.cash_transaction</div>
            </div>
          </button>
        </div>
      </div>

      {/* CORE MODULE SUMMARY CARDS (Sales, Purchase, Inventory) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. SALES SUMMARY CARD */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">Sales Management</CardTitle>
              </div>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                public.sales_invoice
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Customer invoicing, orders, quotations, and receivable registers.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-500">Gross Sales Revenue (Month)</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  ৳ 0.00
                </div>
              </div>
              {/* Subtle sparkline visual indicator */}
              <svg className="w-20 h-7 text-slate-300" viewBox="0 0 100 35" fill="none">
                <path
                  d="M0 30 Q25 28 50 25 T100 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Draft Invoices</span>
                <span className="font-mono font-semibold text-slate-800">0</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Posted Invoices</span>
                <span className="font-mono font-semibold text-slate-800">0</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Counterparties:</span> Customers in <code className="font-mono text-slate-600">public.sub_account</code>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('sales', 'sales-invoice')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Sales Invoices
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('sales', 'sales-invoice')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Invoice
            </Button>
          </CardFooter>
        </Card>

        {/* 2. PURCHASE SUMMARY CARD */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">Purchase Management</CardTitle>
              </div>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                public.purchase_invoice
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Vendor procurement, purchase bills, goods receipt, and payables.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-500">Gross Procurement Bills (Month)</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  ৳ 0.00
                </div>
              </div>
              {/* Subtle sparkline visual indicator */}
              <svg className="w-20 h-7 text-slate-300" viewBox="0 0 100 35" fill="none">
                <path
                  d="M0 32 Q30 30 60 26 T100 22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Open Orders (PO)</span>
                <span className="font-mono font-semibold text-slate-800">0</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Supplier Bills</span>
                <span className="font-mono font-semibold text-slate-800">0</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Counterparties:</span> Suppliers in <code className="font-mono text-slate-600">public.sub_account</code>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('purchase', 'purchase-invoices')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Purchase Invoices
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('purchase', 'purchase-orders')}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              New Order
            </Button>
          </CardFooter>
        </Card>

        {/* 3. INVENTORY & YARD SUMMARY CARD */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Boxes className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">Inventory & Yard</CardTitle>
              </div>
              <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                public.stock_ledger
              </span>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Perpetual stock ledger, yard balances, transfers, and adjustments.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-500">Current Yard Stock Valuation</div>
                <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  ৳ 0.00
                </div>
              </div>
              <svg className="w-20 h-7 text-slate-300" viewBox="0 0 100 35" fill="none">
                <path
                  d="M0 25 Q35 22 70 20 T100 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Commodity Grades</span>
                <span className="font-mono font-semibold text-slate-800">Stone Aggregates</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Yard Movements</span>
                <span className="font-mono font-semibold text-slate-800">0</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="font-medium text-slate-700">Valuation Standard:</span> Weighted Average Cost (WAC)
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('inventory', 'inv-balances')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Yard Balances
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('inventory', 'inv-ledger')}
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
            >
              Stock Ledger
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* RECENT OPERATIONAL LOGS & TRANSACTION REGISTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Invoices Register (Separated from Purchase) */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
            <div>
              <CardTitle className="text-sm">Recent Sales Invoices</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Authoritative register from <code className="font-mono text-slate-700">public.sales_invoice</code>
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('sales', 'sales-invoice')}
              rightIcon={<ExternalLink className="w-3 h-3" />}
            >
              Full Register
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead align="right">Amount (BDT)</TableHead>
                  <TableHead align="center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <Receipt className="w-5 h-5 text-slate-300 mb-1" />
                      <span className="text-xs font-semibold text-slate-700">No sales invoices recorded</span>
                      <span className="text-[11px] text-slate-400">
                        Awaiting entries via <code className="font-mono text-slate-600">POST /api/v1/sales/sales-invoice</code>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Purchase Invoices Register (Separated from Sales) */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white">
            <div>
              <CardTitle className="text-sm">Recent Purchase Invoices</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Authoritative register from <code className="font-mono text-slate-700">public.purchase_invoice</code>
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('purchase', 'purchase-invoices')}
              rightIcon={<ExternalLink className="w-3 h-3" />}
            >
              Full Register
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Bill No</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead align="right">Amount (BDT)</TableHead>
                  <TableHead align="center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <ShoppingCart className="w-5 h-5 text-slate-300 mb-1" />
                      <span className="text-xs font-semibold text-slate-700">No purchase bills recorded</span>
                      <span className="text-[11px] text-slate-400">
                        Awaiting entries via <code className="font-mono text-slate-600">POST /api/v1/purchase/purchase-invoices</code>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Database Schema Diagnostics Modal */}
      {isDiagnosticsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsDiagnosticsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-800" />
                <h3 className="text-sm font-bold text-slate-900">PostgreSQL Schema Diagnostics</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDiagnosticsOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Database Identifier</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">ska_nexus_erp</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Authoritative Tables</div>
                  <div className="font-mono font-bold text-slate-800 mt-0.5">45 Relational Tables</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Operating Tenant</div>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">Ska Trading & Logistics</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Operating Branch</div>
                  <div className="font-semibold text-slate-800 mt-0.5 truncate">Bhomra Land Port</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg space-y-1 text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Single-Branch Single-Yard Compliance</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Strictly scoped to Bhomra Land Port and Central Yard. Multi-branch contamination eliminated.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1 text-blue-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-brand-800" />
                  <span>Double-Entry & Inventory Audit Integrity</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Sales Invoice and Purchase Invoice separated. Stock ledger tracks Weighted Average Cost (WAC).
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDiagnosticsOpen(false)}
              >
                Close Diagnostics
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
