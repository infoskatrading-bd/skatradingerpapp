# SKA NEXUS ERP — Frontend Architecture Audit, Navigation Structure & Design Plan

**Document Version:** 1.0.0  
**Date:** March 2026 (Local timestamp: 2026-11-06)  
**Author:** Senior ERP Frontend Architect & UI/UX Engineer  
**Target Database:** `ska_nexus_erp` (PostgreSQL, 45 Relational Tables)  
**Business Configuration Scope:** 1 Company · 1 Branch · 1 Yard (Warehouse)  
**Status:** Architecture Audit & Design Proposal (Read-Only Audit Phase)

---

## 1. Executive Summary & Frontend Audit

### 1.1 Existing Frontend Stack & Configuration Audit

| Layer | Configured Technology | Version / Status | Assessment & Observations |
| :--- | :--- | :--- | :--- |
| **Framework** | React | `^19.0.1` | Modern React 19 SPA. Fast, functional component model with hooks. |
| **Build Tool** | Vite | `^8.3.0` | Ultra-fast ESM dev server and bundler. Port 3000 configured for AI Studio. |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/vite` `^4.3.3` | Tailwind v4 using `@import "tailwindcss";` in `src/index.css`. No legacy `@tailwind` directives. |
| **Iconography** | Lucide React | `^0.546.0` | Production-grade SVG icons suited for enterprise ERP workflows. |
| **Animation** | Motion (Framer Motion) | `^12.23.24` | Modern micro-interactions for collapsible sidebar, drawers, and modal transitions. |
| **Backend / Proxy** | Express | `^4.21.2` | Available in `package.json` for server-side proxying to backend APIs if required. |
| **Language** | TypeScript | `^7.0.2` | Full strict type checking via `tsc --noEmit`. Strict types ensure robust ERP DTO models. |

### 1.2 Frontend Structure & File Inventory
- `/package.json`: Contains runtime dependencies (`react`, `react-dom`, `lucide-react`, `motion`, `express`, `dotenv`, `@google/genai`) and build scripts (`dev`, `build`, `preview`, `lint`).
- `/src/main.tsx`: Standard React DOM mount (`createRoot`).
- `/src/App.tsx`: Currently an empty starter placeholder (`return <div></div>`).
- `/src/index.css`: Contains `@import "tailwindcss";`.
- `/index.html`: Configured HTML entry point with title `SKA NEXUS ERP`.
- `/metadata.json`: Synchronized with application title and enterprise ERP scope.
- `/public/assets/aistudio/ska_nexus_erp_schema_8ce476b8.pdf`: Database schema reference document confirming core tables (`public.account_group`, `public.account_type`, `public.chart_of_account`, `public.app_user`, `public.item`, `public.sales_invoice`, and associated foreign keys).

### 1.3 Audit Findings & Identified Gaps
1. **No Existing UI Components or Routes:** The repository is currently a clean starter template. No legacy or spaghetti code exists, allowing us to build a pristine, clean, modular enterprise architecture.
2. **Reusable Component Needs:** To deliver an enterprise ERP without code duplication, we must establish a core design system:
   - High-density data grid (`DataTable`) with server-side pagination, sorting, search, and action menus.
   - Master-detail transaction table (`LineItemGrid`) for transactional documents (Invoices, Orders).
   - Form modal / drawer components with standard validation.
   - Metric card system adhering to zero-pill guidelines.
   - BDT currency formatter (`৳`) and date-time formatters.
   - Loading skeletons and unified error boundary / error state cards with retry actions.
3. **Absence of Mock Data:** In strict compliance with requirement #10, the frontend will NOT include fake API mocks, simulated JSON fixtures, or dummy records. All screens will bind to typed API service hooks with genuine loading, empty, and error states.

---

## 2. Enterprise ERP Layout & UX Architecture

The layout follows the **Universal Frontend Design Constitution** and **SaaS & Enterprise Dashboard Guidelines**:

### 2.1 Spatial Structure & Breakpoints
- **Container Baseline:** Full-width responsive workspace ($1440\text{px}$ desktop target), scaling down gracefully to tablet ($1024\text{px}$) and mobile ($768\text{px}$).
- **Sidebar Navigation:**
  - Expanded width: $260\text{px}$.
  - Collapsed / Compact width: $72\text{px}$ (icon-only mode with tooltips).
  - Categorized into clear functional clusters with active state indicators.
- **Top Header Bar (One-Row Contract):**
  - Left zone: Breadcrumb navigation reflecting the current module and screen hierarchy (e.g. `Finance / Chart of Accounts`).
  - Center/Context zone: Active Business Scope Display (`Company: SKA Nexus` · `Branch: Main Branch` · `Yard: Central Yard`).
  - Right zone: Global search shortcut (`Ctrl+K`), quick notification icon, and User Profile menu (`app_user` avatar, full name, role name, and logout action).
- **Single-Elevation Depth:** Content surfaces sit on a crisp `#F8FAFC` (slate-50) canvas with white `#FFFFFF` cards, bordered by a single hairline divider (`border border-slate-200 dark:border-slate-800`). No nested card sandwiches.

