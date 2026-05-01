import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <i className={`${icon} absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm`} />
        )}
        <input
          id={inputId}
          className={`w-full bg-[#07101F] border rounded-lg text-sm text-white placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-[#0D1F4A]/50 transition-colors
            ${error ? 'border-red-500' : 'border-[#1E3A6E]'}
            ${icon ? 'pl-9 pr-3' : 'px-3'} py-2 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
