import { forwardRef } from 'react';

const AuthInput = forwardRef(({ label, error, icon: Icon, className = '', ...props }, ref) => {
  const inputId = props.id || props.name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-foreground dark:text-dark-foreground"
      >
        {label}
        {props.required && (
          <span className="ml-0.5 text-error" aria-hidden="true">*</span>
        )}
      </label>
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Icon className="h-4 w-4 text-muted dark:text-dark-muted" aria-hidden="true" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input-base h-11 ${Icon ? 'pl-10' : ''} ${
            error ? 'input-error' : ''
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;