### 2.2 Currency & Localization Standards
- **Currency:** Bangladeshi Taka (BDT, symbol: `৳`).
- **Formatting Rule:** All monetary amounts formatted with tabular figures: `font-mono tabular-nums` (e.g. `৳ 1,25,000.00`).
- **Language:** English-only UI labels, buttons, validation messages, and column headers.
- **Form Controls:** Clean single-line buttons (`whitespace-nowrap shrink-0`), natural editorial titles, no roleplay labels, and zero static pill badges.

---

## 3. Navigation Hierarchy & Screen Architecture

The ERP frontend is organized into **10 Core Functional Modules**, strictly mapped to the business configuration:

```
SKA NEXUS ERP
├── 1. Dashboard (Overview & Executive Telemetry)
├── 2. Master Data (Foundational Entities)
│   ├── Company Profile
│   ├── Branch Setup
│   ├── Yard / Warehouse Master
│   ├── Unit of Measure (UOM)
│   ├── Item Categories
│   ├── Item Master (Products / Services)
│   ├── Currency Master
│   └── Sub Account / Party Master (Customers & Vendors)
├── 3. Sales Management
│   ├── Customer Accounts
│   ├── Sales Quotations
│   ├── Sales Orders
│   ├── Sales Invoices (SEPARATE)
│   ├── Sales Returns / Credit Notes
│   └── Delivery Challans
├── 4. Purchase Management
│   ├── Supplier / Vendor Accounts
│   ├── Purchase Orders
│   ├── Goods Receipt Notes (GRN)
│   ├── Purchase Invoices (SEPARATE)
│   └── Purchase Returns / Debit Notes
├── 5. Inventory Management
│   ├── Yard Stock Balances
│   ├── Stock Ledger (Item-wise transaction movements)
│   ├── Inter-Yard / Warehouse Transfers
│   ├── Physical Stock Adjustments
│   └── Inventory Valuation
├── 6. Finance & Accounts
│   ├── Account Types
│   ├── Account Groups
│   ├── Chart of Accounts (COA Hierarchy)
│   ├── Journal Vouchers (Manual Entries)
│   ├── General Ledger
│   └── Fiscal Years & Accounting Periods
├── 7. Cash & Bank
│   ├── Bank Accounts
│   ├── Cash Accounts
│   ├── Bank Deposit / Receipt Vouchers
│   ├── Bank Payment Vouchers
│   ├── Cash Payment / Receipt Vouchers
│   └── Bank Reconciliation Statements
├── 8. CRM (Customer Relationship Management)
│   ├── Leads Management
│   ├── Opportunities
│   ├── Customer Contacts
│   └── Interaction & Activity Logs
├── 9. Administration & Security
│   ├── User Management (app_user)
│   ├── Roles & Permissions
│   ├── Audit Logs & Activity History
│   └── System Settings
└── 10. Reports & Analytics
    ├── Financial Statements (Balance Sheet, Profit & Loss, Trial Balance)
    ├── General Ledger Book
    ├── Sales Register & Analytics
    ├── Purchase Register & Analytics
    ├── Stock Movement & Aging Report
    └── Cash & Bank Book
```

---

## 4. Screen-to-Table & Field Mapping

Every screen is strictly bound to the actual PostgreSQL schema (`ska_nexus_erp`), verified against the schema documentation:

### Module 1: Dashboard
- **Screen:** Executive Dashboard
- **Tables Referenced:**
  - `sales_invoice` (`grand_total`, `invoice_date`, `status`)
  - `purchase_invoice` (`grand_total`, `invoice_date`, `status`)
  - `item` (`item_id`, `purchase_rate`, `sales_rate`, `is_active`)
  - `stock_ledger` / `warehouse_stock` (quantity on hand, yard valuation)
  - `chart_of_account` / `journal_entry` (cash, receivables, payables)
