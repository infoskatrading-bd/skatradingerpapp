import React from 'react';

export function Table({
  className = '',
  children,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto erp-scrollbar border border-slate-200 rounded-xl bg-white shadow-2xs">
      <table className={`w-full text-xs text-left border-collapse ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-slate-100 bg-white ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function TableFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot className={`bg-slate-50/80 border-t border-slate-200 font-semibold text-slate-800 ${className}`} {...props}>
      {children}
    </tfoot>
  );
}

export function TableRow({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={`transition-colors hover:bg-slate-50/80 group ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
}

export function TableHead({
  className = '',
  align = 'left',
  children,
  ...props
}: TableHeadProps) {
  const alignmentClass =
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

  return (
    <th
      className={`h-10 px-3.5 sm:px-4 text-xs font-semibold text-slate-700 uppercase tracking-wider select-none ${alignmentClass} ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export function TableCell({
  className = '',
  align,
  numeric = false,
  children,
  ...props
}: TableCellProps) {
  // If numeric, default alignment to right and apply tabular monospace figures
  const effectiveAlign = align || (numeric ? 'right' : 'left');
  const alignmentClass =
    effectiveAlign === 'right' ? 'text-right' : effectiveAlign === 'center' ? 'text-center' : 'text-left';

  return (
    <td
      className={`py-2.5 px-3.5 sm:px-4 text-xs text-slate-800 align-middle ${alignmentClass} ${
        numeric ? 'font-mono tabular-nums' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
