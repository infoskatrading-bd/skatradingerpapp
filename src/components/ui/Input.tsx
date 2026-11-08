import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  suffix?: string;
  tabularNums?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      id,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      suffix,
      tabularNums = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 select-none"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full text-xs bg-white border rounded-lg px-3 py-2 text-slate-900 transition-all
              placeholder:text-slate-400 focus:outline-none focus:ring-2
              ${leftIcon ? 'pl-9' : ''}
              ${rightIcon || suffix ? 'pr-12' : ''}
              ${
                error
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20'
                  : 'border-slate-300 hover:border-slate-400 focus:border-brand-600 focus:ring-brand-500/20'
              }
              ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
              ${tabularNums ? 'font-mono tabular-nums' : ''}
              ${className}
            `}
            {...props}
          />

          {suffix && (
            <div className="absolute right-3 font-mono text-[11px] text-slate-500 pointer-events-none select-none">
              {suffix}
            </div>
          )}

          {!suffix && rightIcon && (
            <div className="absolute right-3 text-slate-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
