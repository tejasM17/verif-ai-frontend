import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PasswordInput = forwardRef(({ label, error, className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Lock className="h-4 w-4 text-muted dark:text-dark-muted" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          className={`input-base h-11 pl-10 pr-10 ${
            error ? 'input-error' : ''
          } ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          autoComplete={props.name === 'confirmPassword' ? 'new-password' : 'current-password'}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted hover:text-foreground dark:text-dark-muted dark:hover:text-dark-foreground"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;