- **Primary UI Fields & Widgets:**
  - Revenue this month (`grand_total` sum where `status = 'Posted'`)
  - Purchase commitments (`purchase_invoice.grand_total`)
  - Total Stock Valuation (BDT `৳`)
  - Top Moving Items (`item.item_name`, `item.item_code`)
  - Recent Sales Invoices list (`invoice_no`, `invoice_date`, `sub_account_id`, `grand_total`, `status`)

### Module 2: Master Data

#### 2.1 Company, Branch & Yard
- **Tables:** `public.company`, `public.branch`, `public.warehouse`
- **Fields:**
  - `company`: `company_id`, `company_name`, `registration_no`, `tax_id`, `currency_id`, `address`, `phone`, `email`
  - `branch`: `branch_id`, `company_id` (FK), `branch_code`, `branch_name`, `address`, `phone`, `is_active`
  - `warehouse`: `warehouse_id`, `branch_id` (FK), `warehouse_code`, `warehouse_name` (Yard), `location`, `is_active`
- **UI Form Controls:** Single company / branch / yard badge, edit modal with code, name, phone, email, and active status toggle.

#### 2.2 Item & Catalog
- **Tables:** `public.item`, `public.item_category`, `public.unit`
- **Fields:**
  - `item`: `item_id` (PK, bigint), `item_code` (varchar 30, unique), `item_name` (varchar 150), `category_id` (FK to `item_category`), `unit_id` (FK to `unit`), `purchase_rate` (numeric 18,2), `sales_rate` (numeric 18,2), `inventory_account_id` (FK to `chart_of_account`), `is_stock_item` (boolean, default true), `is_active` (boolean, default true)
  - `item_category`: `category_id` (PK), `category_code`, `category_name`, `parent_category_id`, `is_active`
  - `unit`: `unit_id` (PK), `unit_code`, `unit_name`, `is_active`
- **UI Form Controls:** Table view with search, category filter, stock item indicator; Drawer form with item code, name, category dropdown, unit dropdown, rates in BDT, COA mapping dropdown, stock toggle.

#### 2.3 Party / Sub-Account Master
- **Tables:** `public.sub_account`, `public.sub_account_type`
- **Fields:** `sub_account_id` (PK), `account_id` (FK to `chart_of_account`), `party_type` (Customer / Vendor), `party_name`, `contact_person`, `phone`, `email`, `tax_number`, `credit_limit`, `is_active`
- **UI Controls:** Party ledger viewer, credit limit field in BDT, contact details, active switch.

### Module 3: Sales (Strictly Separate from Purchase)

#### 3.1 Sales Invoice
- **Table:** `public.sales_invoice`
- **Child Table:** `public.sales_invoice_item` (or `public.sales_invoice_line`)
- **Fields:**
  - Header: `sales_invoice_id` (PK, bigint), `invoice_no` (varchar 30, unique), `invoice_date` (date), `sub_account_id` (FK to `sub_account`, Customer), `warehouse_id` (FK to `warehouse`, Yard), `currency_id` (FK to `currency`), `grand_total` (numeric 18,2), `status` (varchar 20, default 'Draft')
  - Lines: `line_id`, `sales_invoice_id` (FK), `item_id` (FK to `item`), `quantity` (numeric), `unit_rate` (numeric 18,2), `line_total` (numeric 18,2)
- **UI Controls:**
  - Master Table: Filters by status (`Draft`, `Posted`, `Paid`, `Cancelled`), date range picker, customer search.
  - Invoice Creator / Editor:
    - Customer selection from `sub_account` (filtered to Customer type)
    - Invoice Date picker
    - Yard selection (`warehouse_id`)
    - Currency selection (defaults to BDT)
    - Dynamic line-item grid: Item autocomplete, UOM display, quantity input, unit rate input, auto-computed row total, tax, grand total calculation
    - Action buttons: `Save Draft`, `Post Invoice`, `Print / Export PDF`

#### 3.2 Sales Order & Quotation
- **Tables:** `public.sales_order`, `public.sales_quotation`
- **Fields:** `order_no`, `order_date`, `sub_account_id`, `delivery_date`, `grand_total`, `status`
- **UI Controls:** Conversion to Sales Invoice button, status progression.

