export default function SocialLoginButton({ icon: Icon, label, onClick, isLoading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-hover hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-foreground dark:hover:bg-dark-surface-hover"
    >
      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
}