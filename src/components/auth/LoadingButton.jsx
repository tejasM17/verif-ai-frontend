import { Loader2 } from 'lucide-react';

export default function LoadingButton({
  children,
  isLoading,
  loadingText = 'Processing...',
  className = '',
  ...props
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all duration-200 hover:from-primary-500 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:from-primary-600 disabled:hover:to-primary-700 disabled:hover:shadow-lg disabled:hover:shadow-primary-500/20 ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}