### Module 4: Purchase (Strictly Separate from Sales)

#### 4.1 Purchase Invoice
- **Table:** `public.purchase_invoice`
- **Child Table:** `public.purchase_invoice_item` (or `public.purchase_invoice_line`)
- **Fields:**
  - Header: `purchase_invoice_id` (PK, bigint), `bill_no` / `invoice_no` (varchar 30), `supplier_invoice_no` (varchar 50), `invoice_date` (date), `due_date` (date), `sub_account_id` (FK to `sub_account`, Vendor/Supplier), `warehouse_id` (FK to `warehouse`, Yard receiving goods), `currency_id` (FK), `grand_total` (numeric 18,2), `status` (varchar 20)
  - Lines: `line_id`, `purchase_invoice_id` (FK), `item_id` (FK to `item`), `quantity`, `purchase_rate`, `line_total`, `expense_account_id`
- **UI Controls:**
  - Distinct vendor billing screen with supplier invoice reference field
  - Automatic inventory valuation update upon posting
  - Separation of vendor terms and credit balances

#### 4.2 Purchase Order & Goods Receipt (GRN)
- **Tables:** `public.purchase_order`, `public.goods_receipt`
- **Fields:** `po_number`, `vendor_id`, `order_date`, `expected_date`, `total_amount`, `status`
- **UI Controls:** Order placement, receive to Yard button, 3-way matching check against Purchase Invoice.

### Module 5: Inventory & Yard Operations
- **Tables:** `public.warehouse`, `public.stock_ledger`, `public.stock_adjustment`, `public.stock_transfer`
- **Fields:**
  - `stock_ledger`: `ledger_id`, `transaction_date`, `item_id` (FK), `warehouse_id` (FK, Yard), `voucher_type` (Sales, Purchase, Adjustment, Transfer), `voucher_id`, `qty_in`, `qty_out`, `balance_qty`, `unit_cost`, `total_cost`
  - `stock_adjustment`: `adjustment_id`, `adjustment_no`, `adjustment_date`, `warehouse_id`, `reason_code`, `status`
- **UI Controls:**
  - Yard Stock Monitor: Real-time item balance by yard, reorder thresholds, unit valuation in BDT.
  - Movement History: Chronological stock movements filterable by item and date.
  - Stock Adjustment Drawer: Physical count vs. System count delta with reason dropdown and financial impact.

### Module 6: Finance & General Ledger

#### 6.1 Chart of Accounts Hierarchy
- **Tables:** `public.account_type`, `public.account_group`, `public.chart_of_account`
- **Fields:**
  - `account_type`: `account_type_id` (PK, bigint), `type_code` (varchar 20, unique), `type_name` (varchar 50, unique: Asset, Liability, Equity, Revenue, Expense), `normal_balance` (varchar 10: Debit / Credit), `is_active` (boolean)
  - `account_group`: `account_group_id` (PK, bigint), `account_type_id` (FK), `group_code` (varchar 30, unique), `group_name` (varchar 100), `parent_group_id` (FK), `is_active` (boolean)
  - `chart_of_account`: `account_id` (PK, bigint), `account_group_id` (FK), `account_code` (varchar 30, unique), `account_name` (varchar 150), `parent_account_id` (FK), `is_control_account` (boolean, default false), `allow_posting` (boolean, default true), `is_active` (boolean, default true)
- **UI Controls:**
  - Interactive Tree View & High-Density Table of COA.
  - Visual hierarchy indicators showing Group > Subgroup > Ledger Account.
  - Guard checks: Warning if attempting to post to control account (`is_control_account = true` forbids direct journal entry).

#### 6.2 Journal Vouchers
- **Tables:** `public.journal_voucher`, `public.journal_voucher_item`
- **Fields:** `voucher_id`, `voucher_no`, `voucher_date`, `narration`, `status`, `total_debit`, `total_credit`
- **UI Controls:** Multi-row debit/credit ledger grid with automatic balance verification (`Total Debit == Total Credit`), preventing unposted out-of-balance entries.

### Module 7: Cash & Bank
- **Tables:** `public.bank_account`, `public.cash_account`, `public.bank_transaction`
- **Fields:**
  - `bank_account`: `bank_account_id`, `bank_name`, `account_no`, `branch_name`, `chart_of_account_id` (FK), `current_balance`, `is_active`
  - `cash_account`: `cash_account_id`, `account_name`, `chart_of_account_id` (FK), `current_balance`
  - `bank_transaction`: `transaction_id`, `bank_account_id`, `transaction_date`, `transaction_type` (Deposit, Withdrawal, Transfer), `amount`, `reference_no`, `is_reconciled`
