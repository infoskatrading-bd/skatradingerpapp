import React, { useState, useCallback } from 'react';
import {
  RotateCcw,
  Building2,
  Warehouse,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
  ShoppingCart,
  Boxes,
  Wallet,
  ArrowRight,
  ShieldAlert,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Truck
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../components/ui/Table';

/**
 * Parameter State DTO for Report Filtering Matrix
 */
export interface ReportFilterParams {
  companyId: string;
  branchId: string;
  warehouseId: string;
  fromDate: string;
  toDate: string;
}

/**
 * High-Density Operational KPI DTO
 */
export interface KPISummaryDTO {
  grossCommercialRevenue: number | null;
  netSalesTotal: number | null;
  vatAmountEightPercent: number | null;
  sourcingExpenditure: number | null;
  purchaseInvoiceCount: number | null;
  liquidCashFlowReceipts: number | null;
  moneyReceiptCount: number | null;
  inventoryCapitalizationWAC: number | null;
  trackedAggregatesTonnage: number | null;
  currency: string;
}

/**
 * Statement Line DTO
 */
export interface AccountStatementRowDTO {
  ledgerId: string;
  transactionDate: string;
  voucherId: string;
  voucherType: string;
  subAccountName: string;
  particulars: string;
  debit: number;
  credit: number;
  runningBalance: number;
}

/**
 * Dynamic Account Statement DTO
 */
export interface AccountStatementDTO {
  subAccountId?: string;
  subAccountName?: string;
  fromDate: string;
  toDate: string;
  openingBalance: number | null;
  rows: AccountStatementRowDTO[];
  closingBalance: number | null;
  totalDebit: number | null;
  totalCredit: number | null;
}

/**
 * Logistics Order Pipeline Tracking DTO
 * Sales Quotation -> Sales Invoice -> Delivery Challan
 */
export interface LogisticsPipelineRowDTO {
  pipelineId: string;
  customerName: string;
  quotationNo: string;
  quotationDate: string;
  quotationStatus: 'Approved' | 'Draft' | 'Expired';
  salesInvoiceNo: string | null;
  salesInvoiceDate: string | null;
  salesInvoiceStatus: 'Posted' | 'Draft' | 'Unissued';
  deliveryChallanNo: string | null;
  deliveryDate: string | null;
  deliveryStatus: 'Delivered' | 'In Transit' | 'Pending Yard Loading';
  commodityDescription: string; // e.g. 20mm Crushed Stone, 05-10mm Crushed Aggregates
  quantityCft: number;
  grandTotalBdt: number | null;
}

/**
 * Formatting helper for BDT Currency (৳) with strict decimal precision
 */
function formatBDT(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return '৳ --';
  }
  return `৳ ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function AnalyticsDashboard() {
  // 1. GLOBAL PARAMETER CONTROLLER (The Filtering Matrix)
  const [filters, setFilters] = useState<ReportFilterParams>({
    companyId: 'ska-trading-logistics',
    branchId: 'bhomra-land-port',
    warehouseId: 'central-yard-bhomra',
    fromDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
  });

  // Query Execution State
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'statement' | 'pipeline'>('statement');
  const [apiError, setApiError] = useState<string | null>(null);

  // Active DTO States (Strict adherence to Anti-Fake Policy: initialized to null, no mock data)
  const [kpiData, setKpiData] = useState<KPISummaryDTO>({
    grossCommercialRevenue: null,
    netSalesTotal: null,
    vatAmountEightPercent: null,
    sourcingExpenditure: null,
    purchaseInvoiceCount: null,
    liquidCashFlowReceipts: null,
    moneyReceiptCount: null,
    inventoryCapitalizationWAC: null,
    trackedAggregatesTonnage: null,
    currency: 'BDT',
  });

  const [statementData, setStatementData] = useState<AccountStatementDTO>({
    fromDate: filters.fromDate,
    toDate: filters.toDate,
    openingBalance: null,
    rows: [],
    closingBalance: null,
    totalDebit: null,
    totalCredit: null,
  });

  const [pipelineData, setPipelineData] = useState<LogisticsPipelineRowDTO[]>([]);

  // Horizon Quick Presets
  const setDatePreset = (preset: 'today' | 'mtd' | 'qtd' | 'fy') => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'today') {
      setFilters((prev) => ({ ...prev, fromDate: todayStr, toDate: todayStr }));
    } else if (preset === 'mtd') {
      const fromStr = new Date(y, m, 1).toISOString().split('T')[0];
      setFilters((prev) => ({ ...prev, fromDate: fromStr, toDate: todayStr }));
    } else if (preset === 'qtd') {
      const qMonth = Math.floor(m / 3) * 3;
      const fromStr = new Date(y, qMonth, 1).toISOString().split('T')[0];
      setFilters((prev) => ({ ...prev, fromDate: fromStr, toDate: todayStr }));
    } else if (preset === 'fy') {
      const fyStart = m >= 6 ? `${y}-07-01` : `${y - 1}-07-01`;
      setFilters((prev) => ({ ...prev, fromDate: fyStart, toDate: todayStr }));
    }
  };

  // Execute Parameterized Server Query
  const handleSyncReport = useCallback(async () => {
    // Validate date horizon integrity
    if (filters.fromDate > filters.toDate) {
      setApiError('Date Range Horizon error: fromDate cannot be after toDate.');
      return;
    }

    setApiError(null);
    setIsSyncing(true);

    try {
      // In accordance with ERP Accounting Rules:
      // Client-side arithmetic for accounting summaries is strictly prohibited.
      // Balances must be calculated server-side from PostgreSQL general_ledger rows.
      const queryParams = new URLSearchParams({
        companyId: filters.companyId,
        branchId: filters.branchId,
        warehouseId: filters.warehouseId,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      });

      const response = await fetch(`/api/v1/reports/analytics?${queryParams.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 502 || response.status === 503) {
          // Expected when backend pipeline is unlinked
          throw new Error('Authorized API Connectivity Required: Backend endpoint GET /api/v1/reports/analytics is currently unlinked or provisioning.');
        }
        throw new Error(`Report query failed with HTTP status ${response.status}`);
      }

      const json = await response.json();
      setKpiData(json.kpiSummary);
      setStatementData(json.statement);
      setPipelineData(json.pipeline);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown network failure';
      setApiError(message);
    } finally {
      setIsSyncing(false);
    }
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* 1. GLOBAL PARAMETER CONTROLLER (The Filtering Matrix) */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Filter Matrix Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 flex-1">
            {/* Company & Branch Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Company / Branch
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={`${filters.companyId}:${filters.branchId}`}
                  onChange={(e) => {
                    const [companyId, branchId] = e.target.value.split(':');
                    setFilters((prev) => ({ ...prev, companyId, branchId }));
                  }}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:border-brand-600 focus:bg-white focus:outline-none transition-colors text-slate-900 font-medium"
                >
                  <option value="ska-trading-logistics:bhomra-land-port">
                    Ska Trading · Bhomra Land Port
                  </option>
                </select>
              </div>
            </div>

            {/* Yard / Warehouse Selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Yard / Warehouse
              </label>
              <div className="relative">
                <Warehouse className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={filters.warehouseId}
                  onChange={(e) => setFilters((prev) => ({ ...prev, warehouseId: e.target.value }))}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:border-brand-600 focus:bg-white focus:outline-none transition-colors text-slate-900 font-medium"
                >
                  <option value="central-yard-bhomra">Central Yard (Bhomra Port)</option>
                </select>
              </div>
            </div>

            {/* Global Date Horizon From */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Date Horizon From
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, fromDate: e.target.value }))}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:border-brand-600 focus:bg-white focus:outline-none transition-colors text-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Global Date Horizon To */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Date Horizon To
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => setFilters((prev) => ({ ...prev, toDate: e.target.value }))}
                  className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded focus:border-brand-600 focus:bg-white focus:outline-none transition-colors text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Trigger: Sync Report */}
          <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-3">
            <Button
              variant="primary"
              size="sm"
              isLoading={isSyncing}
              onClick={handleSyncReport}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="w-full lg:w-auto"
            >
              Sync Report
            </Button>
          </div>
        </div>

        {/* Filter State Metadata & Horizon Presets */}
        <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700">Quick Horizon:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDatePreset('today')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDatePreset('mtd')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                MTD
              </button>
              <button
                type="button"
                onClick={() => setDatePreset('qtd')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                QTD
              </button>
              <button
                type="button"
                onClick={() => setDatePreset('fy')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
              >
                FY 2026/27
              </button>
            </div>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
              {filters.fromDate} → {filters.toDate}
            </span>
            <span className="text-slate-300">·</span>
            <span>Accounting Currency: <strong>BDT (৳)</strong></span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {lastSyncedAt ? `Last Query: ${lastSyncedAt}` : 'Awaiting Query Execution'}
          </div>
        </div>
      </div>

      {/* 2. HIGH-DENSITY OPERATIONAL KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Gross Commercial Revenue */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
              Gross Commercial Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-brand-700 shrink-0" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatBDT(kpiData.grossCommercialRevenue)}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>Net Sales: <strong className="font-mono text-slate-700">{formatBDT(kpiData.netSalesTotal)}</strong></span>
            <span>VAT Amount: <strong className="font-mono text-slate-700">{formatBDT(kpiData.vatAmountEightPercent)}</strong></span>
          </div>
        </div>

        {/* Card 2: Sourcing Expenditure */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
              Sourcing Expenditure
            </span>
            <ShoppingCart className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatBDT(kpiData.sourcingExpenditure)}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>Bills: <strong className="font-mono text-slate-700">{kpiData.purchaseInvoiceCount ?? '--'}</strong></span>
            <span>Target: <code className="font-mono text-[9px] text-slate-600">public.purchase_invoice</code></span>
          </div>
        </div>

        {/* Card 3: Liquid Cash Flow Acceleration */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
              Liquid Cash Flow Acceleration
            </span>
            <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatBDT(kpiData.liquidCashFlowReceipts)}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>Receipts: <strong className="font-mono text-slate-700">{kpiData.moneyReceiptCount ?? '--'}</strong></span>
            <span>Cash & Bank Books</span>
          </div>
        </div>

        {/* Card 4: Inventory Capitalization Value */}
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">
              Inventory Capitalization
            </span>
            <Boxes className="w-4 h-4 text-indigo-600 shrink-0" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatBDT(kpiData.inventoryCapitalizationWAC)}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex justify-between">
            <span>Running WAC</span>
            <span>Aggregates / Stones</span>
          </div>
        </div>
      </div>

      {/* 3. FLEXIBLE STATEMENT & TRANSACTION AUDIT GRID */}
      <Card>
        {/* Navigation Tabs Header */}
        <div className="p-2 sm:p-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('statement')}
              className={`
                px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer
                ${activeTab === 'statement'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
              `}
            >
              Tab A: Dynamic Account Statement
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`
                px-3 py-1.5 text-xs font-semibold rounded transition-colors cursor-pointer
                ${activeTab === 'pipeline'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}
              `}
            >
              Tab B: Sales & Inventory Movement
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              disabled
              title="Export stream requires backend PDF/CSV endpoint integration"
              className="opacity-60 cursor-not-allowed"
            >
              Export Unavailable
            </Button>
          </div>
        </div>

        {/* TAB A: DYNAMIC ACCOUNT STATEMENT VIEW */}
        {activeTab === 'statement' && (
          <div className="p-0">
            {/* Statement Opening Balance Strip */}
            <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Opening Balance</span>
                <span className="text-slate-400 text-[11px]">(Cumulative net ledger entries prior to {filters.fromDate}):</span>
              </div>
              <div className="font-mono font-bold text-slate-900 tabular-nums">
                {formatBDT(statementData.openingBalance)}
              </div>
            </div>

            {/* Chronological Transactional Ledger Rows */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Date</TableHead>
                  <TableHead className="w-32">Voucher / Ref ID</TableHead>
                  <TableHead className="w-28">Type</TableHead>
                  <TableHead>Sub-Account Name</TableHead>
                  <TableHead>Particulars / Memo</TableHead>
                  <TableHead align="right" className="w-32">Debit (৳)</TableHead>
                  <TableHead align="right" className="w-32">Credit (৳)</TableHead>
                  <TableHead align="right" className="w-36">Running Balance (৳)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statementData.rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                          <FileSpreadsheet className="w-5 h-5 opacity-70" />
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          Account Statement Awaiting Parameterized Query
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Click <strong className="text-slate-700">Sync Report</strong> to fetch authoritative double-entry general ledger rows from <code className="font-mono text-slate-700">public.general_ledger</code>. Client-side arithmetic is disabled.
                        </p>
                        {apiError && (
                          <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-700 text-left font-mono">
                            {apiError}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  statementData.rows.map((row) => (
                    <TableRow key={row.ledgerId}>
                      <TableCell className="font-mono text-slate-700 text-[11px]">{row.transactionDate}</TableCell>
                      <TableCell className="font-mono font-semibold text-brand-900 text-[11px]">{row.voucherId}</TableCell>
                      <TableCell className="text-slate-600 text-[11px]">{row.voucherType}</TableCell>
                      <TableCell className="font-medium text-slate-900">{row.subAccountName}</TableCell>
                      <TableCell className="text-slate-600 text-[11px] truncate max-w-xs">{row.particulars}</TableCell>
                      <TableCell numeric className="text-slate-900">{formatBDT(row.debit)}</TableCell>
                      <TableCell numeric className="text-slate-900">{formatBDT(row.credit)}</TableCell>
                      <TableCell numeric className="font-semibold text-slate-900">{formatBDT(row.runningBalance)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Statement Closing Balance Strip */}
            <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">Closing Balance</span>
                <span className="text-slate-500 text-[11px]">(Terminal mathematical value up to {filters.toDate}):</span>
              </div>
              <div className="font-mono font-bold text-base text-slate-900 tabular-nums">
                {formatBDT(statementData.closingBalance)}
              </div>
            </div>
          </div>
        )}

        {/* TAB B: SALES & INVENTORY MOVEMENT */}
        {activeTab === 'pipeline' && (
          <div className="p-0">
            {/* Schema Disclosure Banner */}
            <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200 flex items-start gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Schema Disclosure:</span> Independent Delivery Challan tracking is not currently supported by the 45-table PostgreSQL schema (<code className="font-mono text-[11px] font-semibold text-amber-950">ska_nexus_erp</code>). Independent 3-way matching is unavailable until a dedicated delivery tracking entity is established.
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Truck className="w-4 h-4 text-brand-700" />
                <span>Sales & Inventory Movement Tracking:</span>
                <span className="font-mono text-slate-600 font-bold">Sales Quotation → Sales Invoice (Stock Ledger)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Unit: CFT / Ton</span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Aggregates / Commodity</TableHead>
                  <TableHead className="w-36">Sales Quotation</TableHead>
                  <TableHead className="w-36">Sales Invoice</TableHead>
                  <TableHead className="w-40">Dispatch / Challan Ref</TableHead>
                  <TableHead align="right" className="w-24">Qty (CFT)</TableHead>
                  <TableHead align="right" className="w-32">Total (BDT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                          <Truck className="w-5 h-5 opacity-70" />
                        </div>
                        <div className="text-xs font-semibold text-slate-800">
                          Movement Records Awaiting Backend Synchronization
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Click <strong className="text-slate-700">Sync Report</strong> to fetch verified movement records dispatched from Central Yard, Bhomra Land Port. Independent Delivery Challan matching is not currently supported by the database schema.
                        </p>
                        {apiError && (
                          <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-700 text-left font-mono">
                            {apiError}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pipelineData.map((pipe) => (
                    <TableRow key={pipe.pipelineId}>
                      <TableCell className="font-semibold text-slate-900">{pipe.customerName}</TableCell>
                      <TableCell className="text-slate-700 text-[11px]">{pipe.commodityDescription}</TableCell>
                      <TableCell>
                        <div className="font-mono text-[11px] font-semibold text-slate-800">{pipe.quotationNo}</div>
                        <div className="text-[10px] text-slate-400">{pipe.quotationDate} · {pipe.quotationStatus}</div>
                      </TableCell>
                      <TableCell>
                        {pipe.salesInvoiceNo ? (
                          <>
                            <div className="font-mono text-[11px] font-semibold text-brand-900">{pipe.salesInvoiceNo}</div>
                            <div className="text-[10px] text-slate-400">{pipe.salesInvoiceDate} · {pipe.salesInvoiceStatus}</div>
                          </>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unbilled</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {pipe.deliveryChallanNo ? (
                          <>
                            <div className="font-mono text-[11px] font-semibold text-emerald-800">{pipe.deliveryChallanNo}</div>
                            <div className="text-[10px] text-slate-400">{pipe.deliveryDate} · {pipe.deliveryStatus}</div>
                          </>
                        ) : (
                          <span className="text-[10px] text-amber-600 font-medium">Pending Challan</span>
                        )}
                      </TableCell>
                      <TableCell numeric className="font-semibold text-slate-900">
                        {pipe.quantityCft.toLocaleString()}
                      </TableCell>
                      <TableCell numeric className="font-bold text-slate-900">
                        {formatBDT(pipe.grandTotalBdt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* 4. COMPLIANCE & AUDIT ASSURANCE FOOTER */}
      <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-brand-800 shrink-0" />
          <span className="font-semibold text-slate-800">Double-Entry & Report Integrity Guard:</span>
          <span className="text-slate-500">Financial registers are 100% backend-calculated from PostgreSQL catalog. No client-side ledger modification permitted.</span>
        </div>
        <div className="font-mono text-[10px] text-slate-500 shrink-0">
          ska_nexus_erp :: general_ledger
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
