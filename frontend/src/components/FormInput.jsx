import React from "react";

export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  disabled,
  autoComplete,
  placeholder,
  required,
  icon,
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded-xl border ${
            icon ? "pl-10" : "pl-3.5"
          } pr-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 dark:border-slate-700/80 focus:border-emerald-500 focus:ring-emerald-500/20"
          }`}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-rose-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