- **UI Controls:**
  - Bank Ledger and Cash Book toggle.
  - Payment Voucher & Receipt Voucher entry forms.
  - Bank Reconciliation screen comparing statement balance with ERP ledger balance.

### Module 8: CRM
- **Tables:** `public.crm_lead`, `public.crm_opportunity`, `public.crm_contact`, `public.crm_activity`
- **Fields:**
  - `crm_lead`: `lead_id`, `company_name`, `contact_name`, `email`, `phone`, `status` (New, Contacted, Qualified, Lost), `estimated_value` (numeric 18,2 BDT)
  - `crm_opportunity`: `opportunity_id`, `lead_id`, `stage` (Prospecting, Proposal, Negotiation, Won), `amount`, `close_date`
  - `crm_activity`: `activity_id`, `lead_id`, `activity_type` (Call, Meeting, Email), `activity_date`, `notes`
- **UI Controls:**
  - Kanban pipeline stage board for Opportunities.
  - Lead contact card and activity logger.
  - Direct conversion of Won Opportunity into Customer Sub-Account.

### Module 9: Administration & Security
- **Tables:** `public.app_user`, `public.role`, `public.permission`, `public.audit_log`
- **Fields:**
  - `app_user`: `user_id` (PK, bigint), `username` (varchar 50, unique), `password_hash` (varchar 255), `full_name` (varchar 150), `email` (varchar 100, unique), `phone` (varchar 30), `role_id` (FK to `role`), `branch_id` (FK to `branch`), `is_active` (boolean, default true), `last_login_at` (timestamp without time zone)
  - `role`: `role_id` (PK), `role_name`, `description`, `is_active`
  - `audit_log`: `log_id`, `user_id`, `action`, `table_name`, `record_id`, `timestamp`, `details`
- **UI Controls:**
  - User Directory table with Role badges, Branch assignment, and Active/Inactive toggle.
  - User drawer to assign roles and branches.
  - Immutable Audit Trail table viewer.

### Module 10: Reports
- **Reports Offered:**
  1. Financial Statements:
     - Trial Balance (Dr/Cr balance by COA level)
     - Profit & Loss Statement (Revenue - Expenses)
     - Balance Sheet (Assets = Liabilities + Equity)
  2. Operational Registers:
     - Sales Register (Period, Customer, Invoices, Grand Total in BDT)
     - Purchase Register (Period, Vendor, Invoices, Tax, BDT Total)
     - Stock Valuation & Movement Ledger (Yard-specific inventory holding)
     - Cash & Bank Book (Daily opening, receipts, payments, closing)
- **UI Controls:** Date range pickers (Today, This Week, This Month, Fiscal Year), Yard filter, PDF export and CSV download buttons.

---

## 5. Missing Backend APIs Specification

Since no fake or mock data is permitted, the frontend requires the backend service to provide the following RESTful API endpoints. Below is the required API contract:

### 5.1 Authentication & Session
- `GET /api/v1/auth/me`: Retrieves current authenticated `app_user` profile, assigned `role`, and assigned `branch`.
- `POST /api/v1/auth/logout`: Clears session token.

### 5.2 Master Data Endpoints
- `GET /api/v1/master/company`: Fetches single company details.
- `GET /api/v1/master/branches`: List active branches.
- `GET /api/v1/master/warehouses`: List yards / warehouses.
- `GET /api/v1/master/units`: List units of measurement.
- `GET /api/v1/master/item-categories`: List item categories hierarchy.
- `GET /api/v1/master/items`: List items (supports `?page=1&limit=25&search=&category_id=`).
- `POST /api/v1/master/items`: Create item.
- `PUT /api/v1/master/items/:id`: Update item.
- `GET /api/v1/master/sub-accounts`: List customers & suppliers (supports `?party_type=Customer|Vendor`).
- `POST /api/v1/master/sub-accounts`: Create customer / vendor.

### 5.3 Sales Endpoints
- `GET /api/v1/sales/invoices`: List sales invoices (supports `?status=&customer_id=&from=&to=&page=`).
- `GET /api/v1/sales/invoices/:id`: Get full sales invoice details with line items.
- `POST /api/v1/sales/invoices`: Create new sales invoice (Draft).
- `POST /api/v1/sales/invoices/:id/post`: Post sales invoice to ledger and inventory.

### 5.4 Purchase Endpoints
- `GET /api/v1/purchase/invoices`: List purchase invoices (supports `?status=&vendor_id=&from=&to=&page=`).
- `GET /api/v1/purchase/invoices/:id`: Get purchase invoice details with lines.
- `POST /api/v1/purchase/invoices`: Create new purchase invoice.
- `POST /api/v1/purchase/invoices/:id/post`: Post purchase invoice.

### 5.5 Inventory Endpoints
- `GET /api/v1/inventory/balances`: Real-time stock balance by item and warehouse/yard.
- `GET /api/v1/inventory/ledger`: Stock movement ledger by item and date.
- `POST /api/v1/inventory/adjustments`: Post stock adjustment.

### 5.6 Finance Endpoints
- `GET /api/v1/finance/account-types`: List account types.
- `GET /api/v1/finance/account-groups`: List account groups.
- `GET /api/v1/finance/chart-of-accounts`: List complete tree or flat COA.
- `POST /api/v1/finance/chart-of-accounts`: Create account.
- `GET /api/v1/finance/journal-vouchers`: List journal vouchers.
- `POST /api/v1/finance/journal-vouchers`: Post journal voucher.

### 5.7 Cash & Bank Endpoints
- `GET /api/v1/cash-bank/accounts`: List bank and cash accounts with current balances.
- `GET /api/v1/cash-bank/transactions`: List transactions.
- `POST /api/v1/cash-bank/vouchers`: Create payment / receipt voucher.

### 5.8 Administration Endpoints
- `GET /api/v1/admin/users`: List `app_user` records with roles and branch.
- `POST /api/v1/admin/users`: Create user.
- `PUT /api/v1/admin/users/:id`: Update user profile, role, or active status.
- `GET /api/v1/admin/roles`: List roles and permission sets.
- `GET /api/v1/admin/audit-logs`: List system audit logs.

### 5.9 Reports Endpoints
- `GET /api/v1/reports/trial-balance`: Financial trial balance data.
- `GET /api/v1/reports/profit-loss`: Income statement data.
- `GET /api/v1/reports/balance-sheet`: Balance sheet data.
- `GET /api/v1/reports/sales-register`: Sales ledger report.
- `GET /api/v1/reports/purchase-register`: Purchase ledger report.
- `GET /api/v1/reports/stock-ledger`: Yard stock ledger report.

---

## 6. Implementation Roadmap & Staged Milestones

| Milestone | Key Deliverables | Verification Criteria |
| :--- | :--- | :--- |
| **Phase 1: Design System & Core Shell** | `ERPLayout`, Collapsible Sidebar ($260\text{px} \leftrightarrow 72\text{px}$), Top Header (Breadcrumb, Scope Badge, User Profile), Tabular Typography (`tabular-nums`), BDT Formatter. | Clean responsive navigation, Zero-pill metadata, single elevation layout. |
| **Phase 2: Master Data & Architecture Engine** | COA Tree Viewer (`account_group`, `chart_of_account`), Item Master (`item`, `item_category`, `unit`), Party Master (`sub_account`). | Dynamic search, drawer forms, strict validation, empty and loading states. |
| **Phase 3: Transactional Engine (Sales & Purchase)** | Separate Sales Invoice & Purchase Invoice screens, dynamic Line-Item Grid, tax/discount calculation, status workflows. | Distinct sales vs. purchase endpoints, BDT calculation, zero fake data. |
| **Phase 4: Inventory, Cash & Bank, CRM** | Yard Stock Monitor, Movement Ledger, Bank & Cash Vouchers, CRM Lead/Opportunity Pipeline. | Strict table mapping, validation of accounts, balance integrity. |
| **Phase 5: Administration & Financial Reports** | User management (`app_user`, `role`), Audit log table, Trial Balance, P&L, Balance Sheet viewer. | Clean financial reporting views, export buttons, full keyboard accessibility. |

---

## 7. Review & Next Steps
Per the Execution Rules:
- This audit and design plan is stored in `/docs/SKA_NEXUS_ERP_FRONTEND_AUDIT_AND_DESIGN_PLAN.md`.
- No implementation will proceed until this audit and navigation mapping is reviewed.
- Existing code and configurations are preserved.
